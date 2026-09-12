require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

const User = require('../models/User');
const Problem = require('../models/Problem');
const Badge = require('../models/Badge');
const Assessment = require('../models/Assessment');
const Submission = require('../models/Submission');
const AssessmentResult = require('../models/AssessmentResult');

const problemsData = require('./problemsData');

const badgesData = [
  {
    slug: 'first-solve',
    name: 'First Solve',
    description: 'Successfully solved your first DSA problem on CodeArena.',
    icon: 'Trophy',
    category: 'SOLVES',
    criteriaType: 'TOTAL_SOLVES',
    criteriaValue: 1,
  },
  {
    slug: '10-problems',
    name: '10 Problems Solved',
    description: 'Mastered 10 DSA practice problems.',
    icon: 'Award',
    category: 'SOLVES',
    criteriaType: 'TOTAL_SOLVES',
    criteriaValue: 10,
  },
  {
    slug: '25-problems',
    name: '25 Problems Solved',
    description: 'Achieved a milestone of 25 solved algorithmic challenges.',
    icon: 'Medal',
    category: 'SOLVES',
    criteriaType: 'TOTAL_SOLVES',
    criteriaValue: 25,
  },
  {
    slug: '50-problems',
    name: '50 Problems Solved',
    description: 'Solved 50 problems. Demonstrating elite consistency.',
    icon: 'Crown',
    category: 'SOLVES',
    criteriaType: 'TOTAL_SOLVES',
    criteriaValue: 50,
  },
  {
    slug: '100-problems',
    name: 'Centurion (100 Solves)',
    description: 'Legendary milestone: 100 solved problems.',
    icon: 'Sparkles',
    category: 'SOLVES',
    criteriaType: 'TOTAL_SOLVES',
    criteriaValue: 100,
  },
  {
    slug: '7-day-streak',
    name: '7-Day Streak',
    description: 'Logged in and practiced coding 7 consecutive days in a row.',
    icon: 'Flame',
    category: 'STREAK',
    criteriaType: 'STREAK',
    criteriaValue: 7,
  },
  {
    slug: '30-day-streak',
    name: 'Monthly Warrior (30-Day Streak)',
    description: 'Unbroken daily coding commitment for a full 30 days.',
    icon: 'Zap',
    category: 'STREAK',
    criteriaType: 'STREAK',
    criteriaValue: 30,
  },
  {
    slug: 'array-explorer',
    name: 'Array Explorer',
    description: 'Solved 3 or more problems on Arrays.',
    icon: 'Layers',
    category: 'TOPIC',
    criteriaType: 'TOPIC_SOLVES',
    criteriaTopic: 'Arrays',
    criteriaValue: 3,
  },
  {
    slug: 'tree-master',
    name: 'Tree Master',
    description: 'Mastered hierarchical structures by solving 2 Tree problems.',
    icon: 'GitBranch',
    category: 'TOPIC',
    criteriaType: 'TOPIC_SOLVES',
    criteriaTopic: 'Trees',
    criteriaValue: 2,
  },
  {
    slug: 'graph-explorer',
    name: 'Graph Explorer',
    description: 'Navigated graph networks by solving graph traversal problems.',
    icon: 'Network',
    category: 'TOPIC',
    criteriaType: 'TOPIC_SOLVES',
    criteriaTopic: 'Graphs',
    criteriaValue: 1,
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Problem.deleteMany({}),
      Badge.deleteMany({}),
      Assessment.deleteMany({}),
      Submission.deleteMany({}),
      AssessmentResult.deleteMany({}),
    ]);

    // 1. Seed Badges
    console.log('[Seed] Inserting system Badges...');
    const insertedBadges = await Badge.insertMany(badgesData);
    const badgeMap = {};
    insertedBadges.forEach((b) => (badgeMap[b.slug] = b));
    console.log(`[Seed] Successfully inserted ${insertedBadges.length} badges.`);

    // 2. Seed Admin & Student Users
    console.log('[Seed] Creating Admin and Student accounts...');
    const adminUser = await User.create({
      name: 'Prof. Sharma (Admin)',
      email: 'admin@codearena.com',
      password: 'Admin@123',
      role: 'admin',
      points: 500,
      level: 4,
      currentStreak: 12,
      longestStreak: 15,
      lastActiveDate: new Date(),
    });

    // 3. Seed Problems (using Admin as creator)
    console.log('[Seed] Inserting 22+ DSA practice problems...');
    const problemsToInsert = problemsData.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));
    const insertedProblems = await Problem.insertMany(problemsToInsert);
    console.log(`[Seed] Successfully inserted ${insertedProblems.length} DSA problems.`);

    // 4. Seed Students with realistic initial solved problems and streaks
    const pTwoSum = insertedProblems.find((p) => p.title === 'Two Sum');
    const pStock = insertedProblems.find((p) => p.title === 'Best Time to Buy and Sell Stock');
    const pMaxSub = insertedProblems.find((p) => p.title === 'Maximum Subarray Sum');
    const pPalindrome = insertedProblems.find((p) => p.title === 'Valid Palindrome');
    const pBinarySearch = insertedProblems.find((p) => p.title === 'Binary Search');
    const pClimbingStairs = insertedProblems.find((p) => p.title === 'Climbing Stairs');
    const pIslands = insertedProblems.find((p) => p.title === 'Number of Islands');

    // Student 1: Rahul Sharma (Active intermediate student, Level 2, 8-day streak)
    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@codearena.com',
      password: 'Student@123',
      role: 'student',
      points: 120,
      level: 2,
      currentStreak: 8,
      longestStreak: 8,
      lastActiveDate: new Date(),
      solvedProblems: [
        { problem: pTwoSum._id, solvedAt: new Date(Date.now() - 3 * 86400000), language: 'python' },
        { problem: pStock._id, solvedAt: new Date(Date.now() - 2 * 86400000), language: 'python' },
        { problem: pPalindrome._id, solvedAt: new Date(Date.now() - 86400000), language: 'javascript' },
        { problem: pBinarySearch._id, solvedAt: new Date(), language: 'cpp' },
      ],
      badges: [
        { badge: badgeMap['first-solve']._id, slug: 'first-solve', name: 'First Solve', awardedAt: new Date(Date.now() - 3 * 86400000) },
        { badge: badgeMap['7-day-streak']._id, slug: '7-day-streak', name: '7-Day Streak', awardedAt: new Date(Date.now() - 86400000) },
      ],
    });

    // Student 2: Priya Patel (Top performer, Level 3, 260 points)
    const priya = await User.create({
      name: 'Priya Patel',
      email: 'priya@codearena.com',
      password: 'Student@123',
      role: 'student',
      points: 260,
      level: 3,
      currentStreak: 14,
      longestStreak: 14,
      lastActiveDate: new Date(),
      solvedProblems: [
        { problem: pTwoSum._id, solvedAt: new Date(Date.now() - 10 * 86400000), language: 'cpp' },
        { problem: pStock._id, solvedAt: new Date(Date.now() - 8 * 86400000), language: 'cpp' },
        { problem: pMaxSub._id, solvedAt: new Date(Date.now() - 7 * 86400000), language: 'cpp' },
        { problem: pPalindrome._id, solvedAt: new Date(Date.now() - 6 * 86400000), language: 'python' },
        { problem: pBinarySearch._id, solvedAt: new Date(Date.now() - 5 * 86400000), language: 'python' },
        { problem: pClimbingStairs._id, solvedAt: new Date(Date.now() - 3 * 86400000), language: 'python' },
        { problem: pIslands._id, solvedAt: new Date(Date.now() - 86400000), language: 'cpp' },
      ],
      badges: [
        { badge: badgeMap['first-solve']._id, slug: 'first-solve', name: 'First Solve', awardedAt: new Date(Date.now() - 10 * 86400000) },
        { badge: badgeMap['7-day-streak']._id, slug: '7-day-streak', name: '7-Day Streak', awardedAt: new Date(Date.now() - 7 * 86400000) },
        { badge: badgeMap['array-explorer']._id, slug: 'array-explorer', name: 'Array Explorer', awardedAt: new Date(Date.now() - 7 * 86400000) },
        { badge: badgeMap['graph-explorer']._id, slug: 'graph-explorer', name: 'Graph Explorer', awardedAt: new Date(Date.now() - 86400000) },
      ],
    });

    // Student 3: Arjun Verma (Beginner student, Level 1, 40 points)
    const arjun = await User.create({
      name: 'Arjun Verma',
      email: 'arjun@codearena.com',
      password: 'Student@123',
      role: 'student',
      points: 40,
      level: 1,
      currentStreak: 2,
      longestStreak: 3,
      lastActiveDate: new Date(),
      solvedProblems: [
        { problem: pTwoSum._id, solvedAt: new Date(Date.now() - 86400000), language: 'javascript' },
        { problem: pPalindrome._id, solvedAt: new Date(), language: 'python' },
      ],
      badges: [
        { badge: badgeMap['first-solve']._id, slug: 'first-solve', name: 'First Solve', awardedAt: new Date(Date.now() - 86400000) },
      ],
    });

    console.log('[Seed] Created students: Rahul, Priya, Arjun.');

    // 5. Seed Submissions History
    console.log('[Seed] Creating initial submission records...');
    await Submission.insertMany([
      {
        userId: rahul._id,
        problemId: pTwoSum._id,
        language: 'python',
        sourceCode: pTwoSum.starterCode.python,
        status: 'ACCEPTED',
        passedTests: 5,
        totalTests: 5,
        executionTime: 42,
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        userId: rahul._id,
        problemId: pMaxSub._id,
        language: 'python',
        sourceCode: pMaxSub.starterCode.python,
        status: 'WRONG_ANSWER',
        passedTests: 1,
        totalTests: 5,
        executionTime: 50,
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        userId: priya._id,
        problemId: pTwoSum._id,
        language: 'cpp',
        sourceCode: pTwoSum.starterCode.cpp,
        status: 'ACCEPTED',
        passedTests: 5,
        totalTests: 5,
        executionTime: 18,
        createdAt: new Date(Date.now() - 10 * 86400000),
      },
      {
        userId: priya._id,
        problemId: pIslands._id,
        language: 'cpp',
        sourceCode: pIslands.starterCode.cpp,
        status: 'ACCEPTED',
        passedTests: 5,
        totalTests: 5,
        executionTime: 24,
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        userId: arjun._id,
        problemId: pTwoSum._id,
        language: 'javascript',
        sourceCode: pTwoSum.starterCode.javascript,
        status: 'ACCEPTED',
        passedTests: 5,
        totalTests: 5,
        executionTime: 65,
        createdAt: new Date(Date.now() - 86400000),
      },
    ]);

    // 6. Seed Timed Assessment
    console.log('[Seed] Creating timed assessment...');
    const assessmentProblems = [
      { problem: pTwoSum._id, points: 25 },
      { problem: pPalindrome._id, points: 25 },
      { problem: pMaxSub._id, points: 25 },
      { problem: pBinarySearch._id, points: 25 },
    ];

    const assessment = await Assessment.create({
      title: 'DSA Foundation Challenge 2026',
      description: 'Test your algorithmic mastery across Arrays, Strings, and Searching in this timed 60-minute evaluation.',
      duration: 60, // 60 minutes
      totalMarks: 100,
      isActive: true,
      problems: assessmentProblems,
      createdBy: adminUser._id,
    });

    console.log(`[Seed] Created assessment: "${assessment.title}" (ID: ${assessment._id})`);

    console.log('\n=================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('-------------------------------------------------');
    console.log('Admin Account:');
    console.log('  Email:    admin@codearena.com');
    console.log('  Password: Admin@123');
    console.log('  Role:     admin');
    console.log('-------------------------------------------------');
    console.log('Student Accounts:');
    console.log('  1. rahul@codearena.com  / Student@123 (Level 2, 120 pts, 8-day streak)');
    console.log('  2. priya@codearena.com  / Student@123 (Level 3, 260 pts, 14-day streak)');
    console.log('  3. arjun@codearena.com  / Student@123 (Level 1, 40 pts, 2-day streak)');
    console.log('-------------------------------------------------');
    console.log(`Problems seeded: ${insertedProblems.length}`);
    console.log(`Badges seeded:   ${insertedBadges.length}`);
    console.log('=================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
