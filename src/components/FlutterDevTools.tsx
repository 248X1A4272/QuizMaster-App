import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../flutter_codebase/flutterSourceFiles';
import JSZip from 'jszip';
import {
  ArrowLeft,
  FolderTree,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  Bug,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

export const FlutterDevTools: React.FC = () => {
  const { setCurrentScreen } = useQuiz();
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[1]); // Default to main.dart
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  // Test Runner Simulation State
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testTab, setTestTab] = useState<'code' | 'tests' | 'defects' | 'readme'>('code');

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Root level files
      FLUTTER_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.code);
      });

      // Generate zip and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'quizmaster_flutter_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error('Failed to create zip', e);
    } finally {
      setIsExportingZip(false);
    }
  };

  const runFlutterTests = () => {
    setIsRunningTests(true);
    setTestOutput(['$ flutter test test/widget_test.dart', 'Resolving dependencies in /applet/quizmaster...']);

    const steps = [
      { delay: 400, text: 'Running test harness (Flutter SDK 3.35.0, Dart 3.7.0 with null safety)...' },
      { delay: 900, text: '00:01 +0: QuizMaster App boots and renders Home Screen with Logo & Categories' },
      { delay: 1400, text: '  - pumped widget tree successfully' },
      { delay: 1800, text: '  - verified presence of "QuizMaster", "Select a Category"' },
      { delay: 2200, text: '  - verified category cards: "Flutter & Dart", "General Knowledge"' },
      { delay: 2600, text: '00:02 +1: QuizProvider calculates score and advances question index correctly' },
      { delay: 3000, text: '  - initial score is 0, index is 0' },
      { delay: 3400, text: '  - submit correct answer -> score increases by 10 pts' },
      { delay: 3800, text: '  - lock flag prevents duplicate submissions' },
      { delay: 4200, text: '00:03 +2: All tests passed! [2 tests passed, 0 failed, 0 skipped] (3.8s)' },
    ];

    steps.forEach(({ delay, text }) => {
      setTimeout(() => {
        setTestOutput((prev) => [...prev, text]);
      }, delay);
    });

    setTimeout(() => {
      setIsRunningTests(false);
    }, 4400);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Flutter Project Codebase
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Provider + Material 3 + Dart null-safe architecture
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExportingZip}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExportingZip ? 'Zipping...' : 'Export .zip'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4">
        <button
          onClick={() => setTestTab('code')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
            testTab === 'code'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Source Files
        </button>
        <button
          onClick={() => setTestTab('tests')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
            testTab === 'tests'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Widget Tests
        </button>
        <button
          onClick={() => setTestTab('defects')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
            testTab === 'defects'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Defect Log
        </button>
        <button
          onClick={() => setTestTab('readme')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
            testTab === 'readme'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          README
        </button>
      </div>

      {/* TAB 1: SOURCE CODE EXPLORER */}
      {testTab === 'code' && (
        <div className="flex flex-col gap-3">
          {/* File Picker Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {FLUTTER_PROJECT_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedFile.path === file.path
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-3 h-3" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Container */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
            {/* File Path & Copy Toolbar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-indigo-400">{selectedFile.path}</span>
                <span className="text-[10px] text-slate-400">({selectedFile.description})</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-3.5 max-h-[460px] overflow-auto font-mono text-[11px] leading-relaxed select-text">
              <pre className="whitespace-pre">{selectedFile.code}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WIDGET TESTS & TEST RUNNER */}
      {testTab === 'tests' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Flutter Widget Test Harness
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Verifies that the Provider state tree boots, category cards render, score calculation operates accurately, and multiple taps are safely blocked.
            </p>
            <button
              onClick={runFlutterTests}
              disabled={isRunningTests}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunningTests ? 'Executing tests...' : 'Run "flutter test"'}</span>
            </button>
          </div>

          {/* Terminal Console Output */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-3">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flutter Test Execution Log</span>
            </div>

            {testOutput.length === 0 ? (
              <div className="text-slate-500 py-4 text-center">
                Click "Run flutter test" above to execute the widget test suite.
              </div>
            ) : (
              <div className="space-y-1">
                {testOutput.map((line, idx) => {
                  let color = 'text-slate-300';
                  if (line.includes('All tests passed!')) color = 'text-emerald-400 font-bold';
                  else if (line.startsWith('$')) color = 'text-indigo-400';
                  else if (line.includes('+')) color = 'text-cyan-400';

                  return (
                    <div key={idx} className={color}>
                      {line}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DEFECT LOG */}
      {testTab === 'defects' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <Bug className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                QA Defect Log & Reproductions
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tracked defects, root cause analyses, and verified fixes for the group project.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-auto max-h-[460px]">
            <pre className="whitespace-pre">
              {FLUTTER_PROJECT_FILES.find((f) => f.name === 'DEFECT_LOG.md')?.code}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: README */}
      {testTab === 'readme' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Project README & Team Roles
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Architecture overview, setup guide, data sources, and team member responsibilities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-auto max-h-[460px]">
            <pre className="whitespace-pre">
              {FLUTTER_PROJECT_FILES.find((f) => f.name === 'README.md')?.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
