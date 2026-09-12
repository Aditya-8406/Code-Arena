import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Card, CardHeader } from '../components/common/Card';
import { Trophy, Flame, CheckCircle2, Award, Medal, Crown } from 'lucide-react';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.getLeaderboard();
        if (res.success) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-amber-400 inline" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-300 inline" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600 inline" />;
    return <span className="font-mono text-xs text-gray-400">#{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-800 pb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Leaderboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Top algorithmic coders ranked by earned points, problems solved, and streak dedication.
        </p>
      </div>

      <Card>
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading leaderboard rankings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No active student records available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0e1322] border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Solved</th>
                  <th className="py-3.5 px-4">Streak</th>
                  <th className="py-3.5 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 font-mono">
                {leaderboard.map((student) => (
                  <tr
                    key={student._id}
                    className={`hover:bg-gray-800/30 transition ${
                      student.rank <= 3 ? 'bg-indigo-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold">
                      {getRankBadge(student.rank)}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                          {student.name[0].toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 text-xs rounded bg-indigo-500/10 text-indigo-300 font-mono">
                        Lvl {student.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400">
                      {student.solvedCount}
                    </td>
                    <td className="py-3.5 px-4 text-amber-400">
                      <span className="flex items-center gap-1 font-sans">
                        <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
                        {student.currentStreak}d
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {student.points} <span className="text-xs text-gray-400 font-sans">pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
