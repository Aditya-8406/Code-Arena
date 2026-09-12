const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 100,
    },
    attempted: {
      type: Number,
      default: 0,
    },
    solved: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number, // Percentage 0 - 100
      default: 0,
    },
    timeUsed: {
      type: Number, // in seconds
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    problemResults: [
      {
        problem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Problem',
        },
        status: {
          type: String,
          default: 'UNATTEMPTED',
        },
        pointsEarned: {
          type: Number,
          default: 0,
        },
        language: {
          type: String,
          default: 'python',
        },
        sourceCode: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index so a user has one main active attempt per assessment
assessmentResultSchema.index({ assessmentId: 1, userId: 1 });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
