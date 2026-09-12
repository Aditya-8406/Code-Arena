import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Card, CardHeader } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/BadgePill';
import { Modal } from '../../components/common/Modal';
import { FileCode2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const SubmissionMonitoring = () => {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedSub, setSelectedSub] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.getAllSubmissions({
        page,
        limit: 20,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        language: languageFilter !== 'All' ? languageFilter : undefined,
      });
      if (res.success) {
        setSubmissions(res.submissions);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Failed to load submissions feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, statusFilter, languageFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-indigo-400" />
            Submission Audit & Execution Feed
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time audit log of student code submissions, statuses, and performance
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Verdicts</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
            <option value="TIME_LIMIT_EXCEEDED">Time Limit Exceeded</option>
            <option value="COMPILATION_ERROR">Compilation Error</option>
            <option value="RUNTIME_ERROR">Runtime Error</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Languages</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (g++)</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Runtime</th>
                <th className="py-3 px-4">Tests Passed</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-sans">
                    Loading submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-sans">
                    No matching submissions recorded.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-800/30 transition">
                    <td className="py-3 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {sub.userId?.name || 'Deleted User'}
                    </td>
                    <td className="py-3 px-4 font-sans text-gray-300">
                      {sub.problemId?.title || 'Deleted Problem'}
                    </td>
                    <td className="py-3 px-4 uppercase text-gray-400">{sub.language}</td>
                    <td className="py-3 px-4 text-gray-300">{sub.executionTime || 0} ms</td>
                    <td className="py-3 px-4 text-gray-300">
                      {sub.passedTests} / {sub.totalTests}
                    </td>
                    <td className="py-3 px-4 font-sans text-gray-400">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => setSelectedSub(sub)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition"
                      >
                        Code
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Code Viewer Modal */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Submission: ${selectedSub.userId?.name || 'Student'} on ${selectedSub.problemId?.title || 'Problem'}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedSub.status} />
                <span className="font-mono uppercase text-gray-400">{selectedSub.language}</span>
              </div>
              <span className="text-gray-400 font-mono">
                {selectedSub.executionTime || 0} ms • {new Date(selectedSub.createdAt).toLocaleString()}
              </span>
            </div>

            <pre className="p-4 bg-[#080b12] border border-gray-800 rounded-xl font-mono text-xs text-gray-200 overflow-x-auto whitespace-pre">
              {selectedSub.sourceCode}
            </pre>
          </div>
        </Modal>
      )}
    </div>
  );
};
