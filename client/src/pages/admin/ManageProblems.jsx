import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Card } from '../../components/common/Card';
import { DifficultyBadge } from '../../components/common/BadgePill';
import { ConfirmModal } from '../../components/common/Modal';
import { Plus, Edit, Trash2, Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export const ManageProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.getProblems({
        page,
        limit: 15,
        search: search.trim() || undefined,
      });
      if (res.success) {
        setProblems(res.problems);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProblems();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteProblem(deleteTarget._id);
      setDeleteTarget(null);
      fetchProblems();
    } catch (err) {
      alert('Failed to delete problem: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Manage DSA Problems
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create, update, or remove DSA problems and their test case configurations
          </p>
        </div>

        <Link
          to="/admin/problems/new"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Add New Problem
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problem title..."
          className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </form>

      {/* Problems Management Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Total Solves</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    Loading problem records...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No problems found.
                  </td>
                </tr>
              ) : (
                problems.map((prob) => (
                  <tr key={prob._id} className="hover:bg-gray-800/30 transition">
                    <td className="py-3.5 px-4 font-medium text-white">
                      <Link
                        to={`/problems/${prob.slug || prob._id}`}
                        className="hover:text-indigo-400 transition"
                      >
                        {prob.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-300 bg-gray-800 px-2.5 py-0.5 rounded">
                        {prob.topic}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={prob.difficulty} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-300">
                      {prob.acceptedSubmissions || 0} / {prob.totalSubmissions || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/problems/${prob._id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition"
                          title="Edit Problem"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(prob)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#0e1322] border-t border-gray-800">
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Problem"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Problem"
        isDanger={true}
      />
    </div>
  );
};
