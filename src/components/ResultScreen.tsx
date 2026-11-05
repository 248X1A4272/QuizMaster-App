import React, { useEffect, useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Share2
} from 'lucide-react';

export const ResultScreen: React.FC = () => {
  const {
    lastQuizResult,
    isNewBestScore,
    retakeCurrentQuiz,
    setCurrentScreen,
  } = useQuiz();

  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    if (lastQuizResult && lastQuizResult.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [lastQuizResult]);

  if (!lastQuizResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <p className="text-slate-500 mb-4 text-sm">No recent quiz result found.</p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  const {
    category,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    performanceMessage,
    questionReviews,
  } = lastQuizResult;

  // Determine medal color & style
  let accentClass = 'text-indigo-600 dark:text-indigo-400';
  let badgeColor = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 text-indigo-700 dark:text-indigo-300';
  if (percentage >= 80) {
    accentClass = 'text-emerald-600 dark:text-emerald-400';
    badgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-700 dark:text-emerald-300';
  } else if (percentage < 50) {
    accentClass = 'text-amber-600 dark:text-amber-400';
    badgeColor = 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-700 dark:text-amber-300';
  }

  const handleShare = () => {
    const text = `🎯 I scored ${score} pts (${percentage}%) in ${category} on QuizMaster! Can you beat my score?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Trophy & Performance Header Card */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center mb-5 relative overflow-hidden">
        {/* New Best Score Banner */}
        {isNewBestScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold shadow-md shadow-amber-500/20 mb-3 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEW PERSONAL BEST!</span>
          </div>
        )}

        {/* Large Circular Percentage Meter */}
        <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className={accentClass}
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Accuracy
            </span>
          </div>
        </div>

        {/* Category & Performance Message */}
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          {category}
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {performanceMessage}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          You earned <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">{score} points</strong>. All results are securely saved to local Android storage.
        </p>

        {/* Share Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Score Copied!' : 'Share Score'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-7 h-7 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {correctAnswers}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Correct</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-7 h-7 mx-auto rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5">
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
            {incorrectAnswers}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Incorrect</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-7 h-7 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {totalQuestions}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Total Qs</div>
        </div>
      </div>

      {/* Review Answers Toggle Button */}
      {questionReviews && questionReviews.length > 0 && (
        <div className="mb-5">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span>Review Detailed Answers ({questionReviews.length})</span>
            </div>
            {showReviews ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Expanded Question Review List */}
          {showReviews && (
            <div className="flex flex-col gap-2.5 mt-3 animate-in fade-in duration-200">
              {questionReviews.map((rev, i) => (
                <div
                  key={`rev_${i}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {rev.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                      {i + 1}. {rev.question}
                    </span>
                  </div>

                  <div className="pl-6 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Your Answer:</span>
                      <span className={`font-medium ${rev.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {rev.userAnswer}
                      </span>
                    </div>
                    {!rev.isCorrect && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Correct Answer:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {rev.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => setCurrentScreen('home')}
          className="h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={retakeCurrentQuiz}
          className="h-12 rounded-2xl bg-indigo-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};
