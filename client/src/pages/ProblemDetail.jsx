import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { CodeEditor } from '../components/editor/CodeEditor';
import { ConsoleOutput } from '../components/editor/ConsoleOutput';
import { DifficultyBadge, TopicBadge, StatusBadge } from '../components/common/BadgePill';
import { Modal } from '../components/common/Modal';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  ArrowLeft,
  BookOpen,
  FileCode2,
  Sparkles,
} from 'lucide-react';

export const ProblemDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor states
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');

  // Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingAction, setExecutingAction] = useState(null); // 'run' | 'submit'
  const [consoleResults, setConsoleResults] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState(null);
  const [consoleTab, setConsoleTab] = useState('testcases');

  // Submissions tab
  const [activeLeftTab, setActiveLeftTab] = useState('statement'); // 'statement' | 'submissions'
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Success Modal
  const [rewardModal, setRewardModal] = useState(null);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const res = await api.getProblem(id);
        if (res.success && res.problem) {
          setProblem(res.problem);
          // Set initial code from starter template
          const starter = res.problem.starterCode?.[language] || '# Write your solution here\n';
          setCode(starter);
        }
      } catch (err) {
        setError(err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id]);

  // Update starter code when language changes
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[newLang] || '');
    }
  };

  const handleResetCode = () => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language] || '');
    }
  };

  // Fetch previous submissions for this problem
  const fetchSubmissionsHistory = async () => {
    if (!problem) return;
    try {
      setLoadingSubmissions(true);
      const res = await api.getProblemSubmissions(problem._id);
      if (res.success) {
        setPreviousSubmissions(res.submissions);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveLeftTab(tab);
    if (tab === 'submissions') {
      fetchSubmissionsHistory();
    }
  };

  // 1. RUN CODE (against sample test cases or custom input)
  const handleRunCode = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setExecutingAction('run');
    setConsoleResults(null);
    setCustomOutput(null);

    try {
      const isCustom = consoleTab === 'custom' && customInput.trim() !== '';
      const payload = {
        problemId: problem._id,
        language,
        sourceCode: code,
        customInput: isCustom ? customInput : undefined,
      };

      const res = await api.runCode(payload);
      if (res.isCustom) {
        setCustomOutput(res);
      } else {
        setConsoleResults(res);
        setConsoleTab('testcases');
      }
    } catch (err) {
      setConsoleResults({
        status: 'RUNTIME_ERROR',
        error: err.message || 'Execution failed',
        results: [],
      });
    } finally {
      setIsExecuting(false);
      setExecutingAction(null);
    }
  };

  // 2. SUBMIT CODE (against hidden test cases, records submission)
  const handleSubmitCode = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setExecutingAction('submit');
    setConsoleResults(null);

    try {
      const payload = {
        problemId: problem._id,
        language,
        sourceCode: code,
      };

      const res = await api.submitCode(payload);
      if (res.success) {
        setConsoleResults({
          status: res.submission.status,
          passedTests: res.submission.passedTests,
          totalTests: res.submission.totalTests,
          executionTime: res.submission.executionTime,
          error: res.submission.errorMessage,
          results: [],
        });
        setConsoleTab('testcases');

        // If Accepted, trigger gamification celebration
        if (res.submission.status === 'ACCEPTED') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Show reward celebration modal
          setRewardModal({
            isFirstSolve: res.gamification?.isFirstSolve,
            pointsEarned: res.gamification?.pointsEarned || 0,
            totalPoints: res.gamification?.totalPoints,
            streak: res.gamification?.currentStreak,
            level: res.gamification?.level,
            newBadges: res.gamification?.newBadges || [],
          });

          // Refresh user context for navbar metrics
          refreshUser();
        }
      }
    } catch (err) {
      setConsoleResults({
        status: 'RUNTIME_ERROR',
        error: err.message || 'Submission failed',
        results: [],
      });
    } finally {
      setIsExecuting(false);
      setExecutingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading problem environment...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-rose-400 mb-4">{error || 'Problem not found'}</p>
        <Link to="/problems" className="px-4 py-2 bg-indigo-600 rounded-lg text-sm text-white">
          Back to Problem List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/problems"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Problem Repository
        </Link>
        {problem.isSolved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Solved
          </span>
        )}
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Problem Statement / Submissions Tab (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-2xl flex flex-col h-[820px] overflow-hidden shadow-xl">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-gray-800 bg-[#0e1322] px-4 pt-2">
            <button
              onClick={() => handleTabSwitch('statement')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                activeLeftTab === 'statement'
                  ? 'border-indigo-500 text-indigo-400 bg-[#111827]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Description
            </button>
            <button
              onClick={() => handleTabSwitch('submissions')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                activeLeftTab === 'submissions'
                  ? 'border-indigo-500 text-indigo-400 bg-[#111827]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Submissions
            </button>
          </div>

          {/* Left Column Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeLeftTab === 'statement' ? (
              <>
                {/* Header Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <TopicBadge topic={problem.topic} />
                  </div>
                  <h1 className="text-xl font-bold text-white tracking-tight">{problem.title}</h1>
                </div>

                {/* Problem Description */}
                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed border-t border-gray-800/80 pt-4">
                  {problem.description}
                </div>

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                      Examples
                    </h3>
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0c101c] border border-gray-800/80 rounded-xl p-4 space-y-2 text-xs font-mono"
                      >
                        <div>
                          <span className="text-gray-400 font-sans block mb-1">Input:</span>
                          <pre className="text-gray-200 bg-gray-900/60 p-2 rounded">
                            {ex.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-gray-400 font-sans block mb-1">Output:</span>
                          <pre className="text-emerald-300 bg-gray-900/60 p-2 rounded">
                            {ex.output}
                          </pre>
                        </div>
                        {ex.explanation && (
                          <div className="text-gray-400 font-sans text-[11px] pt-1 border-t border-gray-800">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Input / Output Formats */}
                <div className="space-y-3 pt-2 text-xs">
                  {problem.inputFormat && (
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-1">Input Format:</h4>
                      <p className="text-gray-400 bg-[#0c101c] p-2.5 rounded-lg border border-gray-800">
                        {problem.inputFormat}
                      </p>
                    </div>
                  )}

                  {problem.outputFormat && (
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-1">Output Format:</h4>
                      <p className="text-gray-400 bg-[#0c101c] p-2.5 rounded-lg border border-gray-800">
                        {problem.outputFormat}
                      </p>
                    </div>
                  )}
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div className="pt-2">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                      Constraints
                    </h3>
                    <pre className="bg-[#0c101c] border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 whitespace-pre-line">
                      {problem.constraints}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              /* Submissions History */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Your Submission History</h3>
                  <button
                    onClick={fetchSubmissionsHistory}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Refresh
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    Loading previous submissions...
                  </div>
                ) : previousSubmissions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    You haven't submitted any solutions for this problem yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {previousSubmissions.map((sub) => (
                      <div
                        key={sub._id}
                        className="bg-[#0c101c] border border-gray-800 p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={sub.status} />
                            <span className="text-gray-400 font-mono uppercase text-[11px]">
                              {sub.language}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(sub.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="text-gray-300 block">
                            {sub.passedTests}/{sub.totalTests} tests
                          </span>
                          <span className="text-gray-400 text-[10px]">
                            {sub.executionTime || 0} ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor, Console Output & Action Bar (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[820px]">
          {/* Code Editor */}
          <div className="flex-1 min-h-[460px]">
            <CodeEditor
              language={language}
              setLanguage={handleLanguageChange}
              code={code}
              setCode={setCode}
              onResetCode={handleResetCode}
              isExecuting={isExecuting}
            />
          </div>

          {/* Action Bar (Run & Submit Buttons) */}
          <div className="flex items-center justify-between py-3 px-2">
            <div className="text-xs text-gray-400">
              Run checks sample inputs; Submit evaluates hidden test suite.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isExecuting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isExecuting && executingAction === 'run' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                )}
                Run Code
              </button>

              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={isExecuting}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isExecuting && executingAction === 'submit' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Submit Code
              </button>
            </div>
          </div>

          {/* Console Output Drawer */}
          <div className="h-[280px]">
            <ConsoleOutput
              results={consoleResults}
              customInput={customInput}
              setCustomInput={setCustomInput}
              customOutput={customOutput}
              activeTab={consoleTab}
              setActiveTab={setConsoleTab}
            />
          </div>
        </div>
      </div>

      {/* Gamification Reward Celebration Modal */}
      {rewardModal && (
        <Modal
          isOpen={!!rewardModal}
          onClose={() => setRewardModal(null)}
          title="Accepted Solution!"
          maxWidth="max-w-md"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-white">All Test Cases Passed!</h3>
            <p className="text-sm text-gray-300">
              {rewardModal.isFirstSolve
                ? `Congratulations! You solved "${problem.title}" and earned points!`
                : `Great job! All test cases passed successfully.`}
            </p>

            {rewardModal.isFirstSolve && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#0c101c] p-3 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block mb-0.5">Points Earned</span>
                  <span className="text-lg font-bold text-indigo-400">
                    +{rewardModal.pointsEarned} pts
                  </span>
                </div>
                <div className="bg-[#0c101c] p-3 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block mb-0.5">Active Streak</span>
                  <span className="text-lg font-bold text-amber-400">
                    {rewardModal.streak} Days 🔥
                  </span>
                </div>
              </div>
            )}

            {/* Badges Unlocked */}
            {rewardModal.newBadges && rewardModal.newBadges.length > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> New Badge Unlocked!
                </span>
                {rewardModal.newBadges.map((badge, idx) => (
                  <div key={idx} className="text-xs text-white font-medium">
                    🏆 {badge.name} - {badge.description}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setRewardModal(null)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition"
              >
                Continue Practicing
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
