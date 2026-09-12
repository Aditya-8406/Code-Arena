# CODEARENA
## DSA Learning & Coding Assessment Platform
**CSE Minor Project - I (Computer Science & Engineering)**

CodeArena is a full-stack web application designed for computer science students to master Data Structures and Algorithms through curated coding practice, timed assessments, performance analytics, and gamification, with comprehensive administrative tools for faculty to manage problems and evaluate student cohorts.

---

## 🚀 Key Highlights & Architectural Identity
- **Monorepo Structure:** Clean separation of client frontend, Express backend, code executor sandbox, and academic documentation.
- **Controlled Code Execution:** Native compilation and unbuffered execution for **C++ (MinGW g++)**, **Python 3**, and **JavaScript (Node.js)** with execution timeouts (3000ms), output buffer capping (64KB), and sanitized environments preventing host system compromise.
- **Real Database Persistence:** MongoDB database with Mongoose ODM and zero-configuration persistent embedded engine (`.data/db`) for instant viva evaluation.
- **Gamification Engine:** First-solve points (+10 Easy, +20 Medium, +30 Hard), server-enforced daily streaks, progressive levels (1–5), and automated achievement badge unlocking.
- **Rule-Based Recommendation Engine:** Dynamically analyzes student topic accuracy and failed attempts to deliver targeted recommendations with transparent human reasoning.
- **Faculty Timed Assessments:** Server-synchronized countdown timers, auto-submission on expiration, question scoring, and ranked leaderboards.
- **Modern Responsive UI:** Developer-focused dark theme interface built with React 18, Vite, Tailwind CSS, Monaco Editor, and Recharts.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Recharts, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js 4, REST API Architecture, Helmet, CORS, Morgan |
| **Database** | MongoDB, Mongoose 8 (Persistent embedded fallback via `mongodb-memory-server`) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt password hashing (10 salt rounds) |
| **Code Execution** | Isolated child process runner (`executor/runner.js`) with MinGW g++, Python 3, and Node.js |
| **Containerization** | Dockerfile & `docker-compose.yml` included for containerized deployment |

---

## 📂 Project Monorepo Structure

```text
CSE Minor project/
│
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── api/api.js          # Centralized API service with JWT auth headers
│   │   ├── context/            # Reactive AuthContext provider
│   │   ├── components/         # Reusable UI cards, badges, modals, editors
│   │   │   ├── common/         # Navbar, Footer, BadgePill, Card, Modal, ProtectedRoute
│   │   │   └── editor/         # Monaco CodeEditor, ConsoleOutput test runner
│   │   ├── pages/              # Landing, Login, Register, ProblemList, ProblemDetail,
│   │   │                       # AssessmentsList, AssessmentRoom, AssessmentResult,
│   │   │                       # Leaderboard, UserProfile
│   │   └── pages/admin/        # AdminDashboard, ManageProblems, ProblemEditor,
│   │                           # ManageAssessments, AssessmentEditor,
│   │                           # StudentManagement, SubmissionMonitoring
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy to port 5000
│   └── tailwind.config.js
│
├── server/                     # Backend REST API Server (Node.js + Express)
│   ├── config/db.js            # MongoDB connector with auto-fallback persistence
│   ├── models/                 # Mongoose models (User, Problem, Submission, Assessment, Badge)
│   ├── controllers/            # Business controllers (Auth, Problems, Submissions, etc.)
│   ├── middleware/             # Auth JWT guard, Role authorization, Error handler
│   ├── routes/                 # Express REST route endpoints
│   ├── services/               # Gamification, Recommendations, Analytics services
│   ├── seed/                   # Database seed script with 22+ problems and test cases
│   ├── tests/api.test.js       # Automated system, unit, and sandbox test harness
│   ├── app.js                  # Express app setup and route mounting
│   ├── server.js               # HTTP server entry point (Port 5000)
│   └── package.json
│
├── executor/                   # Controlled Code Execution Subsystem
│   ├── runner.js               # Safe child_process runner (g++, Python, Node)
│   └── Dockerfile              # Container definition for sandbox runner
│
├── docs/                       # Academic CSE Minor Project-I Documentation
│   ├── PROJECT_REPORT.md       # Comprehensive 6-Chapter academic report
│   ├── architecture/           # Mermaid Diagrams (Architecture, ER, Flowcharts, DFD)
│   └── testing/                # Formal Test Plan and Verification Matrix
│
├── .env.example                # Template for environment variables
├── docker-compose.yml          # Multi-container deployment specification
├── package.json                # Root monorepo configuration
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18 or higher (v24 recommended)
- **Compilers** (for local code execution):
  - Python 3.10+ (must be in system PATH as `python`)
  - MinGW GCC/G++ (must be in system PATH as `g++`)

### 1. Clone & Install Dependencies
Run the installation in the project directories:

```bash
# In Windows PowerShell:
cd "CSE Minor project\server"
npm.cmd install

