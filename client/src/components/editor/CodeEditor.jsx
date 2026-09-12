import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Settings2, Code } from 'lucide-react';

const LANGUAGE_CONFIGS = {
  python: { label: 'Python 3', monacoLang: 'python' },
  cpp: { label: 'C++ (g++)', monacoLang: 'cpp' },
  javascript: { label: 'JavaScript (Node.js)', monacoLang: 'javascript' },
};

export const CodeEditor = ({
  language = 'python',
  setLanguage,
  code,
  setCode,
  onResetCode,
  isExecuting = false,
}) => {
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d121f] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800 gap-2">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Code className="w-4 h-4 text-indigo-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isExecuting}
              className="bg-gray-800/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="bg-gray-800 text-gray-300 text-xs px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>

          {/* Reset Starter Code */}
          <button
            type="button"
            onClick={onResetCode}
            disabled={isExecuting}
            title="Reset to default starter template"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[360px] relative">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIGS[language]?.monacoLang || 'python'}
          value={code}
          theme={editorTheme}
          onChange={handleEditorChange}
          options={{
            fontSize,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            suggestOnTriggerCharacters: true,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Loading code editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
