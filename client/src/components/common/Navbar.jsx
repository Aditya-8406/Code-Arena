import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Code2,
  Trophy,
  Flame,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  BookOpen,
  Timer,
  LayoutDashboard,
  ShieldAlert,
  Users,
  FileCode2,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
        : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Code<span className="text-indigo-400">Arena</span>
                </span>
                <span className="text-[10px] block -mt-1 font-mono tracking-widest text-gray-400 uppercase">
                  DSA Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {isAuthenticated && (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className={linkClass(isAdmin ? '/admin/dashboard' : '/dashboard')}
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </span>
                </Link>
              )}

              <Link to="/problems" className={linkClass('/problems')}>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Problems
                </span>
              </Link>

              {isAuthenticated && (
                <Link to="/assessments" className={linkClass('/assessments')}>
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4" />
                    Assessments
                  </span>
                </Link>
              )}

              <Link to="/leaderboard" className={linkClass('/leaderboard')}>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </span>
              </Link>

              {/* Admin Links */}
              {isAdmin && (
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg border border-amber-500/20 transition">
                    <ShieldAlert className="w-4 h-4" />
                    Teacher Tools
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute left-0 mt-1 w-48 bg-[#111827] border border-gray-800 rounded-xl shadow-xl py-1 hidden group-hover:block z-50 animate-fade-in">
                    <Link
                      to="/admin/problems"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <BookOpen className="w-4 h-4" /> Manage Problems
                    </Link>
                    <Link
                      to="/admin/assessments"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Timer className="w-4 h-4" /> Manage Assessments
                    </Link>
                    <Link
                      to="/admin/students"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Users className="w-4 h-4" /> Student Analytics
                    </Link>
                    <Link
                      to="/admin/submissions"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <FileCode2 className="w-4 h-4" /> Submissions Feed
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Streak Counter */}
                <div
                  title={`Current Active Streak: ${user.currentStreak || 0} days`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
                >
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
                  <span>{user.currentStreak || 0}d</span>
                </div>

                {/* Points Counter */}
                <div
                  title="Total Points Earned"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>{user.points || 0} pts</span>
                  <span className="px-1.5 py-0.2 bg-indigo-600/40 text-[10px] rounded text-white font-mono">
                    Lvl {user.level || 1}
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg hover:bg-gray-800/70 border border-gray-800 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-[#111827] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-2 border-b border-gray-800/80">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile & Badges
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/20 transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0B0F19] px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated && (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800"
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Problems
          </Link>
          {isAuthenticated && (
            <Link
              to="/assessments"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800"
            >
              Assessments
            </Link>
          )}
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            Leaderboard
          </Link>
          {isAdmin && (
            <div className="pt-2 border-t border-gray-800">
              <p className="text-xs font-semibold text-amber-400 px-3 uppercase mb-1">Teacher Management</p>
              <Link to="/admin/problems" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-gray-300">Manage Problems</Link>
              <Link to="/admin/assessments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-gray-300">Manage Assessments</Link>
              <Link to="/admin/students" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-gray-300">Student Analytics</Link>
              <Link to="/admin/submissions" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-sm text-gray-300">Submissions Feed</Link>
            </div>
          )}
          <div className="pt-3 border-t border-gray-800">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-rose-400 font-medium"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-gray-800 rounded-lg text-sm text-white">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-indigo-600 rounded-lg text-sm text-white">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
