import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { Card, CardHeader } from '../../components/common/Card';
import { DifficultyBadge } from '../../components/common/BadgePill';
import { ArrowLeft, Save, Timer, Plus, Check } from 'lucide-react';

export const AssessmentEditor = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);

  // Available problems from DB
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblemIds, setSelectedProblemIds] = useState(new Set());
  const [problemPointsMap, setProblemPointsMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        setLoading(true);
        const res = await api.getProblems({ limit: 100 });
        if (res.success) {
          setAvailableProblems(res.problems);
        }
      } catch (err) {
        setError('Failed to load problems: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProblems();
  }, []);

  const toggleProblem = (id) => {
    const updated = new Set(selectedProblemIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
      if (!problemPointsMap[id]) {
        setProblemPointsMap((prev) => ({ ...prev, [id]: 25 }));
      }
    }
    setSelectedProblemIds(updated);
  };

  const handlePointsChange = (id, points) => {
    setProblemPointsMap((prev) => ({ ...prev, [id]: parseInt(points, 10) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide an assessment title.');
      return;
    }

    if (selectedProblemIds.size === 0) {
      setError('Please select at least one problem to include in this assessment.');
      return;
    }

    setSaving(true);
    try {
      const problemsPayload = Array.from(selectedProblemIds).map((pId) => ({
        problem: pId,
        points: problemPointsMap[pId] || 25,
      }));

      await api.createAssessment({
        title: title.trim(),
        description: description.trim(),
        duration: parseInt(duration, 10),
        totalMarks: parseInt(totalMarks, 10),
        problems: problemsPayload,
      });

      navigate('/admin/assessments');
    } catch (err) {
      setError(err.message || 'Failed to create assessment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <Link
          to="/admin/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Create Timed Assessment</h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <CardHeader title="Assessment Configuration" />
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Assessment Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term DSA Coding Contest"
              className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions and topics covered in this exam..."
              className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min={5}
                max={300}
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Total Score / Marks
              </label>
              <input
                type="number"
                min={10}
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </Card>

        {/* Problem Selection Table */}
        <Card className="space-y-4">
          <CardHeader
            title="Select Assessment Problems"
            subtitle={`Select questions to include (${selectedProblemIds.size} selected)`}
          />

          {loading ? (
            <p className="text-xs text-gray-400 py-6 text-center">Loading problems...</p>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-800 border border-gray-800 rounded-xl">
              {availableProblems.map((prob) => {
                const isSelected = selectedProblemIds.has(prob._id);
                return (
                  <div
                    key={prob._id}
                    onClick={() => toggleProblem(prob._id)}
                    className={`flex items-center justify-between p-3 cursor-pointer transition ${
                      isSelected ? 'bg-indigo-950/20' : 'hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-gray-700 bg-gray-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">{prob.title}</span>
                        <span className="text-xs text-gray-400">{prob.topic}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <DifficultyBadge difficulty={prob.difficulty} />
                      {isSelected && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-gray-400">Points:</span>
                          <input
                            type="number"
                            min={1}
                            value={problemPointsMap[prob._id] || 25}
                            onChange={(e) => handlePointsChange(prob._id, e.target.value)}
                            className="w-16 bg-[#080b12] border border-gray-700 rounded px-2 py-1 text-white font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/assessments')}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Publish Assessment
          </button>
        </div>
      </form>
    </div>
  );
};
