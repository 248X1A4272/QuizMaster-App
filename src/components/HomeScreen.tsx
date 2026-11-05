import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizCategory } from '../types/quiz';
import {
  Smartphone,
  Globe,
  Laptop,
  Atom,
  Compass,
  Hourglass,
  Sparkles,
  Trophy,
  Play,
  PlusCircle,
  Code2,
  History,
  ChevronRight,
  Flame,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Smartphone,
  Globe,
  Laptop,
  Atom,
  Compass,
  Hourglass,
  Sparkles,
};

export const HomeScreen: React.FC = () => {
  const {
    categories,
    bestScores,
    customQuestions,
    startQuiz,
    setCurrentScreen,
  } = useQuiz();

  // Calculate highest recorded score
  const topScore = Object.values(bestScores).reduce((max, item) => (item.bestScore > max ? item.bestScore : max), 0);
  const totalQuizzesPlayed = Object.values(bestScores).reduce((sum, item) => sum + item.totalPlayed, 0);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header Profile / Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-lg shadow-indigo-600/20 mb-6">
        {/* Subtle geometric circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-indigo-400/20 blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                QM
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-100">
                Flutter Quiz Platform
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{totalQuizzesPlayed} Quizzes Completed</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">
            Welcome to QuizMaster!
          </h1>
          <p className="text-indigo-100/90 text-xs sm:text-sm max-w-md leading-relaxed mb-5">
            Test your expertise across computer science, science, Flutter & Dart, or solve questions created by your team.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-amber-300" />
              <div>
                <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-medium leading-none">Best Score</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{topScore} pts</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md">
              <BookOpen className="w-4 h-4 text-indigo-200" />
              <div>
                <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-medium leading-none">Custom Pool</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{customQuestions.length} Questions</div>
              </div>
            </div>

            <button
              onClick={() => startQuiz(categories[0])}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold text-xs shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-700" />
              <span>Quick Play</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setCurrentScreen('add_question')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm active:scale-95 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">Add Question</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Custom form</span>
        </button>

        <button
          onClick={() => setCurrentScreen('question_bank')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm active:scale-95 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">Question Bank</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Details & answers</span>
        </button>

        <button
          onClick={() => setCurrentScreen('flutter_code')}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm active:scale-95 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center">Flutter Code</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Dart & tests</span>
        </button>
      </div>

      {/* Categories Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Quiz Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick a topic to begin a 5-question multiple-choice session
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('history')}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <History className="w-3.5 h-3.5" />
          <span>Scores</span>
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-3">
        {categories.map((cat: QuizCategory) => {
          const IconComp = CATEGORY_ICONS[cat.iconName] || Globe;
          const scoreRecord = bestScores[cat.name];
          const hasScore = !!scoreRecord && scoreRecord.bestScore > 0;

          return (
            <button
              key={cat.id}
              onClick={() => startQuiz(cat)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow active:scale-[0.99] transition-all text-left group"
            >
              {/* Category Icon Container */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${cat.color}18`,
                  color: cat.color,
                }}
              >
                <IconComp className="w-6 h-6" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {cat.name}
                  </h3>
                  {cat.id === 'custom_created' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-medium">
                      Device
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>

                {/* Score & Questions Footer */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                  <span>5 Questions</span>
                  <span aria-hidden="true">·</span>
                  {hasScore ? (
                    <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      Best: {scoreRecord.bestScore} pts ({scoreRecord.bestPercentage}%)
                    </span>
                  ) : (
                    <span>Not played yet</span>
                  )}
                </div>
              </div>

              {/* Arrow CTA */}
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
