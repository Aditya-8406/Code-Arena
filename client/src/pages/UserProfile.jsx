import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge, TopicBadge } from '../components/common/BadgePill';
import { Modal } from '../components/common/Modal';
import {
  User,
  Flame,
  Trophy,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Code,
  FileCode2,
  Sparkles,
} from 'lucide-react';

export const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [meRes, subRes] = await Promise.all([
          api.getMe(),
          api.getMySubmissions({ limit: 50 }),
        ]);
        if (meRes.success) setProfile(meRes.user);
        if (subRes.success) setSubmissions(subRes.submissions);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading profile & history...
      </div>
    );
  }

  const p = profile || user;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
            {p?.name ? p.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{p?.name}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 uppercase">
                {p?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{p?.email}</p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(p?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0c101c] px-4 py-2.5 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 block uppercase">Points</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{p?.points || 0}</span>
          </div>
          <div className="bg-[#0c101c] px-4 py-2.5 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 block uppercase">Level</span>
            <span className="text-lg font-bold text-white font-mono">{p?.level || 1}</span>
          </div>
          <div className="bg-[#0c101c] px-4 py-2.5 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 block uppercase">Streak</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {p?.currentStreak || 0}d 🔥
            </span>
          </div>
          <div className="bg-[#0c101c] px-4 py-2.5 rounded-xl border border-gray-800 text-center">
            <span className="text-[10px] text-gray-400 block uppercase">Solved</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {p?.solvedCount || p?.solvedProblems?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Gallery */}
      <Card>
        <CardHeader
          title="Earned Badges"
          subtitle={`${p?.badges?.length || 0} badges achieved`}
        />
        {p?.badges && p.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {p.badges.map((b, i) => (
              <div
                key={i}
                className="bg-[#0c101c] border border-gray-800 p-3.5 rounded-xl text-center flex flex-col items-center justify-center hover:border-amber-500/30 transition"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white truncate w-full">{b.name}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(b.awardedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-6">
            No badges unlocked yet. Keep practicing daily to earn awards!
          </p>
        )}
      </Card>

      {/* Complete Submission History */}
      <Card>
        <CardHeader
          title="Complete Submissions Record"
          subtitle="Audit log of all code submissions, runtimes, and verdicts"
        />
        {submissions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            No submissions recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Problem</th>
                  <th className="py-3 px-3">Language</th>
                  <th className="py-3 px-3">Runtime</th>
                  <th className="py-3 px-3">Tests</th>
                  <th className="py-3 px-3">Submitted At</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 font-mono">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-800/30">
                    <td className="py-3 px-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-3 font-sans font-medium text-white">
                      {sub.problemId?.title || 'Unknown Problem'}
                    </td>
                    <td className="py-3 px-3 uppercase text-gray-300">{sub.language}</td>
                    <td className="py-3 px-3 text-gray-400">{sub.executionTime || 0} ms</td>
                    <td className="py-3 px-3 text-gray-300">
                      {sub.passedTests} / {sub.totalTests}
                    </td>
                    <td className="py-3 px-3 font-sans text-gray-400">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition"
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Code Viewer Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title={`Submitted Code - ${selectedSubmission.problemId?.title || 'Problem'}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedSubmission.status} />
                <span className="font-mono uppercase text-gray-400">
                  {selectedSubmission.language}
                </span>
              </div>
              <span className="text-gray-400 font-mono">
                {selectedSubmission.executionTime || 0} ms • {new Date(selectedSubmission.createdAt).toLocaleString()}
              </span>
            </div>

            <pre className="p-4 bg-[#080b12] border border-gray-800 rounded-xl font-mono text-xs text-gray-200 overflow-x-auto whitespace-pre">
              {selectedSubmission.sourceCode}
            </pre>
          </div>
        </Modal>
      )}
    </div>
  );
};
