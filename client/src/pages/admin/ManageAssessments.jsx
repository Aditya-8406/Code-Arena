import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Card } from '../../components/common/Card';
import { ConfirmModal } from '../../components/common/Modal';
import { Plus, Timer, Trophy, Trash2, Edit, Clock, ArrowRight } from 'lucide-react';

export const ManageAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.getAssessments();
      if (res.success) {
        setAssessments(res.assessments);
      }
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteAssessment(deleteTarget._id);
      setDeleteTarget(null);
      fetchAssessments();
    } catch (err) {
      alert('Failed to delete assessment: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Timer className="w-6 h-6 text-indigo-400" />
            Manage Timed Assessments
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Conduct exams, timed coding contests, and review student performance
          </p>
        </div>

        <Link
          to="/admin/assessments/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Create Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-gray-400">
            Loading assessments...
          </div>
        ) : assessments.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-gray-400">
            No assessments created yet. Click "Create Assessment" to build one.
          </div>
        ) : (
          assessments.map((a) => (
            <Card key={a._id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {a.duration} Minutes
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Max: {a.totalMarks || 100} pts
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5">{a.title}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  {a.description || 'Timed algorithmic coding contest.'}
                </p>

                <div className="py-2.5 px-3 bg-[#0c101c] rounded-xl border border-gray-800 text-xs text-gray-300 mb-4">
                  <span>Problems Assigned: </span>
                  <strong className="text-white">
                    {a.problems ? a.problems.length : 0} challenges
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <Link
                  to={`/assessments/${a._id}/results`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Trophy className="w-3.5 h-3.5" /> View Results Leaderboard
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(a)}
                    className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition"
                    title="Delete Assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? Candidate scorecards associated with it will be removed.`}
        confirmText="Delete Assessment"
        isDanger={true}
      />
    </div>
  );
};
