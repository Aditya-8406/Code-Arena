import React from 'react';
import { Code2, Terminal, Shield, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-[#0B0F19] mt-20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CodeArena</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              A comprehensive DSA Learning & Coding Assessment Platform developed for CSE Minor Project-I.
              Engineered with controlled multi-language code execution, rule-based practice recommendations, and real-time student analytics.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> C++, Python 3, JavaScript</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Isolated Sandbox</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Gamified Learning</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">DSA Topics</h4>
            <ul className="space-y-1.5 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">Arrays & Strings</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Linked Lists & Trees</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Stack & Queue</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Dynamic Programming</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Academic Info</h4>
            <p className="text-sm text-gray-400">Computer Science & Engineering</p>
            <p className="text-sm text-gray-400">Minor Project - I</p>
            <p className="text-xs text-gray-400 mt-2">Evaluation-ready with real database persistence, seed data, and viva demonstration modes.</p>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CodeArena. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">Built for CSE Minor Project-I</p>
        </div>
      </div>
    </footer>
  );
};
