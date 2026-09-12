import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { Card, CardHeader } from '../../components/common/Card';
import { ArrowLeft, Save, Plus, Trash2, Code } from 'lucide-react';

const TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stack', 'Queue', 'Searching',
  'Sorting', 'Recursion', 'Trees', 'Graphs', 'Greedy', 'Dynamic Programming'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const ProblemEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');

  // Starter codes
  const [starterPy, setStarterPy] = useState('# Python 3 solution\nimport sys\n\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n');
  const [starterCpp, setStarterCpp] = useState('// C++ solution\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n');
  const [starterJs, setStarterJs] = useState('// JavaScript solution\nconst fs = require("fs");\n\nfunction solve() {\n}\n\nsolve();\n');

  // Test cases
  const [sampleTestCases, setSampleTestCases] = useState([
    { input: '', expectedOutput: '', explanation: '' },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', expectedOutput: '' },
  ]);

  useEffect(() => {
    if (isEditing) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          const res = await api.getProblem(id);
          if (res.success && res.problem) {
            const p = res.problem;
            setTitle(p.title || '');
            setTopic(p.topic || 'Arrays');
            setDifficulty(p.difficulty || 'Easy');
            setDescription(p.description || '');
            setConstraints(p.constraints || '');
            setInputFormat(p.inputFormat || '');
            setOutputFormat(p.outputFormat || '');
            if (p.starterCode) {
              setStarterPy(p.starterCode.python || '');
              setStarterCpp(p.starterCode.cpp || '');
              setStarterJs(p.starterCode.javascript || '');
            }
            if (p.sampleTestCases && p.sampleTestCases.length > 0) {
              setSampleTestCases(p.sampleTestCases);
            }
            if (p.hiddenTestCases && p.hiddenTestCases.length > 0) {
              setHiddenTestCases(p.hiddenTestCases);
            }
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch problem');
        } finally {
          setLoading(false);
        }
      };
      fetchProblem();
    }
  }, [id, isEditing]);

  // Sample test case handlers
  const addSampleCase = () => {
    setSampleTestCases([...sampleTestCases, { input: '', expectedOutput: '', explanation: '' }]);
  };
  const removeSampleCase = (idx) => {
    setSampleTestCases(sampleTestCases.filter((_, i) => i !== idx));
  };
  const updateSampleCase = (idx, field, val) => {
    const updated = [...sampleTestCases];
    updated[idx][field] = val;
    setSampleTestCases(updated);
  };

  // Hidden test case handlers
  const addHiddenCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', expectedOutput: '' }]);
  };
  const removeHiddenCase = (idx) => {
    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== idx));
  };
  const updateHiddenCase = (idx, field, val) => {
    const updated = [...hiddenTestCases];
    updated[idx][field] = val;
    setHiddenTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (hiddenTestCases.length === 0 || !hiddenTestCases[0].expectedOutput) {
      setError('At least one hidden test case with expected output is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        topic,
        difficulty,
        description: description.trim(),
        constraints: constraints.trim(),
        inputFormat: inputFormat.trim(),
        outputFormat: outputFormat.trim(),
        starterCode: {
          python: starterPy,
          cpp: starterCpp,
          javascript: starterJs,
        },
        sampleTestCases: sampleTestCases.filter((tc) => tc.expectedOutput.trim() !== ''),
        hiddenTestCases: hiddenTestCases.filter((tc) => tc.expectedOutput.trim() !== ''),
      };

      if (isEditing) {
        await api.updateProblem(id, payload);
      } else {
        await api.createProblem(payload);
      }
      navigate('/admin/problems');
    } catch (err) {
      setError(err.message || 'Failed to save problem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading problem details...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <Link
          to="/admin/problems"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Problems
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {isEditing ? 'Edit Problem' : 'Create New Problem'}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <Card className="space-y-4">
          <CardHeader title="Problem Metadata" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Invert Binary Tree"
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Difficulty *</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Topic *</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#080b12] border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the algorithmic problem clearly with edge case notes..."
              className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Input Format</label>
              <textarea
                rows={2}
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="e.g. First line contains N..."
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Output Format</label>
              <textarea
                rows={2}
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="e.g. Print space-separated indices..."
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Constraints</label>
            <textarea
              rows={2}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. 1 <= N <= 10^5"
              className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </Card>

        {/* Starter Codes */}
        <Card className="space-y-4">
          <CardHeader title="Language Starter Templates" subtitle="Default boilerplate provided to students" />
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-400 font-sans block mb-1">Python 3:</span>
              <textarea
                rows={4}
                value={starterPy}
                onChange={(e) => setStarterPy(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <span className="text-gray-400 font-sans block mb-1">C++ (g++):</span>
              <textarea
                rows={4}
                value={starterCpp}
                onChange={(e) => setStarterCpp(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <span className="text-gray-400 font-sans block mb-1">JavaScript (Node.js):</span>
              <textarea
                rows={4}
                value={starterJs}
                onChange={(e) => setStarterJs(e.target.value)}
                className="w-full bg-[#080b12] border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </Card>

        {/* Sample Test Cases */}
        <Card className="space-y-4">
          <CardHeader
            title="Sample Test Cases"
            subtitle="Visible to students during 'Run Code'"
            action={
              <button
                type="button"
                onClick={addSampleCase}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Sample Case
              </button>
            }
          />
          {sampleTestCases.map((tc, idx) => (
            <div key={idx} className="p-4 bg-[#080b12] border border-gray-800 rounded-xl space-y-3 font-mono text-xs relative">
              <div className="flex justify-between items-center font-sans">
                <span className="font-semibold text-gray-300">Sample Case {idx + 1}</span>
                {sampleTestCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSampleCase(idx)}
                    className="text-rose-400 hover:text-rose-300 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-sans block mb-1">Input Stdin</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => updateSampleCase(idx, 'input', e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-sans block mb-1">Expected Output</label>
                  <textarea
                    rows={2}
                    value={tc.expectedOutput}
                    onChange={(e) => updateSampleCase(idx, 'expectedOutput', e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Hidden Test Cases */}
        <Card className="space-y-4">
          <CardHeader
            title="Hidden Test Cases"
            subtitle="Confidential test suite evaluated on 'Submit Code'"
            action={
              <button
                type="button"
                onClick={addHiddenCase}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Hidden Case
              </button>
            }
          />
          {hiddenTestCases.map((tc, idx) => (
            <div key={idx} className="p-4 bg-[#080b12] border border-gray-800 rounded-xl space-y-3 font-mono text-xs relative">
              <div className="flex justify-between items-center font-sans">
                <span className="font-semibold text-gray-300">Hidden Case {idx + 1}</span>
                {hiddenTestCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHiddenCase(idx)}
                    className="text-rose-400 hover:text-rose-300 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-sans block mb-1">Input Stdin</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => updateHiddenCase(idx, 'input', e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-sans block mb-1">Expected Output</label>
                  <textarea
                    rows={2}
                    value={tc.expectedOutput}
                    onChange={(e) => updateHiddenCase(idx, 'expectedOutput', e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/problems')}
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
            {isEditing ? 'Save Changes' : 'Publish Problem'}
          </button>
        </div>
      </form>
    </div>
  );
};
