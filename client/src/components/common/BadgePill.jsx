import React from 'react';

export const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
        styles[difficulty] || styles.Easy
      }`}
    >
      {difficulty}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    ACCEPTED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    WRONG_ANSWER: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    TIME_LIMIT_EXCEEDED: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    COMPILATION_ERROR: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    RUNTIME_ERROR: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const labels = {
    ACCEPTED: 'Accepted',
    WRONG_ANSWER: 'Wrong Answer',
    TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
    COMPILATION_ERROR: 'Compilation Error',
    RUNTIME_ERROR: 'Runtime Error',
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-md border inline-flex items-center gap-1.5 ${
        styles[status] || 'bg-gray-800 text-gray-300 border-gray-700'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'ACCEPTED'
            ? 'bg-emerald-400'
            : status === 'WRONG_ANSWER'
            ? 'bg-rose-400'
            : 'bg-amber-400'
        }`}
      />
      {labels[status] || status}
    </span>
  );
};

export const TopicBadge = ({ topic }) => {
  return (
    <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
      {topic}
    </span>
  );
};
