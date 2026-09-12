const mongoose = require('mongoose');

const TOPICS = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stack',
  'Queue',
  'Searching',
  'Sorting',
  'Recursion',
  'Trees',
  'Graphs',
  'Greedy',
  'Dynamic Programming',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide problem title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide problem description'],
    },
    topic: {
      type: String,
      required: [true, 'Please specify a topic'],
      enum: TOPICS,
      index: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty level'],
      enum: DIFFICULTIES,
      index: true,
    },
    constraints: {
      type: String,
      default: '',
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: '' },
      },
    ],
    starterCode: {
      cpp: { type: String, default: '' },
      python: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },
    sampleTestCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        explanation: { type: String, default: '' },
      },
    ],
    hiddenTestCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptedSubmissions: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
problemSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);
module.exports.TOPICS = TOPICS;
module.exports.DIFFICULTIES = DIFFICULTIES;
