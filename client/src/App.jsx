import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProblemList } from './pages/ProblemList';
import { ProblemDetail } from './pages/ProblemDetail';
import { AssessmentsList } from './pages/AssessmentsList';
import { AssessmentRoom } from './pages/AssessmentRoom';
import { AssessmentResultPage } from './pages/AssessmentResultPage';
import { Leaderboard } from './pages/Leaderboard';
import { UserProfile } from './pages/UserProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageProblems } from './pages/admin/ManageProblems';
import { ProblemEditor } from './pages/admin/ProblemEditor';
import { ManageAssessments } from './pages/admin/ManageAssessments';
import { AssessmentEditor } from './pages/admin/AssessmentEditor';
import { StudentManagement } from './pages/admin/StudentManagement';
import { SubmissionMonitoring } from './pages/admin/SubmissionMonitoring';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* Protected Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments"
                element={
                  <ProtectedRoute>
                    <AssessmentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments/:id/room"
                element={
                  <ProtectedRoute>
                    <AssessmentRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments/:id/results"
                element={
                  <ProtectedRoute>
                    <AssessmentResultPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/problems"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageProblems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/problems/new"
                element={
                  <ProtectedRoute adminOnly>
                    <ProblemEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/problems/:id/edit"
                element={
                  <ProtectedRoute adminOnly>
                    <ProblemEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assessments"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageAssessments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assessments/new"
                element={
                  <ProtectedRoute adminOnly>
                    <AssessmentEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute adminOnly>
                    <StudentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <ProtectedRoute adminOnly>
                    <SubmissionMonitoring />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
