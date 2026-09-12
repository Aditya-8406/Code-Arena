import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../common/BadgePill';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal, Edit3 } from 'lucide-react';

export const ConsoleOutput = ({
  results,
  customInput,
  setCustomInput,
  isCustomRun = false,
  customOutput = null,
  activeTab = 'testcases',
  setActiveTab,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  // Reset selected case when new results arrive
  useEffect(() => {
    setSelectedCaseIndex(0);
  }, [results]);

  const testCases = results?.results || [];
  const activeCase = testCases[selectedCaseIndex] || null;

  return (
    <div className="flex flex-col bg-[#0e1322] border border-gray-800 rounded-xl overflow-hidden mt-4">
      {/* Console Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'testcases'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Test Results
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Custom Input
          </button>
        </div>

        {results && (
          <div className="flex items-center gap-2">
            <StatusBadge status={results.status} />
            {results.executionTime !== undefined && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {results.executionTime} ms
              </span>
            )}
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="p-4 font-mono text-xs max-h-72 overflow-y-auto">
        {/* TAB 1: Test Results */}
        {activeTab === 'testcases' && (
          <div>
            {!results ? (
              <div className="text-gray-400 py-6 text-center italic">
                Run your code to see sample test case evaluation results.
              </div>
            ) : results.error && (!testCases || testCases.length === 0) ? (
              // Error block (Compilation error or runtime fault before tests)
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  {results.status}
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
                  {results.error}
                </pre>
              </div>
            ) : (
              <div>
                {/* Case Selector Buttons */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800/60 overflow-x-auto">
                  {testCases.map((tc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCaseIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                        selectedCaseIndex === idx
                          ? 'bg-gray-800 text-white border border-gray-700'
                          : 'bg-gray-900/60 text-gray-400 hover:text-white'
                      }`}
                    >
                      {tc.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Selected Case Detail */}
                {activeCase && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-1">
                        Input
                      </span>
                      <pre className="p-2.5 bg-[#080b12] border border-gray-800/80 rounded-lg text-gray-200 whitespace-pre-wrap">
                        {activeCase.input || '(empty)'}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-1">
                          Expected Output
                        </span>
                        <pre className="p-2.5 bg-[#080b12] border border-gray-800/80 rounded-lg text-emerald-300 whitespace-pre-wrap">
                          {activeCase.expectedOutput || '(empty)'}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-1">
                          Your Output
                        </span>
                        <pre
                          className={`p-2.5 bg-[#080b12] border rounded-lg whitespace-pre-wrap ${
                            activeCase.passed
                              ? 'border-emerald-500/30 text-emerald-300'
                              : 'border-rose-500/30 text-rose-300'
                          }`}
                        >
                          {activeCase.actualOutput || '(no output)'}
                        </pre>
                      </div>
                    </div>

                    {activeCase.error && (
                      <div className="p-2.5 bg-rose-950/30 border border-rose-800/40 rounded-lg text-rose-300">
                        <span className="font-semibold block mb-0.5 text-rose-400">Error Details:</span>
                        <pre className="whitespace-pre-wrap">{activeCase.error}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Custom Input */}
        {activeTab === 'custom' && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-1">
                Custom Stdin Input
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input here for your program's stdin..."
                rows={4}
                className="w-full bg-[#080b12] border border-gray-800 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {customOutput && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-1">
                  Program Output ({customOutput.executionTime || 0} ms)
                </span>
                <pre className="p-3 bg-[#080b12] border border-gray-800 rounded-lg text-indigo-300 whitespace-pre-wrap">
                  {customOutput.output || customOutput.error || '(no output)'}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
