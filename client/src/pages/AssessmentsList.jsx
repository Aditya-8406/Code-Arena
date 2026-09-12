import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Card, CardHeader } from '../components/common/Card';
import { Timer, Trophy, CheckCircle2, ArrowRight, Play, Award, Clock } from 'lucide-react';

export const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.getAssessments();
      if (res.success) {
        setAssessments(res.assessments);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleStart = async (assessmentId) => {
    try {
      await api.startAssessment(assessmentId);
      navigate(`/assessments/${assessmentId}/room`);
    } catch (err) {
      // If already started or completed, go to room or results
      navigate(`/assessments/${assessmentId}/room`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Timer className="w-6 h-6 text-indigo-400" />
            Coding Assessments & Contests
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Test your algorithmic problem-solving under timed exam conditions
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading available assessments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400">{error}</div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No assessments currently scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment._id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {assessment.duration} Minutes
                  </span>
                  {assessment.isCompleted ? (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed (Score: {assessment.score})
                    </span>
                  ) : assessment.hasAttempted ? (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      In Progress
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-800 text-gray-300">
                      Available
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{assessment.title}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {assessment.description || 'Timed algorithmic contest testing data structures and problem solving.'}
                </p>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-800 text-xs text-gray-300 mb-4">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Problems:</span>
                    <strong className="text-white text-sm">
                      {assessment.problems ? assessment.problems.length : 0} Challenges
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Total Marks:</span>
                    <strong className="text-white text-sm">
                      {assessment.totalMarks || 100} Points
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {assessment.isCompleted ? (
                  <Link
                    to={`/assessments/${assessment._id}/results`}
                    className="w-full py-2.5 px-4 text-center rounded-xl text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    View Scorecard & Results
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStart(assessment._id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    {assessment.hasAttempted ? 'Resume Assessment' : 'Start Assessment'}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
