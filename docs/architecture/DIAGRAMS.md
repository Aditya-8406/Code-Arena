# CodeArena - System Architecture & Visual Diagrams
## CSE Minor Project-I Technical Documentation

---

### 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Client_Layer ["Frontend Client Layer (React 18 + Vite + Tailwind CSS)"]
        UI["Modern Responsive UI / Monaco Editor"]
        Router["React Router DOM (Protected & Role Routes)"]
        AuthCtx["AuthContext (JWT & State)"]
        Charts["Recharts Analytics / Gamification"]
    end

    subgraph API_Layer ["Backend Application Server (Express.js / Node.js)"]
        Gateway["REST API Gateway (CORS, Helmet, Rate Limits)"]
        AuthMid["JWT Auth & Role-Based Middleware"]
        Controllers["Controllers (Problems, Submissions, Assessments, Dashboard)"]
        Services["Domain Services (Gamification, Recommendations, Analytics)"]
    end

    subgraph Storage_Layer ["Database Persistence (MongoDB / Mongoose)"]
        UsersCol[("Users Collection")]
        ProblemsCol[("Problems Collection")]
        SubmissionsCol[("Submissions Collection")]
        AssessmentsCol[("Assessments & Results Collection")]
        BadgesCol[("Badges Collection")]
    end

    subgraph Execution_Layer ["Controlled Code Execution Sandbox (executor/)"]
        Runner["runner.js Process Supervisor"]
        TempSand["Isolated Temp Sandbox (/temp/uuid)"]
        CPP["MinGW g++ Compiler"]
        PY["Python 3.14 Unbuffered Runtime"]
        JS["Node.js Isolated VM"]
        Watchdog["Timeout Killer (2.5s) & Output Cap (64KB)"]
    end

    UI --> Router
    Router --> Gateway
    Gateway --> AuthMid
    AuthMid --> Controllers
    Controllers --> Services
    Services --> UsersCol
    Services --> ProblemsCol
    Services --> SubmissionsCol
    Services --> AssessmentsCol
    Services --> BadgesCol

    Controllers --> Runner
    Runner --> TempSand
    TempSand --> CPP
    TempSand --> PY
    TempSand --> JS
    Runner --> Watchdog
```

---

### 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ SUBMISSION : submits
    USER ||--o{ ASSESSMENT_RESULT : takes
    USER }o--o{ BADGE : earns
    PROBLEM ||--o{ SUBMISSION : evaluated_in
    ASSESSMENT ||--|{ PROBLEM : contains
    ASSESSMENT ||--o{ ASSESSMENT_RESULT : produces

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role
        number points
        number level
        number currentStreak
        number longestStreak
        date lastActiveDate
        array solvedProblems
        date createdAt
    }

    PROBLEM {
        ObjectId _id PK
        string title
        string slug
        string topic
        string difficulty
        string description
        string constraints
        string inputFormat
        string outputFormat
        array examples
        object starterCode
        array sampleTestCases
        array hiddenTestCases
        number totalSubmissions
        number acceptedSubmissions
        ObjectId createdBy FK
    }

    SUBMISSION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId problemId FK
        string language
        string sourceCode
        string status
        number passedTests
        number totalTests
        number executionTime
        ObjectId assessmentId FK
        date createdAt
    }

    ASSESSMENT {
        ObjectId _id PK
        string title
        string description
        number duration
        number totalMarks
        boolean isActive
        array problems
        ObjectId createdBy FK
        date createdAt
    }

    ASSESSMENT_RESULT {
        ObjectId _id PK
        ObjectId assessmentId FK
        ObjectId userId FK
        number score
        number maxScore
        number attempted
        number solved
        number accuracy
        number timeUsed
        boolean isCompleted
        date startedAt
        date submittedAt
    }

    BADGE {
        ObjectId _id PK
        string slug
        string name
        string description
        string icon
        string category
        string criteriaType
        number criteriaValue
    }
```

---

### 3. Student Workflow Flowchart

