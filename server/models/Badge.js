const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'Award', // Lucide icon name
    },
    category: {
      type: String,
      enum: ['SOLVES', 'STREAK', 'TOPIC', 'SPECIAL'],
      default: 'SOLVES',
    },
    criteriaType: {
      type: String,
      required: true, // 'TOTAL_SOLVES', 'STREAK', 'TOPIC_SOLVES'
    },
    criteriaTopic: {
      type: String, // e.g., 'Arrays', 'Trees', 'Graphs'
      default: null,
    },
    criteriaValue: {
      type: Number,
      required: true, // e.g., 1, 10, 25, 50, 100, 7, 30
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);
