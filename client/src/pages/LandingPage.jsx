import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Trophy,
  Flame,
  LineChart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const TOPIC_LIST = [
  'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 'Searching',
  'Sorting', 'Recursion', 'Trees', 'Graphs', 'Greedy', 'Dynamic Programming'
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-gray-800/80">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            CSE Minor Project-I • Computer Science & Engineering
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Master DSA. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Build Logic. Compete.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CodeArena is a learning and coding assessment platform designed to help students
            practice Data Structures and Algorithms through curated problems, timed assessments,
            in-depth analytics, and motivating gamification.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/problems"
              className="px-7 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 text-base group"
            >
              Start Practicing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/leaderboard"
              className="px-7 py-3.5 rounded-xl font-semibold text-gray-200 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 transition-all text-base"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-gray-800/80 rounded-2xl bg-[#111827]/70 p-4 backdrop-blur-sm">
            <div className="p-3 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-white block">12</span>
              <span className="text-xs text-gray-400">Core DSA Topics</span>
            </div>
            <div className="p-3 text-center border-l border-gray-800/80">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-400 block">3</span>
              <span className="text-xs text-gray-400">Languages (C++, Py, JS)</span>
            </div>
            <div className="p-3 text-center border-l border-gray-800/80">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 block">100%</span>
              <span className="text-xs text-gray-400">Isolated Sandboxing</span>
            </div>
            <div className="p-3 text-center border-l border-gray-800/80">
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 block">Timed</span>
              <span className="text-xs text-gray-400">Assessments</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#0c101c] border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">How It Works</h2>
            <h3 className="text-3xl font-bold text-white">Your Systematic Path from Beginner to Expert</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Choose Topic & Difficulty</h4>
              <p className="text-sm text-gray-400">
                Browse our curated repository covering Arrays, Trees, Graphs, and Dynamic Programming with clear problem statements and constraints.
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Code in Real Sandbox</h4>
              <p className="text-sm text-gray-400">
                Write solutions in Python 3, C++ (g++), or JavaScript. Run against sample test cases and submit against rigorous hidden test suites.
              </p>
            </div>

            <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl relative">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Level Up & Get Insights</h4>
              <p className="text-sm text-gray-400">
                Earn points, maintain daily streaks, unlock badges, and receive rule-based personalized practice recommendations to target weak areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DSA Topics Grid */}
      <section className="py-20 border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Curriculum</h2>
            <h3 className="text-3xl font-bold text-white">12 Fundamental DSA Topics</h3>
            <p className="text-sm text-gray-400 mt-2">
              From linear structures to advanced dynamic programming and graph algorithms.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TOPIC_LIST.map((topic, index) => (
              <Link
                key={index}
                to={`/problems?topic=${encodeURIComponent(topic)}`}
                className="p-4 bg-[#111827] border border-gray-800 rounded-xl hover:border-indigo-500/40 hover:bg-[#161f33] transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-200 group-hover:text-white">
                    {topic}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification & Assessment Highlights */}
      <section className="py-20 bg-[#0c101c] border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4 border border-amber-500/20">
                <Flame className="w-3.5 h-3.5" />
                Gamification & Consistency
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Stay Motivated with Points, Levels & Streaks
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Consistency is key to mastering data structures. CodeArena turns your daily practice into tangible progress:
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Dynamic Scoring:</strong> +10 for Easy, +20 for Medium, +30 for Hard on first solve.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Server-Enforced Streaks:</strong> Real server calendar tracking ensures authentic daily habits.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Milestone Badges:</strong> Unlock First Solve, 7-Day Streak, Tree Master, and more.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Rule-Based Recommendations:</strong> Automatic suggestions targeted at topics with low accuracy.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
                <div>
                  <h4 className="text-white font-semibold">Student Progress Snapshot</h4>
                  <p className="text-xs text-gray-400">Live system metrics computed from database</p>
                </div>
                <span className="px-2.5 py-1 text-xs rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Level 3
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Arrays Progress</span>
                    <span className="font-semibold text-indigo-400">75%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Trees Progress</span>
                    <span className="font-semibold text-emerald-400">50%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Dynamic Programming</span>
                    <span className="font-semibold text-amber-400">33%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <span>Streak: <strong>8 Days Active</strong></span>
                <span>Points: <strong className="text-white">260 pts</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher / Admin Management Feature */}
      <section className="py-20 border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Academic Assessment</h2>
            <h3 className="text-3xl font-bold text-white">Built for Teachers & Evaluators</h3>
            <p className="text-sm text-gray-400 mt-2">
              Full control for faculty to conduct timed exams, manage problem sets, and evaluate student logic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#111827] border border-gray-800 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-indigo-400 mb-3" />
              <h4 className="text-base font-semibold text-white mb-2">Problem Management (CRUD)</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add, edit, or remove DSA problems with custom starter templates, sample cases, and confidential hidden test cases.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-gray-800 rounded-xl">
              <Terminal className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-base font-semibold text-white mb-2">Timed Assessments</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Configure timed contests with server-synced countdown timers, auto-submission on expiration, and automated ranking.
              </p>
            </div>

            <div className="p-6 bg-[#111827] border border-gray-800 rounded-xl">
              <LineChart className="w-8 h-8 text-amber-400 mb-3" />
              <h4 className="text-base font-semibold text-white mb-2">Student Performance Analytics</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Inspect accuracy percentages, submission histories, individual code executions, and track cohort progress in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to sharpen your algorithmic problem-solving?
          </h3>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
            Get started right now. Test code against automated test cases and prepare for technical interviews and coding contests.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition text-sm"
            >
              Register Free
            </Link>
            <Link
              to="/problems"
              className="px-6 py-3 rounded-lg font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition text-sm"
            >
              Browse Problems
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
