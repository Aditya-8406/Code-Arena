import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { Card, CardHeader } from '../../components/common/Card';
import { DifficultyBadge, StatusBadge } from '../../components/common/BadgePill';
import {
  Users,
  BookOpen,
  Send,
  Target,
  Plus,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.getTeacherDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.message || 'Failed to load teacher analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherMetrics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading faculty administrative dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-rose-400">
        {error || 'Dashboard unavailable'}
      </div>
    );
  }

  const { stats, topSolvedProblems, recentSubmissions, students } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Teacher & Administrator Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Monitor student performance, manage problem repositories, and conduct timed assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/problems/new"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Problem
          </Link>
          <Link
            to="/admin/assessments/new"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Assessment
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Enrolled Students</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">{stats.totalStudents}</span>
          </div>
          <p className="text-xs text-indigo-300 mt-1">Active student cohort</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Problem Repository</span>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">{stats.totalProblems}</span>
          </div>
          <p className="text-xs text-emerald-400 mt-1">Across 12 DSA topics</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Submissions</span>
            <Send className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">{stats.totalSubmissions}</span>
          </div>
          <p className="text-xs text-purple-300 mt-1">Automated test evaluations</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Average Cohort Accuracy</span>
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-amber-400">{stats.averageAccuracy}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Pass rate across all runs</p>
        </Card>
      </div>

      {/* Top Solved Problems & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Solved Problems */}
        <Card>
          <CardHeader
            title="Most Solved Problems"
            subtitle="Trending exercises with highest completion volume"
          />
          <div className="space-y-3">
            {topSolvedProblems.map((prob) => (
              <div
                key={prob._id}
                className="flex items-center justify-between p-3 bg-[#0c101c] border border-gray-800 rounded-xl"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{prob.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{prob.topic}</span>
                    <DifficultyBadge difficulty={prob.difficulty} />
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-emerald-400 font-bold block">
                    {prob.acceptedSubmissions || 0} solves
                  </span>
                  <span className="text-gray-500 text-[10px]">
                    {prob.totalSubmissions || 0} attempts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Submissions Feed */}
        <Card>
          <CardHeader
            title="Recent Student Submissions"
            subtitle="Real-time execution feed across the platform"
            action={
              <Link to="/admin/submissions" className="text-xs text-indigo-400 hover:text-indigo-300">
                View All →
              </Link>
            }
          />
          <div className="space-y-2.5 overflow-x-auto">
            {recentSubmissions.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between p-3 bg-[#0c101c] border border-gray-800 rounded-xl text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{sub.userId?.name}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-300">{sub.problemId?.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                    <span className="uppercase">{sub.language}</span>
                    <span>{sub.executionTime || 0} ms</span>
                  </div>
                </div>
                <StatusBadge status={sub.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Student Cohort Performance Table */}
      <Card>
        <CardHeader
          title="Student Performance Roster"
          subtitle="Click on any student to inspect detailed performance breakdown"
          action={
            <Link to="/admin/students" className="text-xs text-indigo-400 hover:text-indigo-300">
              Manage Roster →
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Solved</th>
                <th className="py-3 px-3">Points</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono">
              {students.map((st) => (
                <tr key={st._id} className="hover:bg-gray-800/30">
                  <td className="py-3 px-3 font-sans font-medium text-white">
                    <Link to="/admin/students" className="hover:text-indigo-400 transition">
                      {st.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-gray-400 font-sans">{st.email}</td>
                  <td className="py-3 px-3 text-indigo-300">Level {st.level}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{st.solvedCount}</td>
                  <td className="py-3 px-3 text-white font-bold">{st.points} pts</td>
                  <td className="py-3 px-3 text-amber-400">{st.streak}d 🔥</td>
                  <td className="py-3 px-3 text-gray-400 font-sans">
                    {st.lastActiveDate ? new Date(st.lastActiveDate).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
