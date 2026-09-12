import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { CodeEditor } from '../components/editor/CodeEditor';
import { ConsoleOutput } from '../components/editor/ConsoleOutput';
import { DifficultyBadge } from '../components/common/BadgePill';
import { ConfirmModal } from '../components/common/Modal';
import {
  Timer,
  Play,
  Send,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const AssessmentRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active problem selection
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // Editor states per problem
  const [language, setLanguage] = useState('python');
  const [codes, setCodes] = useState({}); // { [problemId]: code }

  // Problem submission statuses in assessment: { [problemId]: 'ACCEPTED' | 'ATTEMPTED' | 'UNATTEMPTED' }
  const [problemStatuses, setProblemStatuses] = useState({});

  // Code Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleResults, setConsoleResults] = useState(null);

  // Timer states (in seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const timerRef = useRef(null);

  // 1. Fetch Assessment and Initialize Timer from server
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        // Start or retrieve attempt
        await api.startAssessment(id);
        const res = await api.getAssessmentById(id);

        if (res.success && res.assessment) {
          setAssessment(res.assessment);

          if (res.attempt?.isCompleted) {
            navigate(`/assessments/${id}/results`);
            return;
          }

          const remSeconds = res.attempt?.timeRemainingSeconds ?? res.assessment.duration * 60;
          setSecondsRemaining(remSeconds);

          // Initialize starter codes
          const initialCodes = {};
          res.assessment.problems.forEach((p) => {
            const prob = p.problem;
            if (prob) {
              initialCodes[prob._id] = prob.starterCode?.python || '# Write solution\n';
            }
          });
          setCodes(initialCodes);
        }
      } catch (err) {
        setError(err.message || 'Failed to enter assessment room');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id, navigate]);

  // 2. Countdown Timer Loop
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmitOnExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [secondsRemaining]);

  const currentProblem = assessment?.problems?.[currentProblemIndex]?.problem;
  const currentCode = currentProblem ? codes[currentProblem._id] || '' : '';

  const setCurrentCode = (newCode) => {
    if (currentProblem) {
      setCodes((prev) => ({ ...prev, [currentProblem._id]: newCode }));
    }
  };

  // Run Code against sample cases
  const handleRunCode = async () => {
    if (!currentProblem) return;
    setIsExecuting(true);
    setConsoleResults(null);

    try {
      const res = await api.runCode({
        problemId: currentProblem._id,
        language,
        sourceCode: currentCode,
      });
      setConsoleResults(res);
    } catch (err) {
      setConsoleResults({
        status: 'RUNTIME_ERROR',
        error: err.message,
        results: [],
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit Code for this assessment problem
  const handleSubmitCode = async () => {
    if (!currentProblem) return;
    setIsExecuting(true);
    setConsoleResults(null);

    try {
      const res = await api.submitCode({
        problemId: currentProblem._id,
        language,
        sourceCode: currentCode,
        assessmentId: assessment._id,
      });

      setConsoleResults({
        status: res.submission.status,
        passedTests: res.submission.passedTests,
        totalTests: res.submission.totalTests,
        executionTime: res.submission.executionTime,
        error: res.submission.errorMessage,
        results: [],
      });

      setProblemStatuses((prev) => ({
        ...prev,
        [currentProblem._id]: res.submission.status === 'ACCEPTED' ? 'ACCEPTED' : 'ATTEMPTED',
      }));
    } catch (err) {
      setConsoleResults({
        status: 'RUNTIME_ERROR',
        error: err.message,
        results: [],
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Final Assessment Submission (Auto on timeout or Manual)
  const handleFinalSubmit = async () => {
    try {
      setIsSubmittingAssessment(true);
      await api.submitAssessment(id);
      navigate(`/assessments/${id}/results`);
    } catch (err) {
      alert('Assessment submission error: ' + err.message);
      navigate(`/assessments/${id}/results`);
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  const handleAutoSubmitOnExpire = async () => {
    alert('Time has expired! Submitting your assessment automatically...');
    await handleFinalSubmit();
  };

  // Format MM:SS
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Entering synchronized assessment room...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-rose-400">
        {error || 'Assessment not available'}
      </div>
    );
  }

  const isTimerLow = secondsRemaining < 300; // Under 5 mins

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Top Header & Server Countdown Timer */}
      <div className="flex items-center justify-between bg-[#111827] border border-gray-800 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">{assessment.title}</h1>
          <p className="text-xs text-gray-400">
            Problem {currentProblemIndex + 1} of {assessment.problems.length} • Max Marks: {assessment.totalMarks}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Synchronized Timer Display */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold ${
              isTimerLow
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-gray-800 border-gray-700 text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Time Left: {formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow"
          >
            Finish & Submit
          </button>
        </div>
      </div>

      {/* Problem Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {assessment.problems.map((p, idx) => {
          const prob = p.problem;
          const status = prob ? problemStatuses[prob._id] : 'UNATTEMPTED';
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentProblemIndex(idx);
                setConsoleResults(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition ${
                currentProblemIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-[#111827] text-gray-400 hover:text-white border-gray-800'
              }`}
            >
              <span>Q{idx + 1}. {prob?.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
                {p.points || 25} pts
              </span>
              {status === 'ACCEPTED' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Split Assessment Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Statement */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-2xl p-6 h-[720px] overflow-y-auto space-y-4">
          {currentProblem && (
            <>
              <div className="flex items-center gap-2">
                <DifficultyBadge difficulty={currentProblem.difficulty} />
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {currentProblem.topic}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{currentProblem.title}</h2>

              <div className="text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-3 whitespace-pre-line">
                {currentProblem.description}
              </div>

              {currentProblem.examples && currentProblem.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Example
                  </h4>
                  {currentProblem.examples.slice(0, 2).map((ex, i) => (
                    <div key={i} className="bg-[#0c101c] p-3 rounded-lg border border-gray-800 text-xs font-mono space-y-1">
                      <div>Input: <span className="text-gray-200">{ex.input}</span></div>
                      <div>Output: <span className="text-emerald-300">{ex.output}</span></div>
                    </div>
                  ))}
                </div>
              )}

              {currentProblem.constraints && (
                <div className="pt-2 text-xs">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Constraints
                  </h4>
                  <pre className="bg-[#0c101c] p-2.5 rounded border border-gray-800 text-gray-300">
                    {currentProblem.constraints}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Code Editor & Console */}
        <div className="lg:col-span-7 flex flex-col h-[720px]">
          <div className="flex-1 min-h-[420px]">
            <CodeEditor
              language={language}
              setLanguage={setLanguage}
              code={currentCode}
              setCode={setCurrentCode}
              onResetCode={() => {
                if (currentProblem) {
                  setCurrentCode(currentProblem.starterCode?.[language] || '');
                }
              }}
              isExecuting={isExecuting}
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-2.5 px-2">
            <span className="text-xs text-gray-400">
              Submit evaluates hidden tests and saves your progress for this problem.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isExecuting}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                Run Code
              </button>
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={isExecuting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Solution
              </button>
            </div>
          </div>

          <div className="h-[230px]">
            <ConsoleOutput
              results={consoleResults}
              activeTab="testcases"
              setActiveTab={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal to finish assessment */}
      <ConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleFinalSubmit}
        title="Submit Assessment"
        message="Are you sure you want to finalize and submit your assessment? You will not be able to change your solutions after submission."
        confirmText="Yes, Submit Now"
        isDanger={false}
      />
    </div>
  );
};
