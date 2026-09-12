import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Card, CardHeader } from '../components/common/Card';
import { DifficultyBadge, StatusBadge } from '../components/common/BadgePill';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  FolderGit2,
  Layers,
  GitBranch,
  Network,
  Medal,
  Crown,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BADGE_ICONS = {
  Trophy,
  Award,
  Medal,
  Crown,
  Sparkles,
  Flame,
  Zap,
  Layers,
  GitBranch,
  Network,
};

const DIFFICULTY_COLORS = {
  Easy: '#10B981',   // Emerald
  Medium: '#F59E0B', // Amber
  Hard: '#F43F5E',   // Rose
};

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Computing analytics & performance metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-400 mb-4">{error || 'Unable to load dashboard'}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-sm text-white hover:bg-indigo-500 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, difficultyStats, topicProgress, recommendations, recentActivity, badges } = data;

  // Prepare Pie Chart data
  const pieData = [
    { name: 'Easy', value: difficultyStats?.Easy?.solved || 0, color: DIFFICULTY_COLORS.Easy },
    { name: 'Medium', value: difficultyStats?.Medium?.solved || 0, color: DIFFICULTY_COLORS.Medium },
    { name: 'Hard', value: difficultyStats?.Hard?.solved || 0, color: DIFFICULTY_COLORS.Hard },
  ];
  const hasSolvedAny = pieData.some((d) => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Level Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-[#111827] to-[#111827] border border-indigo-900/30 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Level {stats.level}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Keep your momentum going. You have solved{' '}
            <strong className="text-white">{stats.totalSolved}</strong> algorithmic problems.
          </p>
        </div>

        {/* Level Progress */}
        <div className="md:w-72 bg-[#0d121f] p-3.5 rounded-xl border border-gray-800">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400 font-medium">Level {stats.level} Progress</span>
            <span className="font-mono text-indigo-300">
              {stats.levelProgress.current} / {stats.levelProgress.next} pts
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.levelProgress.progress}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 text-right">
            {stats.levelProgress.next - stats.levelProgress.current} pts to Level{' '}
            {Math.min(5, stats.level + 1)}
          </p>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Problems Solved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.totalSolved}</span>
            <span className="text-xs text-gray-400">/ {stats.totalAvailableProblems} total</span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">Verified test submissions</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">{stats.currentStreak}</span>
            <span className="text-xs text-gray-400">Days Active</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Longest: {stats.longestStreak} days</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Overall Accuracy</span>
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.accuracy}%</span>
            <span className="text-xs text-gray-400">({stats.totalSubmissions} runs)</span>
          </div>
          <p className="text-xs text-indigo-300/80 mt-1">First-pass pass rate</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Points</span>
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.points}</span>
            <span className="text-xs text-gray-400">Score</span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">{stats.badgesCount} badges unlocked</p>
        </Card>
      </div>

      {/* Recommended Practice (Rule-Based Engine) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Recommended For You</h2>
          </div>
          <span className="text-xs text-gray-400">Rule-based dynamic recommendations</span>
        </div>

        {recommendations.length === 0 ? (
          <Card className="text-center py-8 text-gray-400">
            No recommendations pending. Keep solving problems across different topics!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((prob) => (
              <Card
                key={prob._id}
                hover
                className="flex flex-col justify-between p-5 border-l-4 border-l-indigo-500"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-400">{prob.topic}</span>
                    <DifficultyBadge difficulty={prob.difficulty} />
                  </div>
                  <h3 className="font-semibold text-white text-base hover:text-indigo-300 transition">
                    <Link to={`/problems/${prob.slug || prob._id}`}>{prob.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                    💡 {prob.recommendationReason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {prob.acceptedSubmissions || 0} solves
                  </span>
                  <Link
                    to={`/problems/${prob.slug || prob._id}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
                  >
                    Solve Now
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Analytics: Topic-wise Progress & Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic-Wise Progress Bar List */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Topic-wise Mastery"
            subtitle="Real database calculated progress percentage per DSA topic"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
            {topicProgress.map((tp) => (
              <div key={tp.topic} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-300">{tp.topic}</span>
                  <span className="font-mono text-gray-400">
                    {tp.solved}/{tp.total} ({tp.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      tp.percentage >= 75
                        ? 'bg-emerald-500'
                        : tp.percentage >= 40
                        ? 'bg-indigo-500'
                        : tp.percentage > 0
                        ? 'bg-amber-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${Math.max(3, tp.percentage)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Difficulty Distribution Chart */}
        <Card>
          <CardHeader
            title="Difficulty Breakdown"
            subtitle="Solved problems distribution by tier"
          />
          <div className="h-44 flex items-center justify-center">
            {hasSolvedAny ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-400 text-center">
                Solve your first problem to see difficulty distribution chart!
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-gray-300">Easy</span>
              </span>
              <span className="font-mono text-gray-400">
                {difficultyStats?.Easy?.solved || 0} / {difficultyStats?.Easy?.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-gray-300">Medium</span>
              </span>
              <span className="font-mono text-gray-400">
                {difficultyStats?.Medium?.solved || 0} / {difficultyStats?.Medium?.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="text-gray-300">Hard</span>
              </span>
              <span className="font-mono text-gray-400">
                {difficultyStats?.Hard?.solved || 0} / {difficultyStats?.Hard?.total || 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Earned Badges Showcase */}
      <Card>
        <CardHeader
          title="Earned Badges & Achievements"
          subtitle="Milestones unlocked through continuous problem solving and streaks"
          action={
            <Link to="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              View All Badges →
            </Link>
          }
        />
        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map((b, idx) => {
              const IconComponent = BADGE_ICONS[b.badge?.icon] || Award;
              return (
                <div
                  key={idx}
                  className="bg-[#0c101c] border border-gray-800 p-3.5 rounded-xl text-center flex flex-col items-center justify-center hover:border-amber-500/30 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-200 block truncate w-full">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(b.awardedAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-400 text-center py-6">
            Solve problems and build streaks to unlock badges!
          </div>
        )}
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader
          title="Recent Submission Activity"
          subtitle="Your latest code executions and verdicts"
          action={
            <Link to="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Full History →
            </Link>
          }
        />
        {recentActivity && recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 border-b border-gray-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Runtime</th>
                  <th className="py-2.5 px-3">Tests Passed</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {recentActivity.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-800/30">
                    <td className="py-2.5 px-3">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-2.5 px-3 text-gray-300 uppercase">{sub.language}</td>
                    <td className="py-2.5 px-3 text-gray-400">{sub.executionTime || 0} ms</td>
                    <td className="py-2.5 px-3 text-gray-300">
                      {sub.passedTests} / {sub.totalTests}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400 font-sans">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-gray-400 text-center py-6">
            No submissions recorded yet. Start solving problems!
          </div>
        )}
      </Card>
    </div>
  );
};