```mermaid
flowchart TD
    Start([Student Visits CodeArena]) --> AuthCheck{Logged In?}
    AuthCheck -- No --> AuthPage[Register / Login with Credentials]
    AuthPage --> AuthCheck
    AuthCheck -- Yes --> Dashboard[View Student Dashboard]

    Dashboard --> Choice{Select Action}
    Choice -->|Practice Problem| ProblemList[Browse & Filter DSA Problems]
    Choice -->|Timed Contest| AssessmentList[Select Assessment]
    Choice -->|Leaderboard| LeaderboardView[Inspect Rankings & Streaks]
    Choice -->|Recommendation| RecProblem[Open Recommended Problem]

    ProblemList --> OpenProblem[Open Problem Detail Workspace]
    RecProblem --> OpenProblem

    OpenProblem --> WriteCode[Select Language: C++, Python, JS & Write Code]
    WriteCode --> RunAction[Click 'Run Code']
    RunAction --> ExecuteSample[Execute against Sample Test Cases]
    ExecuteSample --> DisplayConsole[Inspect Terminal Output & Diffs]

    DisplayConsole --> ReadySubmit{Ready to Submit?}
    ReadySubmit -- No --> WriteCode
    ReadySubmit -- Yes --> SubmitAction[Click 'Submit Code']
    SubmitAction --> HiddenEval[Evaluate against Hidden Test Suite]

    HiddenEval --> VerdictCheck{All Passed?}
    VerdictCheck -- No --> ShowVerdict[Show Verdict: WA, TLE, CE, RE]
    ShowVerdict --> WriteCode

    VerdictCheck -- Yes --> Accepted[Status: ACCEPTED]
    Accepted --> Confetti[Celebrate Confetti & Modal]
    Accepted --> Gamify[Award Points on 1st Solve]
    Gamify --> StreakCheck[Increment Daily Streak]
    StreakCheck --> BadgeCheck[Evaluate Milestone Badges]
    BadgeCheck --> UpdateRec[Refresh Rule-Based Recommendations]
    UpdateRec --> Dashboard

    AssessmentList --> StartExam[Start Synchronized Exam Room]
    StartExam --> ServerTimer[Countdown Timer Active]
    ServerTimer --> SolveQuestions[Code & Submit Questions]
    SolveQuestions --> ExamSubmit{Submit or Time Out?}
    ExamSubmit --> CalculateScore[Server Evaluates Total Score & Accuracy]
    CalculateScore --> ShowScorecard[Display Exam Scorecard & Rankings]
```

---

### 4. Data Flow Diagram - Level 0 (Context Diagram)

```mermaid
graph TD
    Student(("Student"))
    Teacher(("Teacher / Admin"))
    CodeArenaSystem[["CodeArena Platform (DSA Learning & Assessment)"]]
    Database[("Persistent MongoDB Storage")]
    CompilerEngine[["Code Execution Subsystem (g++, Python, Node)"]]

    Student -->|Registration, Login, Solution Code, Assessment Answers| CodeArenaSystem
    CodeArenaSystem -->|Problem Prompts, Verdicts, Points, Streaks, Recommendations| Student

    Teacher -->|Problem Specifications, Test Cases, Assessment Schedules| CodeArenaSystem
    CodeArenaSystem -->|Student Cohort Analytics, Submissions Feed, Exam Scores| Teacher

    CodeArenaSystem <-->|Read / Write Users, Problems, Submissions, Badges| Database
    CodeArenaSystem -->|User Source Code, Stdin Inputs, Timeout Parameters| CompilerEngine
    CompilerEngine -->|Execution Verdicts, Stderr, Stdout, Runtime Metrics| CodeArenaSystem
```

---

### 5. Data Flow Diagram - Level 1

```mermaid
graph TD
    User(("Student / Admin"))

    subgraph Core_Processes ["CodeArena Level 1 Processes"]
        P1["1.0 Authentication & Authorization"]
        P2["2.0 Problem Repository Management"]
        P3["3.0 Code Execution & Evaluation Engine"]
        P4["4.0 Gamification, Badges & Streaks Service"]
        P5["5.0 Rule-Based Recommendation Engine"]
        P6["6.0 Timed Assessment & Exam Supervision"]
        P7["7.0 Analytics & Performance Aggregator"]
    end

    User -->|Credentials| P1
    P1 -->|JWT Token| User

    User -->|Problem Form Data| P2
    P2 -->|Problems Catalog| User

    User -->|Source Code & Stdin| P3
    P3 -->|Verdicts & Test Results| User
    P3 -->|Accepted Event| P4
    P4 -->|Points, Badges, Level| User

    P3 -->|Submission History| P5
    P5 -->|Tailored Problems & Rationale| User

    User -->|Exam Submissions| P6
    P6 -->|Scorecard & Ranking| User

    P7 -->|Cohort Performance & Charts| User
```