cd "..\client"
npm.cmd install
```

### 2. Configure Environment Variables
A development `.env` is pre-configured in `server/.env`.
If needed, create or verify `server/.env`:
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=codearena_secret_jwt_key_2026_super_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Note: Leaving `MONGODB_URI=` empty automatically enables the persistent embedded MongoDB engine in `.data/db` without requiring any separate database installation).*

---

## 🗄️ Database Seeding & Test Accounts

Run the database seed script to populate system badges, administrator credentials, demo students, and 22+ DSA problems across all 12 topics:

```bash
cd "CSE Minor project\server"
node seed/seed.js
```

### Ready-To-Use Viva Demonstration Accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Teacher / Admin** | `admin@codearena.com` | `Admin@123` | Full admin privileges (Problem CRUD, Assessment creation, Student roster) |
| **Student (Intermediate)** | `rahul@codearena.com` | `Student@123` | Level 2, 120 points, 8-day active streak, 4 solved problems |
| **Student (Top Performer)** | `priya@codearena.com` | `Student@123` | Level 3, 260 points, 14-day active streak, 7 solved problems |
| **Student (Beginner)** | `arjun@codearena.com` | `Student@123` | Level 1, 40 points, 2-day active streak |

*(Tip: The login page also features **"Quick-fill Demo Accounts"** buttons for instant 1-click authentication during academic viva).*

---

## 🏃 Running the Application

### Option A: Run Server & Client Concurrently
In root directory:
```bash
node server/server.js
```
In a second terminal:
```bash
cd client
npm.cmd run dev
```

### Option B: Access the Web Application
- **Frontend UI:** Open your browser at [http://localhost:5173](http://localhost:5173)
- **Backend Health Check:** Open [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Testing & Verification

Run the comprehensive 32-point system test suite:
```bash
cd "CSE Minor project\server"
node tests/api.test.js
```

### What the test suite validates:
- ✅ Database connectivity and persistence
- ✅ Bcrypt password hashing and authentication
- ✅ Streak calculation logic (consecutive increments and gap resets)
- ✅ Level progress thresholds (Levels 1 to 5)
- ✅ C++ compilation (`g++ -O2 -std=c++14`) and standard input evaluation
- ✅ Python 3 unbuffered stdin execution
- ✅ JavaScript (Node.js) stdin execution
- ✅ Sandbox timeout enforcement (`TIME_LIMIT_EXCEEDED` on infinite loops)
- ✅ Multi-test case evaluation (ACCEPTED vs WRONG_ANSWER)
- ✅ First-solve gamification points allocation (+20 on Medium problem)
- ✅ Prevention of duplicate points on repeated submissions
- ✅ Rule-based recommendation engine analysis
- ✅ Timed assessment duration and question verification

---

## 🛡️ Security & Sandbox Protections

1. **Host Environment Isolation:** `executor/runner.js` creates a minimal, sanitized environment object (`PATH`, `SYSTEMROOT`, `TEMP`). Host environment variables such as `JWT_SECRET`, `MONGODB_URI`, and server secrets are strictly omitted, preventing malicious code from reading server secrets.
2. **Process Timeout Enforcement:** Untrusted processes are monitored with a 3000ms watchdog timer. Any hanging or infinite loop process tree is immediately killed.
3. **Buffer Flooding Protection:** Output streams (stdout and stderr) are limited to 64KB. If an infinite loop emits excessive output, output capture is halted and the process is killed.
4. **Temporary Directory Cleanup:** Every code execution occurs in a unique UUID directory inside `executor/temp/` and is deleted in a `finally` block upon completion.

---

## 📚 Academic Documentation
The `docs/` folder contains comprehensive academic materials ready for Minor Project submission:
- **Project Report:** `docs/PROJECT_REPORT.md` (Full Chapters 1–6 covering Introduction, SRS, Architecture, Implementation, Testing, and Conclusion).
- **Architecture Diagrams:** `docs/architecture/DIAGRAMS.md` (Mermaid code for System Architecture, ER Diagram, Flowcharts, DFD 0 & 1, Use Case, Auth, and Submission).
- **Test Plan & Matrix:** `docs/testing/TEST_PLAN_AND_MATRIX.md` (Formal 32-case quality assurance matrix).

---

## 🔮 Future Scope
- Distributed execution worker pools using containerized Docker runners.
- Support for additional programming languages (Java, Rust, Go).
- WebSockets-based real-time multiplayer coding contests.
- Native mobile application using React Native.
