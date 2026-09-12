# CodeArena - Test Plan and Verification Matrix
## CSE Minor Project-I Quality Assurance & Testing Report

This document records the systematic verification and testing performed on the **CodeArena** DSA Learning & Coding Assessment Platform across all functional layers: Authentication, Database Persistence, Problem Repository, Code Execution Sandbox, Gamification, Rule-Based Recommendation Engine, and Timed Assessments.

---

### Test Execution Summary

- **Total Test Cases Executed:** 32
- **Passed:** 32
- **Failed:** 0
- **Test Automation Harness:** `server/tests/api.test.js`
- **Compilers Verified:** MinGW g++ 6.3.0 (C++), Python 3.14.7, Node.js v24.19.0 (JavaScript)

---

### Comprehensive Test Matrix

| Test ID | Module | Test Description / Input | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-DB-01** | Database | Connect to MongoDB and verify problem repository count | Collection contains >= 20 DSA problems across 12 topics | 22 problems present and indexed | **PASS** |
| **TC-DB-02** | Database | Verify Admin user account seeded | Admin account found (`admin@codearena.com`, role `admin`) | Admin account retrieved with admin role | **PASS** |
| **TC-DB-03** | Database | Verify bcrypt password hashing on admin account | Plaintext password `'Admin@123'` hashes and matches via `matchPassword` | Match verified via bcrypt.compare | **PASS** |
| **TC-AUTH-01**| Auth | User registration with valid data | HTTP 201 Created, returns JWT token and student profile | Token returned, user created with role 'student' | **PASS** |
| **TC-AUTH-02**| Auth | Login with incorrect password | HTTP 401 Unauthorized (`Invalid email or password`) | HTTP 401 with clean error message | **PASS** |
| **TC-AUTH-03**| Auth | Login with valid credentials | HTTP 200 OK, returns JWT token, updates server-side streak | JWT issued, streak evaluated | **PASS** |
| **TC-AUTH-04**| Auth | Fetch authenticated user profile via `/api/auth/me` | HTTP 200 OK, returns user profile, points, level, badges | Complete user profile with levelProgress returned | **PASS** |
| **TC-ROLE-01**| Security | Student user attempts Admin problem creation (`POST /api/problems`) | HTTP 403 Forbidden (`Teacher / Administrator privilege required`) | Blocked with 403 Forbidden | **PASS** |
| **TC-ROLE-02**| Security | Unauthenticated request to protected route without Bearer token | HTTP 401 Unauthorized (`Not authorized, no token provided`) | Blocked with 401 Unauthorized | **PASS** |
| **TC-GAME-01**| Gamification | Level tier thresholds (0-99: Lvl 1, 100-249: Lvl 2, 250-499: Lvl 3, 500-999: Lvl 4, 1000+: Lvl 5) | Correct level computed for 50, 150, 350, 750, 1200 points | Verified across all 5 tiers | **PASS** |
| **TC-GAME-02**| Gamification | Streak calculation for consecutive active days | Current streak increments by 1; longestStreak updates if new high | Streak incremented from 5 to 6 | **PASS** |
| **TC-GAME-03**| Gamification | Streak calculation after multi-day inactivity gap | Streak resets to 1 | Streak reset to 1 | **PASS** |
| **TC-GAME-04**| Gamification | Repeated solve of already solved problem | +0 points awarded; `isFirstSolve` flagged false | No duplicate points awarded | **PASS** |
| **TC-GAME-05**| Gamification | First-time solve of Medium difficulty problem | +20 points awarded; `isFirstSolve` flagged true; user level refreshed | Points updated from initial to initial+20 | **PASS** |
| **TC-EXEC-01**| Code Runner | Python 3 code execution with standard input pipe | Status SUCCESS, captured stdout equals expected string | Output: `"Hello, CodeArena!"` | **PASS** |
| **TC-EXEC-02**| Code Runner | JavaScript (Node.js) execution with stdin parsing | Status SUCCESS, computed square of integer | Output: `"49"` | **PASS** |
| **TC-EXEC-03**| Code Runner | C++ compilation and execution using `g++ -O2 -std=c++14` | Status SUCCESS, binary compiled and evaluated correctly | Output: `"42"` | **PASS** |
| **TC-EXEC-04**| Sandbox Safety| Program with infinite loop (`while True: pass`) | Timeout watchdog triggers within timeout limit; returns `TIME_LIMIT_EXCEEDED` | Terminated; status `TIME_LIMIT_EXCEEDED` | **PASS** |
| **TC-EXEC-05**| Sandbox Safety| C++ syntax error compilation | Compiler stderr captured, status `COMPILATION_ERROR` | Compilation error returned | **PASS** |
| **TC-EVAL-01**| Submission | Multi-test case evaluation for Two Sum problem (correct code) | Status `ACCEPTED`, passedTests = 2/2 | Evaluated as `ACCEPTED` | **PASS** |
| **TC-EVAL-02**| Submission | Multi-test case evaluation with incorrect output logic | Status `WRONG_ANSWER`, failure reported | Evaluated as `WRONG_ANSWER` | **PASS** |
| **TC-REC-01** | Recommendation | Rule-based recommendation for student with low topic accuracy (< 50%) | Recommends Easy problem from that topic with human-readable rationale | Rationale generated explaining topic accuracy | **PASS** |
| **TC-REC-02** | Recommendation | Rule-based recommendation for student with multiple Easy solves | Recommends Medium problems with progressive difficulty rationale | Medium problem recommended with level-up rationale | **PASS** |
| **TC-ASM-01**  | Assessment | Fetch active assessments | Returns assessment details, duration, question count, and max score | Active 60-min assessment returned with 4 problems | **PASS** |
| **TC-ASM-02**  | Assessment | Start assessment attempt | Server records `startedAt` timestamp; computes remaining seconds | Synchronized timer computed | **PASS** |
| **TC-ASM-03**  | Assessment | Submit assessment | Computes score, accuracy %, timeUsed, marks attempt completed | AssessmentResult stored with score and accuracy | **PASS** |
| **TC-UI-01**   | Frontend | Responsive navigation and role-aware menu | Correct links rendered for Student vs Teacher vs Public | Role-based routing verified | **PASS** |
| **TC-UI-02**   | Frontend | Monaco Code Editor language switching | Syntax highlighter and starter template change per language | Python, C++, and JS modes switch smoothly | **PASS** |
| **TC-UI-03**   | Frontend | Problem filtering by Topic, Difficulty, and Solved status | Problem list dynamically updates table rows | Filtered correctly | **PASS** |
| **TC-UI-04**   | Frontend | Real-time console test case tabs (Case 1, Case 2) | Inspects Stdin, Expected Output, Actual Output, and Diffs | Test results and diffs displayed cleanly | **PASS** |
| **TC-UI-05**   | Frontend | Celebration confetti on Accepted first-solve | Confetti animation and reward modal render | Confetti triggered and modal rendered | **PASS** |
| **TC-UI-06**   | Frontend | Faculty Dashboard student inspection drill-down | Displays student portfolio, solved problems, and submission logs | Student drill-down modal loads data | **PASS** |
