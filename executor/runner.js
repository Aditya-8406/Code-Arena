const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const TEMP_BASE_DIR = path.resolve(__dirname, 'temp');

// Ensure base temp directory exists
if (!fs.existsSync(TEMP_BASE_DIR)) {
  fs.mkdirSync(TEMP_BASE_DIR, { recursive: true });
}

/**
 * Normalizes test output for consistent string comparison:
 * - Converts CRLF to LF
 * - Trims trailing whitespace from each line
 * - Trims leading and trailing overall whitespace
 */
function normalizeOutput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Executes code in a secure temporary sandbox directory
 * @param {string} language - 'cpp', 'python', or 'javascript'
 * @param {string} sourceCode - code to execute
 * @param {string} input - stdin data
 * @param {number} timeoutMs - maximum runtime in ms (default 3000ms)
 */
async function executeCode(language, sourceCode, input = '', timeoutMs = 3000) {
  const jobId = uuidv4();
  const jobDir = path.join(TEMP_BASE_DIR, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  // Minimal sanitized environment (never pass process.env secrets)
  const safeEnv = {
    PATH: process.env.PATH || '',
    SYSTEMROOT: process.env.SYSTEMROOT || '',
    TEMP: jobDir,
    TMP: jobDir,
  };

  const startTime = Date.now();

  try {
    let executableCmd = '';
    let executableArgs = [];
    let sourceFileName = '';

    if (language === 'python') {
      sourceFileName = 'solution.py';
      fs.writeFileSync(path.join(jobDir, sourceFileName), sourceCode, 'utf8');
      executableCmd = 'python';
      executableArgs = ['-u', sourceFileName]; // unbuffered
    } else if (language === 'javascript') {
      sourceFileName = 'solution.js';
      fs.writeFileSync(path.join(jobDir, sourceFileName), sourceCode, 'utf8');
      executableCmd = 'node';
      executableArgs = [sourceFileName];
    } else if (language === 'cpp') {
      sourceFileName = 'solution.cpp';
      const exeFileName = process.platform === 'win32' ? 'solution.exe' : 'solution.out';
      fs.writeFileSync(path.join(jobDir, sourceFileName), sourceCode, 'utf8');

      // Compile C++ with g++
      const compileStartTime = Date.now();
      try {
        execSync(`g++ -O2 -std=c++14 ${sourceFileName} -o ${exeFileName}`, {
          cwd: jobDir,
          env: safeEnv,
          timeout: 7000,
          stdio: ['pipe', 'pipe', 'pipe'],
        });
      } catch (compileErr) {
        const errorOutput = compileErr.stderr ? compileErr.stderr.toString() : compileErr.message;
        return {
          status: 'COMPILATION_ERROR',
          output: '',
          error: errorOutput.slice(0, 4000),
          executionTime: Date.now() - compileStartTime,
        };
      }

      executableCmd = path.join(jobDir, exeFileName);
      executableArgs = [];
    } else {
      return {
        status: 'RUNTIME_ERROR',
        output: '',
        error: `Unsupported language: ${language}`,
        executionTime: 0,
      };
    }

    // Execute the program with stdin and timeout
    const result = await new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let isTimedOut = false;
      let isKilled = false;
      const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB cap

      const child = spawn(executableCmd, executableArgs, {
        cwd: jobDir,
        env: safeEnv,
        windowsHide: true,
      });

      const timer = setTimeout(() => {
        isTimedOut = true;
        isKilled = true;
        try {
          if (process.platform === 'win32') {
            execSync(`taskkill /pid ${child.pid} /f /t`, { stdio: 'ignore' });
          } else {
            child.kill('SIGKILL');
          }
        } catch (_) {}
      }, timeoutMs);

      child.stdout.on('data', (data) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += data.toString();
        } else if (!isKilled) {
          isKilled = true;
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${child.pid} /f /t`, { stdio: 'ignore' });
            } else {
              child.kill('SIGKILL');
            }
          } catch (_) {}
        }
      });

      child.stderr.on('data', (data) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += data.toString();
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          status: 'RUNTIME_ERROR',
          output: stdout,
          error: err.message,
          executionTime: Date.now() - startTime,
        });
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const executionTime = Date.now() - startTime;

        if (isTimedOut) {
          resolve({
            status: 'TIME_LIMIT_EXCEEDED',
            output: stdout,
            error: `Time Limit Exceeded (${timeoutMs}ms)`,
            executionTime: timeoutMs,
          });
        } else if (code !== 0) {
          resolve({
            status: 'RUNTIME_ERROR',
            output: stdout,
            error: stderr || `Process exited with error code ${code}`,
            executionTime,
          });
        } else {
          resolve({
            status: 'SUCCESS',
            output: stdout,
            error: null,
            executionTime,
          });
        }
      });

      // Write stdin
      try {
        if (input !== undefined && input !== null) {
          child.stdin.write(input);
        }
        child.stdin.end();
      } catch (pipeErr) {
        // Child might have exited immediately
      }
    });

    return result;
  } finally {
    // Clean up temporary sandbox directory
    try {
      fs.rmSync(jobDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

/**
 * Evaluates code against multiple test cases
 * @param {string} language
 * @param {string} sourceCode
 * @param {Array<{input: string, expectedOutput: string}>} testCases
 * @param {boolean} isHidden - whether to hide actual inputs in failure reports
 */
async function evaluateSubmission(language, sourceCode, testCases = [], isHidden = false) {
  if (!testCases || testCases.length === 0) {
    return {
      status: 'RUNTIME_ERROR',
      passedTests: 0,
      totalTests: 0,
      executionTime: 0,
      results: [],
      error: 'No test cases available for evaluation',
    };
  }

  let passedTests = 0;
  let totalTime = 0;
  const results = [];
  let finalStatus = 'ACCEPTED';
  let overallError = null;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execResult = await executeCode(language, sourceCode, tc.input);
    totalTime += execResult.executionTime;

    if (execResult.status === 'COMPILATION_ERROR') {
      return {
        status: 'COMPILATION_ERROR',
        passedTests: 0,
        totalTests: testCases.length,
        executionTime: execResult.executionTime,
        results: [],
        error: execResult.error,
      };
    }

    if (execResult.status === 'TIME_LIMIT_EXCEEDED') {
      finalStatus = 'TIME_LIMIT_EXCEEDED';
      overallError = execResult.error;
      results.push({
        testCaseIndex: i + 1,
        status: 'TIME_LIMIT_EXCEEDED',
        passed: false,
        time: execResult.executionTime,
        input: isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: execResult.output,
        error: execResult.error,
      });
      break; // Stop on first TLE or error
    }

    if (execResult.status === 'RUNTIME_ERROR') {
      finalStatus = 'RUNTIME_ERROR';
      overallError = execResult.error;
      results.push({
        testCaseIndex: i + 1,
        status: 'RUNTIME_ERROR',
        passed: false,
        time: execResult.executionTime,
        input: isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: execResult.output,
        error: execResult.error,
      });
      break;
    }

    // Compare normalized outputs
    const actualNorm = normalizeOutput(execResult.output);
    const expectedNorm = normalizeOutput(tc.expectedOutput);
    const isPassed = actualNorm === expectedNorm;

    if (isPassed) {
      passedTests++;
      results.push({
        testCaseIndex: i + 1,
        status: 'ACCEPTED',
        passed: true,
        time: execResult.executionTime,
        input: isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: isHidden ? '[Passed]' : execResult.output,
      });
    } else {
      if (finalStatus === 'ACCEPTED') {
        finalStatus = 'WRONG_ANSWER';
      }
      results.push({
        testCaseIndex: i + 1,
        status: 'WRONG_ANSWER',
        passed: false,
        time: execResult.executionTime,
        input: isHidden ? '[Hidden Test Case]' : tc.input,
        expectedOutput: isHidden ? '[Hidden]' : tc.expectedOutput,
        actualOutput: isHidden ? '[Wrong Output]' : execResult.output,
      });
      // For hidden test cases, stop after first failure for competitive programming standard
      if (isHidden) break;
    }
  }

  const avgTime = Math.round(totalTime / Math.max(1, results.length));

  return {
    status: passedTests === testCases.length ? 'ACCEPTED' : finalStatus,
    passedTests,
    totalTests: testCases.length,
    executionTime: avgTime,
    results,
    error: overallError,
  };
}

module.exports = {
  executeCode,
  evaluateSubmission,
  normalizeOutput,
};
