import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Card, CardHeader } from '../../components/common/Card';
import { StatusBadge, DifficultyBadge } from '../../components/common/BadgePill';
import { Modal } from '../../components/common/Modal';
import { Users, Search, Award, Flame, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.getTeacherDashboard();
        if (res.success) {
          setStudents(res.students);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleInspectStudent = async (studentId) => {
    try {
      setDetailLoading(true);
      const res = await api.getStudentDetail(studentId);
      if (res.success) {
        setSelectedStudentDetail(res);
      }
    } catch (err) {
      alert('Failed to load student details: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          Student Performance Analytics & Roster
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Monitor individual student progress, solved problem portfolios, and activity streaks
        </p>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter students by name or email..."
          className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Solved Problems</th>
                <th className="py-3.5 px-4">Points</th>
                <th className="py-3.5 px-4">Current Streak</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-sans">
                    Loading student cohort...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-sans">
                    No matching students found.
                  </td>
                </tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st._id} className="hover:bg-gray-800/30 transition">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {st.name}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-gray-400">{st.email}</td>
                    <td className="py-3.5 px-4 text-indigo-300">Lvl {st.level}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{st.solvedCount}</td>
                    <td className="py-3.5 px-4 text-white font-bold">{st.points} pts</td>
                    <td className="py-3.5 px-4 text-amber-400">{st.streak}d 🔥</td>
                    <td className="py-3.5 px-4 text-gray-400 font-sans">
                      {st.lastActiveDate ? new Date(st.lastActiveDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => handleInspectStudent(st._id)}
                        className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drill-down Modal showing student performance */}
      {selectedStudentDetail && (
        <Modal
          isOpen={!!selectedStudentDetail}
          onClose={() => setSelectedStudentDetail(null)}
          title={`Performance Profile: ${selectedStudentDetail.student.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs">
            {/* Quick Stats Summary */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#080b12] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Points</span>
                <span className="text-base font-bold text-indigo-400">
                  {selectedStudentDetail.student.points} pts
                </span>
              </div>
              <div className="bg-[#080b12] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Level</span>
                <span className="text-base font-bold text-white">
                  Level {selectedStudentDetail.student.level}
                </span>
              </div>
              <div className="bg-[#080b12] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Streak</span>
                <span className="text-base font-bold text-amber-400">
                  {selectedStudentDetail.student.currentStreak} Days 🔥
                </span>
              </div>
              <div className="bg-[#080b12] p-3 rounded-xl border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Solved Count</span>
                <span className="text-base font-bold text-emerald-400">
                  {selectedStudentDetail.student.solvedProblems?.length || 0}
                </span>
              </div>
            </div>

            {/* Solved Problems Portfolio */}
            <div>
              <h4 className="font-semibold text-white mb-2">Solved Problems Portfolio</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-800 rounded-xl p-3 bg-[#080b12]">
                {selectedStudentDetail.student.solvedProblems?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No problems solved yet.</p>
                ) : (
                  selectedStudentDetail.student.solvedProblems.map((sp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-gray-900/60 border border-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-medium">{sp.problem?.title}</span>
                        <span className="text-gray-400">({sp.problem?.topic})</span>
                      </div>
                      <DifficultyBadge difficulty={sp.problem?.difficulty} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h4 className="font-semibold text-white mb-2">Recent Execution History</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-800 rounded-xl p-3 bg-[#080b12]">
                {selectedStudentDetail.submissions?.slice(0, 10).map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-2 rounded bg-gray-900/60 border border-gray-800 font-mono text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} />
                      <span className="font-sans text-white">{sub.problemId?.title}</span>
                    </div>
                    <div className="text-gray-400">
                      <span className="uppercase">{sub.language}</span> • {sub.executionTime || 0} ms • {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
