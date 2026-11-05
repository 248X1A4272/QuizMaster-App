import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const {
    bestScores,
    recentHistory,
    clearAllHistory,
    setCurrentScreen,
    startQuiz,
    categories,
  } = useQuiz();

  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Scores & History
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Saved permanently in SharedPreferences
            </p>
          </div>
        </div>

        {recentHistory.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Clear Confirmation Dialog */}
      {confirmClear && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 mb-4 animate-in fade-in duration-150">
          <p className="text-xs font-semibold text-rose-900 dark:text-rose-200 mb-2">
            Are you sure you want to reset all high scores and history records?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearAllHistory();
                setConfirmClear(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category High Scores Grid */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Category Best Records
        </h2>

        {Object.keys(bestScores).length === 0 ? (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            No quiz records saved yet. Play your first category quiz to record high scores!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {Object.values(bestScores).map((record) => (
              <div
                key={record.category}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mb-1">
                  {record.category}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {record.bestScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">pts</span>
                  <span className="ml-auto text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {record.bestPercentage}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Played {record.totalPlayed} time{record.totalPlayed > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Quiz Sessions */}
      <div>
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Recent Quiz Sessions ({recentHistory.length})
        </h2>

        {recentHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            Your quiz results will appear here chronologically.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentHistory.map((hist) => (
              <div
                key={hist.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {hist.category}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{hist.date}</span>
                    <span>·</span>
                    <span>{hist.correctAnswers}/{hist.totalQuestions} correct</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {hist.score} pts
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {hist.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
