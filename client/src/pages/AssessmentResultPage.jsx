import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Card, CardHeader } from '../components/common/Card';
import { Trophy, CheckCircle2, Clock, Target, ArrowLeft, Award } from 'lucide-react';

export const AssessmentResultPage = () => {
  const { id } = useParams();
  const [assessmentData, setAssessmentData] = useState(null);
  const [resultsList, setResultsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aRes, rRes] = await Promise.all([
          api.getAssessmentById(id),
          api.getAssessmentResults(id),
        ]);
        if (aRes.success) setAssessmentData(aRes);
        if (rRes.success) setResultsList(rRes.results);
      } catch (err) {
        console.error('Failed to load assessment result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Compiling assessment scorecard...
      </div>
    );
  }

  const attempt = assessmentData?.attempt;
  const assessment = assessmentData?.assessment;

  const formatSecs = (secs) => {
    const m = Math.floor((secs || 0) / 60);
    const s = (secs || 0) % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/assessments"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assessments
      </Link>

      {/* Score Card Banner */}
      <div className="bg-gradient-to-r from-indigo-950/50 via-[#111827] to-[#111827] border border-indigo-500/30 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <Trophy className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Assessment Scorecard</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">{assessment?.title}</p>

        {attempt && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
            <div className="bg-[#0c101c] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Your Score</span>
              <span className="text-2xl font-bold text-white font-mono">
                {attempt.score} <span className="text-xs text-gray-400 font-sans">/ {assessment?.totalMarks}</span>
              </span>
            </div>
            <div className="bg-[#0c101c] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Problems Solved</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {attempt.solved || 0}
              </span>
            </div>
            <div className="bg-[#0c101c] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Accuracy</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">
                {attempt.accuracy || 0}%
              </span>
            </div>
            <div className="bg-[#0c101c] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Time Taken</span>
              <span className="text-2xl font-bold text-amber-400 font-mono text-base pt-1 block">
                {formatSecs(attempt.timeUsed)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Leaderboard */}
      <Card>
        <CardHeader
          title="Assessment Rankings"
          subtitle="Top candidates sorted by score and completion speed"
        />
        {resultsList.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No ranked attempts submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1322] border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Solved</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Time Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 font-mono">
                {resultsList.map((res, index) => (
                  <tr key={res._id} className="hover:bg-gray-800/30">
                    <td className="py-2.5 px-3 font-bold text-gray-300">#{index + 1}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-white">
                      {res.userId?.name || 'Anonymous Student'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-indigo-400">{res.score} pts</td>
                    <td className="py-2.5 px-3 text-emerald-400">{res.solved}</td>
                    <td className="py-2.5 px-3 text-gray-300">{res.accuracy}%</td>
                    <td className="py-2.5 px-3 text-gray-400">{formatSecs(res.timeUsed)}</td>
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
