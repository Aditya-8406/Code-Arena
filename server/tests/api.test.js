const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');
const { executeCode, evaluateSubmission } = require('../../executor/runner');
const { getPersonalizedRecommendations } = require('../services/recommendationService');
const { processAcceptedSubmission, calculateLevel, updateStreak } = require('../services/gamificationService');

let passedTestsCount = 0;
let totalTestsCount = 0;

function assert(condition, message) {
  totalTestsCount++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTestsCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('\n=================================================');
  console.log('🧪 RUNNING CODEARENA AUTOMATED SYSTEM & API TESTS');
  console.log('=================================================\n');

  try {
    await connectDB();

    // 1. Database Connection & Seed Validation
    console.log('📋 1. Database Persistence & Models:');
    const problemCount = await Problem.countDocuments();
    assert(problemCount >= 20, `Database contains ${problemCount} problems (>= 20 required)`);

    const adminUser = await User.findOne({ role: 'admin' }).select('+password');
    assert(adminUser !== null, 'Admin account exists');
    const isPassValid = await adminUser.matchPassword('Admin@123');
    assert(isPassValid === true, 'Admin password hashes and verifies with bcrypt');

    // 2. Unit Testing: Gamification Logic
    console.log('\n🎮 2. Gamification & Streaks:');
    assert(calculateLevel(50) === 1, 'Level 1 for 50 points');
    assert(calculateLevel(150) === 2, 'Level 2 for 150 points');
    assert(calculateLevel(350) === 3, 'Level 3 for 350 points');
    assert(calculateLevel(750) === 4, 'Level 4 for 750 points');
    assert(calculateLevel(1200) === 5, 'Level 5 for 1200 points');

    // Test streak logic
    const testUser = new User({
      name: 'Test Streak User',
      email: 'streak_test@codearena.com',
      password: 'Password123',
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: new Date(Date.now() - 86400000), // Yesterday
    });
    updateStreak(testUser);
    assert(testUser.currentStreak === 6, 'Streak increments by 1 for consecutive day');
    assert(testUser.longestStreak === 6, 'Longest streak tracks new high');

    // Test streak gap
    testUser.lastActiveDate = new Date(Date.now() - 3 * 86400000); // 3 days ago
    updateStreak(testUser);
    assert(testUser.currentStreak === 1, 'Streak resets to 1 after inactivity gap');

    // 3. Code Execution Engine Testing
    console.log('\n⚙️  3. Code Execution Sandbox:');
    // Python Test
    const pyCode = `import sys; x = sys.stdin.read().strip(); print(f"Hello, {x}!")`;
    const pyRes = await executeCode('python', pyCode, 'CodeArena');
    assert(pyRes.status === 'SUCCESS', `Python execution status: ${pyRes.status}`);
    assert(pyRes.output.trim() === 'Hello, CodeArena!', `Python output correct: "${pyRes.output.trim()}"`);

    // JavaScript Test
    const jsCode = `const fs = require('fs'); const n = parseInt(fs.readFileSync(0, 'utf-8').trim(), 10); console.log(n * n);`;
    const jsRes = await executeCode('javascript', jsCode, '7');
    assert(jsRes.status === 'SUCCESS', `JS execution status: ${jsRes.status}`);
    assert(jsRes.output.trim() === '49', `JS output correct: "${jsRes.output.trim()}"`);

    // C++ Test (g++)
    const cppCode = `#include <iostream>
using namespace std;
int main() {
    int a, b;
    if (cin >> a >> b) cout << (a + b) << "\\n";
    return 0;
}`;
    const cppRes = await executeCode('cpp', cppCode, '15 27');
    assert(cppRes.status === 'SUCCESS', `C++ execution status: ${cppRes.status}`);
    assert(cppRes.output.trim() === '42', `C++ output correct: "${cppRes.output.trim()}"`);

    // Timeout / TLE Protection Test
    const infiniteLoopPy = `import time\nwhile True:\n    time.sleep(0.1)`;
    const tleRes = await executeCode('python', infiniteLoopPy, '', 1500);
    assert(tleRes.status === 'TIME_LIMIT_EXCEEDED', `Timeout safeguard triggers: ${tleRes.status}`);

    // 4. Test Case Evaluation
    console.log('\n🔍 4. Multi-Test Case Submission Evaluation:');
    const sampleTests = [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2' },
    ];
    const twoSumProblem = await Problem.findOne({ title: 'Two Sum' });
    assert(twoSumProblem !== null, 'Two Sum problem retrieved');

    const evalAccepted = await evaluateSubmission('python', twoSumProblem.starterCode.python, sampleTests, false);
    assert(evalAccepted.status === 'ACCEPTED', `Two sum correct code evaluated as ACCEPTED`);
    assert(evalAccepted.passedTests === 2, `Passed 2/2 tests`);

    const badCode = `print("wrong answer")`;
    const evalWA = await evaluateSubmission('python', badCode, sampleTests, false);
    assert(evalWA.status === 'WRONG_ANSWER', `Incorrect code evaluated as WRONG_ANSWER`);

    // 5. First-Solve Points & Gamification Trigger
    console.log('\n🏆 5. Gamification First-Solve Points:');
    const rahulUser = await User.findOne({ email: 'rahul@codearena.com' });
    const initialPoints = rahulUser.points;

    // Find problem rahul hasn't solved yet
    const solvedIds = new Set(rahulUser.solvedProblems.map(sp => sp.problem.toString()));
    const unSolvedProb = await Problem.findOne({ _id: { $nin: Array.from(solvedIds) }, difficulty: 'Medium' });

    const gameRes = await processAcceptedSubmission(rahulUser._id, unSolvedProb._id, 'python');
    assert(gameRes.isFirstSolve === true, 'Correctly flagged as first solve');
    assert(gameRes.pointsEarned === 20, 'Awarded +20 points for Medium problem');
    assert(gameRes.totalPoints === initialPoints + 20, 'User total points updated accurately');

    // Repeated solve should award 0 points
    const repeatRes = await processAcceptedSubmission(rahulUser._id, unSolvedProb._id, 'python');
    assert(repeatRes.isFirstSolve === false, 'Subsequent solve flagged as non-first-solve');
    assert(repeatRes.pointsEarned === 0, 'No duplicate points awarded for repeat submission');

    // 6. Recommendation Engine
    console.log('\n💡 6. Rule-Based Recommendation Engine:');
    const recs = await getPersonalizedRecommendations(rahulUser._id);
    assert(recs.length > 0, `Generated ${recs.length} personalized recommendations`);
    assert(typeof recs[0].recommendationReason === 'string' && recs[0].recommendationReason.length > 5,
      `Recommendation has explanatory reason: "${recs[0].recommendationReason}"`);

    // 7. Assessments
    console.log('\n⏱️  7. Timed Assessment Evaluation:');
    const assessment = await Assessment.findOne({ isActive: true }).populate('problems.problem');
    assert(assessment !== null, 'Active assessment exists');
    assert(assessment.duration === 60, 'Assessment duration is 60 minutes');
    assert(assessment.problems.length === 4, 'Assessment contains 4 problems');

    console.log('\n=================================================');
    console.log(`🎉 ALL ${passedTestsCount}/${totalTestsCount} INTEGRATION & UNIT TESTS PASSED!`);
    console.log('=================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    await disconnectDB();
    process.exit(1);
  }
}

runTests();