---

### 6. Use Case Diagram

```mermaid
graph LR
    subgraph Actors
        Student(("Student"))
        Teacher(("Teacher / Admin"))
    end

    subgraph CodeArena_System ["CodeArena System Boundary"]
        UC1(["Register & Authenticate"])
        UC2(["Browse & Filter DSA Problems"])
        UC3(["Run Code (Sample Cases)"])
        UC4(["Submit Code (Hidden Tests)"])
        UC5(["View Gamified Dashboard"])
        UC6(["Take Timed Assessment"])
        UC7(["View Public Leaderboard"])
        UC8(["Create / Edit / Delete Problems"])
        UC9(["Create / Manage Assessments"])
        UC10(["Monitor Student Analytics"])
        UC11(["Audit Live Submissions Feed"])
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    Teacher --> UC1
    Teacher --> UC2
    Teacher --> UC7
    Teacher --> UC8
    Teacher --> UC9
    Teacher --> UC10
    Teacher --> UC11
```

---

### 7. Authentication Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor Client as User / Browser
    participant API as Express Auth API
    participant Bcrypt as Bcrypt Security
    participant DB as MongoDB Users
    participant JWT as JWT Service

    Client->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email }).select('+password')
    DB-->>API: User document
    alt User not found
        API-->>Client: 401 Unauthorized (Invalid credentials)
    else User found
        API->>Bcrypt: bcrypt.compare(enteredPassword, hash)
        Bcrypt-->>API: Match result (true/false)
        alt Password mismatch
            API-->>Client: 401 Unauthorized
        else Password matches
            API->>API: updateStreak(user) server calendar check
            API->>DB: user.save()
            API->>JWT: jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' })
            JWT-->>API: Signed JWT Token
            API-->>Client: 200 OK { token, user: { name, role, points, level, streak } }
        end
    end
```

---

### 8. Code Submission & Execution Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student
    participant API as Express Submissions API
    participant Runner as Executor Sandbox (runner.js)
    participant Subprocess as Isolated Child Process
    participant DB as MongoDB Database
    participant Gamify as Gamification Service

    Student->>API: POST /api/submissions/submit { problemId, language, sourceCode }
    API->>DB: Problem.findById(problemId)
    DB-->>API: Problem details with hidden test suite
    API->>Runner: evaluateSubmission(language, sourceCode, testCases, isHidden=true)
    
    loop For Each Hidden Test Case
        Runner->>Runner: Create temporary sandbox directory (UUID)
        alt Language is C++
            Runner->>Subprocess: g++ -O2 -std=c++14 solution.cpp -o solution.exe
            alt Compilation Error
                Subprocess-->>Runner: Return COMPILATION_ERROR + stderr
            end
        end
        Runner->>Subprocess: Spawn executable with piped Stdin (Timeout = 3000ms)
        alt Process exceeds timeout
            Runner->>Subprocess: Terminate process tree (SIGKILL)
            Subprocess-->>Runner: TIME_LIMIT_EXCEEDED
        else Process crashes
            Subprocess-->>Runner: RUNTIME_ERROR + exit code
        else Successful execution
            Subprocess-->>Runner: Stdout captured (capped at 64KB)
        end
        Runner->>Runner: Clean up temporary UUID sandbox directory
        Runner->>Runner: normalizeOutput(stdout) vs normalizeOutput(expectedOutput)
    end

    Runner-->>API: Final Verdict (ACCEPTED / WRONG_ANSWER / TLE / CE / RE)
    API->>DB: Save Submission Record
    alt Verdict is ACCEPTED
        API->>Gamify: processAcceptedSubmission(userId, problemId, language)
        Gamify->>DB: Check if first solve
        Gamify->>DB: Award Points (+10/+20/+30), update Level, Streak & Badges
        Gamify-->>API: Updated gamification payload
    end
    API-->>Student: 201 Created { submission, gamification }
```
