import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { DifficultyBadge } from '../components/common/BadgePill';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
} from 'lucide-react';

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stack',
  'Queue',
  'Searching',
  'Sorting',
  'Recursion',
  'Trees',
  'Graphs',
  'Greedy',
  'Dynamic Programming',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const ProblemList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        topic: selectedTopic !== 'All' ? selectedTopic : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
      };

      const res = await api.getProblems(params);
      if (res.success) {
        setProblems(res.problems);
        setTotal(res.total);
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
  }, [page, selectedTopic, selectedDifficulty, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProblems();
  };

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            DSA Problem Repository
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and practice 20+ algorithmic challenges across 12 fundamental topics
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/60 self-start md:self-auto">
          Showing <strong>{problems.length}</strong> of <strong>{total}</strong> problems
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problem by title..."
              className="w-full bg-[#111827] border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </form>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Difficulties' : d}
                </option>
              ))}
            </select>

            {/* Solved / Unsolved Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="bg-[#111827] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="solved">Solved Only</option>
              <option value="unsolved">Unsolved Only</option>
            </select>
          </div>
        </div>

        {/* Topic Filter Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicChange(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedTopic === topic
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e1322] border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Topic</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4 text-right">Acceptance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading problems...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No problems match your filter criteria.
                  </td>
                </tr>
              ) : (
                problems.map((problem) => {
                  const acceptanceRate =
                    problem.totalSubmissions > 0
                      ? Math.round(
                          (problem.acceptedSubmissions / problem.totalSubmissions) * 100
                        )
                      : 0;

                  return (
                    <tr
                      key={problem._id}
                      className="hover:bg-gray-800/40 transition group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 text-center">
                        {problem.isSolved ? (
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-400 inline"
                            title="Solved"
                          />
                        ) : (
                          <Circle
                            className="w-3.5 h-3.5 text-gray-600 inline"
                            title="Unsolved"
                          />
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        <Link
                          to={`/problems/${problem.slug || problem._id}`}
                          className="hover:text-indigo-400 transition"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded">
                          {problem.topic}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-gray-400">
                        {acceptanceRate}%{' '}
                        <span className="text-[10px] text-gray-400 font-sans">
                          ({problem.totalSubmissions} runs)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#0e1322] border-t border-gray-800">
            <span className="text-xs text-gray-400">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
