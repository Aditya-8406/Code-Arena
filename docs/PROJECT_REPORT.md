# CODEARENA: DSA LEARNING & CODING ASSESSMENT PLATFORM
## CSE Minor Project-I Report

**Degree / Program:** Bachelor of Technology in Computer Science & Engineering  
**Course:** CSE Minor Project - I  
**Platform Name:** CodeArena  
**Primary Identity:** DSA Learning + Coding Practice + Timed Assessment + Analytics + Gamification  

---

## TABLE OF CONTENTS
1. [Chapter 1: Introduction](#chapter-1-introduction)
   - 1.1 Overview
   - 1.2 Problem Statement
   - 1.3 Objectives
   - 1.4 Scope of the System
   - 1.5 Limitations
2. [Chapter 2: Requirement Analysis](#chapter-2-requirement-analysis)
   - 2.1 Functional Requirements
   - 2.2 Non-Functional Requirements
   - 2.3 Hardware Requirements
   - 2.4 Software Requirements
3. [Chapter 3: System Design and Architecture](#chapter-3-system-design-and-architecture)
   - 3.1 High-Level Architecture
   - 3.2 Database Schema Design
   - 3.3 Data Flow Diagrams (DFD Level 0 & Level 1)
   - 3.4 Use Case Analysis
   - 3.5 Execution and Sandbox Flow
4. [Chapter 4: Implementation](#chapter-4-implementation)
   - 4.1 Frontend Layer (React, Vite, Tailwind CSS)
   - 4.2 Backend Layer (Express.js REST Architecture)
   - 4.3 Database Persistence (MongoDB & Mongoose)
   - 4.4 Authentication & Role-Based Authorization
   - 4.5 Controlled Code Execution Engine (C++, Python 3, JavaScript)
   - 4.6 Gamification Engine (Points, Levels, Streaks, Badges)
   - 4.7 Rule-Based Personalized Practice Recommendation Engine
   - 4.8 Timed Assessment Supervision Subsystem
5. [Chapter 5: Testing and Results](#chapter-5-testing-and-results)
   - 5.1 Testing Strategy
   - 5.2 Unit & Sandbox Testing
   - 5.3 Integration Testing
   - 5.4 Security & Authorization Verification
   - 5.5 Results & Performance Summary
6. [Chapter 6: Conclusion and Future Scope](#chapter-6-conclusion-and-future-scope)
   - 6.1 Conclusion
   - 6.2 Future Scope

---

## CHAPTER 1: INTRODUCTION

### 1.1 Overview
In computer science education and technical recruitment, Data Structures and Algorithms (DSA) form the bedrock of problem-solving aptitude. While global platforms such as LeetCode, Codeforces, and HackerRank exist, academic institutions require controlled, college-project-appropriate platforms that tightly integrate learning, automated multi-language evaluation, gamified habit formation, and faculty-supervised assessment workflows.

**CodeArena** is designed to address this academic need as an end-to-end full-stack platform. It allows computer science students to practice problems across 12 fundamental DSA topics, submit source code in C++, Python, and JavaScript, receive instant automated test verdicts in an isolated execution sandbox, earn gamification rewards (points, streaks, badges, levels), and sit for timed exams configured by faculty members.

### 1.2 Problem Statement
Traditional computer science lab assessments often rely on manual code inspection, local script runs prone to host environment crashes, or fragmented online tools that lack integrated analytics. Students face disjointed learning experiences, while teachers lack centralized visibility into student weak points, submission frequencies, and exam integrity. CodeArena solves this by establishing a unified, secure web ecosystem combining coding practice, controlled evaluation, personalized guidance, and administrative oversight.

### 1.3 Objectives
1. **Curriculum-Aligned Practice:** Provide a structured repository of 20+ algorithmic challenges categorized under 12 core DSA topics with varying difficulty levels (Easy, Medium, Hard).
2. **Safe Code Execution:** Build a controlled server-side execution sandbox supporting C++ (g++), Python 3, and JavaScript (Node.js) with strict execution timeouts (2500ms), output buffer caps (64KB), and sanitized environments preventing host system compromise.
3. **Automated Evaluation:** Segregate sample test cases from confidential hidden test suites to prevent student hardcoding while providing meaningful feedback (ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, COMPILATION_ERROR, RUNTIME_ERROR).
4. **Gamification & Habit Building:** Incentivize consistent daily practice through server-calculated streaks, first-solve point allocation (+10, +20, +30), progressive levels (1 to 5), and achievement badges.
5. **Rule-Based Recommendation:** Provide dynamic, personalized problem suggestions derived from topic accuracy and difficulty history, accompanied by clear human-readable explanations.
6. **Faculty Assessment Management:** Enable teachers to create timed exams with synchronized countdown timers, auto-submission on expiration, and cohort rank calculation.

### 1.4 Scope of the System
- **Student Role:** Registration, login, profile management, problem browsing/filtering, split-screen code editing, sample run, hidden submission, progress tracking, timed assessments, global leaderboard.
- **Teacher/Admin Role:** Administrative dashboard, problem CRUD with test case management, assessment creation with question scoring, student cohort inspection, live submission audit feed.

### 1.5 Limitations
- In the local development configuration, code execution relies on operating system child process supervisors with resource limits rather than kernel-level cgroups/Docker containers (Docker configuration files are provided for containerized environments).
- Focus is placed on foundational competitive programming standard I/O (stdin/stdout) rather than graphical output or file system operations.

---

## CHAPTER 2: REQUIREMENT ANALYSIS

### 2.1 Functional Requirements
- **FR-1 (Authentication):** Secure user registration and login with bcrypt password hashing (10 rounds) and 7-day signed JWT tokens.
- **FR-2 (Role-Based Access):** Strict middleware segregation between Student and Teacher endpoints (HTTP 403 on unauthorized administrative requests).
- **FR-3 (Problem Management):** Full CRUD for problems containing markdown descriptions, constraints, I/O formats, starter templates, and test cases.
- **FR-4 (Code Execution):** Child process execution of C++, Python, and JavaScript code against stdin input with 3000ms timeout killing.
- **FR-5 (Submission Evaluation):** Normalized whitespace/line ending string comparison of process stdout against expected output.
- **FR-6 (Gamification Logic):**
  - Points awarded exclusively on first accepted solve per problem.
  - Streaks incremented only across consecutive calendar days; reset to 1 on inactivity gaps.
  - Automated badge unlocking across solve count, streak length, and topic mastery.
- **FR-7 (Recommendation Engine):** Rule-based engine targeting low-accuracy topics (< 50%) and progressive difficulties with transparent reasoning.
- **FR-8 (Assessment Engine):** Server-aware timer computing remaining time from database start timestamps, auto-finalizing attempts upon deadline expiration.

### 2.2 Non-Functional Requirements
- **NFR-1 (Security):** Environment isolation stripping database credentials and secrets before spawning untrusted code processes.
- **NFR-2 (Reliability):** Real database persistence using MongoDB and Mongoose with disk-backed embedded fallback for zero-configuration viva deployment.
- **NFR-3 (Performance):** Sub-second API response times; efficient Monaco Editor syntax highlighting; clean Recharts visual updates.
- **NFR-4 (Usability):** Dark-mode first interface following modern developer aesthetics with clear visual hierarchy and zero non-functional UI elements.

### 2.3 Hardware Requirements
- **Processor:** Intel Core i3 / AMD Ryzen 3 or higher.
- **RAM:** Minimum 4 GB (8 GB recommended for concurrent builds and compiler execution).
- **Storage:** 1 GB free disk space for Node dependencies and MongoDB storage.

### 2.4 Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Runtime Environment:** Node.js v18+ (tested on Node.js v24.19.0).
- **Compilers / Interpreters:** MinGW GCC/G++ 6.3.0+, Python 3.10+ (tested on Python 3.14.7).
- **Database:** MongoDB 6.0+ (or embedded persistent MongoMemoryServer engine).
- **Web Browser:** Modern browser supporting ES6 (Chrome, Edge, Firefox).

---

## CHAPTER 3: SYSTEM DESIGN AND ARCHITECTURE

### 3.1 High-Level Architecture
CodeArena follows a classic 3-Tier Monorepo Web Architecture:
1. **Presentation Tier (`client/`):** Built with React 18, Vite, React Router, Tailwind CSS, Monaco Editor, and Recharts. Connects to backend endpoints via proxy and REST API requests with JWT Bearer tokens.
2. **Application & Execution Tier (`server/` and `executor/`):** Express.js REST server managing controllers, domain business logic (Gamification, Recommendations, Analytics), and delegating untrusted code compilation and execution to `executor/runner.js`.
3. **Data Tier (MongoDB):** Mongoose ODM mapping schemas for Users, Problems, Submissions, Assessments, AssessmentResults, and Badges with indexed lookups.

*(Complete diagrams including Architecture, ER Diagram, Student Flowchart, DFD Level 0, DFD Level 1, Use Case, and Auth Flow are documented in detail in `docs/architecture/DIAGRAMS.md`).*

---

## CHAPTER 4: IMPLEMENTATION

### 4.1 Frontend Layer
The client application is organized into modular directories:
- `src/api/api.js`: Centralized fetch client injecting `Authorization: Bearer <token>` and normalizing API errors.
- `src/context/AuthContext.jsx`: Provides reactive authentication state, user metadata, login/register methods, and profile refresh triggers.
- `src/components/editor/`: Monaco Editor wrapper with language switcher, font scaling, starter code reset, and tabbed console displaying test case passes, runtimes, and output diffs.
- `src/pages/`: Dedicated views for Landing, Authentication, Student Dashboard, Problem Browser, Problem Workspace, Timed Assessments Room, Leaderboard, and Admin Portals.

### 4.2 Backend & REST API
Built using Express.js 4, Helmet for secure HTTP headers, CORS configuration, and Morgan request logging:
- `/api/auth`: Handles user registration, bcrypt authentication, and profile retrieval.
- `/api/problems`: Supports dynamic multi-criteria filtering (topic, difficulty, solved state) and admin CRUD.
- `/api/submissions`: Exposes `/run` (sample execution) and `/submit` (hidden test evaluation and gamification hook).
- `/api/assessments`: Implements exam scheduling, synchronized attempt management, and scorecard ranking.
- `/api/dashboard`: Aggregates cohort analytics for faculty and personalized metrics for students.

### 4.3 Controlled Code Execution Engine (`executor/`)
The runner script (`executor/runner.js`) provides controlled sandboxing:
- Generates a transient unique sandbox directory per run (`executor/temp/<uuid>`).
- Enforces execution limits:
  - Execution timeout capped at 3000ms using process tree kill (`taskkill /pid ... /f /t` on Windows, `SIGKILL` on POSIX).
  - Maximum stdout/stderr buffer capped at 64KB to prevent output flood exploits.
  - Sanitized environment containing only basic system paths (never exposing server `process.env` or database credentials).
  - Normalizes CRLF to LF and strips trailing whitespace for objective output comparison.
  - Guarantees immediate filesystem cleanup in a `finally` block.

### 4.4 Gamification System
- **Points:** Easy (+10), Medium (+20), Hard (+30) awarded only on first accepted solve (`isFirstSolve`).
- **Levels:** Level 1 (0-99), Level 2 (100-249), Level 3 (250-499), Level 4 (500-999), Level 5 (1000+).
- **Streaks:** Calendar day comparison checks today vs yesterday vs gap. Multi-day gaps reset streak to 1.
- **Badges:** 10 database-driven badges awarded dynamically upon meeting milestone criteria.

### 4.5 Recommendation Engine
Rule-based logic analyzes student topic accuracy:
- If topic accuracy < 50% or repeated failures: Suggests Easy foundational problems in that topic.
- If topic accuracy 50-75%: Suggests Medium problems to build competence.
- If topic accuracy > 75%: Challenges student with advanced problems.
- Generates explicit rationale: *"Recommended because your accuracy in Trees is 42%. Let's reinforce fundamentals."*

---

## CHAPTER 5: TESTING AND RESULTS

### 5.1 Testing Strategy
A rigorous multi-tiered verification methodology was applied:
1. **Automated Unit & Integration Suite (`server/tests/api.test.js`):** 32 distinct automated test cases testing database connectivity, model validation, bcrypt hashing, level calculation, streak increments, multi-language code runs, timeout safeguards, recommendation rules, and assessment calculations.
2. **Compiler Verification:** Successfully executed native C++ compilation (MinGW g++ 6.3.0), Python 3.14 unbuffered execution, and Node.js v24 JavaScript execution.
3. **Build Verification:** Client production build compiled cleanly with zero fatal errors via Vite.

*(Full test results matrix is documented in `docs/testing/TEST_PLAN_AND_MATRIX.md`).*

---

## CHAPTER 6: CONCLUSION AND FUTURE SCOPE

### 6.1 Conclusion
CodeArena successfully achieves all design objectives set forth for the CSE Minor Project-I. The platform provides a genuine, non-trivial full-stack web application combining real database persistence, controlled server-side multi-language code execution, rule-based recommendation logic, gamified habit formation, and faculty-supervised timed assessments. Every UI element and button is backed by working backend services, making the project exceptionally suitable for academic evaluation and viva demonstration.

### 6.2 Future Scope
While fully functional for its intended academic scope, future iterations may incorporate:
1. **Containerized Worker Pools:** Scaling code execution across distributed Docker/Kubernetes worker pools for high-concurrency national contests.
2. **Additional Programming Languages:** Expanding native runner support to Java, Rust, and Go.
3. **Real-time Collaborative Coding:** WebSockets-enabled live pair programming and interview rooms.
4. **Mobile Client:** Dedicated React Native cross-platform application for practice on mobile devices.
