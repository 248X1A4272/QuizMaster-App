import React from 'react';
import { useQuiz } from '../context/QuizContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const QuizScreen: React.FC = () => {
  const {
    activeQuestions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswerSubmitted,
    currentScore,
    quizStatus,
    errorMessage,
    selectedCategory,
    selectAnswer,
    nextQuestion,
    startQuiz,
    setCurrentScreen,
  } = useQuiz();

  // Loading state
  if (quizStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] p-6 text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            QM
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Loading Questions...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Retrieving questions for {selectedCategory?.name || 'this category'} from the Open Trivia API and device bank.
        </p>
      </div>
    );
  }

  // Error state with retry
  if (quizStatus === 'error' || activeQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Unable to Load Questions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
          {errorMessage || 'There are currently no questions available for this category.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Categories
          </button>
          {selectedCategory && (
            <button
              onClick={() => startQuiz(selectedCategory)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top App Bar Navigation */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => setCurrentScreen('home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Quit Quiz"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate">
            {selectedCategory?.name}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Current Score Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300">
          <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-mono text-xs font-bold">{currentScore} pts</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1.5">
          <span>Progress</span>
          <span className="font-mono font-medium">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {currentQ.difficulty ? `${currentQ.difficulty} difficulty` : 'multiple choice'}
          </span>
          {currentQ.isCustom && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Custom
            </span>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h2>
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {currentQ.options.map((option, idx) => {
          const label = OPTION_LABELS[idx % OPTION_LABELS.length];
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQ.correctAnswer;

          // Determine styling based on submission lock
          let buttonStyles =
            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-600';
          let badgeStyles =
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';

          if (isAnswerSubmitted) {
            if (isCorrectAnswer) {
              buttonStyles =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm';
              badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
            } else if (isSelected) {
              buttonStyles =
                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 shadow-sm';
              badgeStyles = 'bg-rose-600 text-white border-rose-600';
            } else {
              buttonStyles =
                'border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 opacity-60';
              badgeStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
            }
          } else if (isSelected) {
            buttonStyles =
              'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100';
            badgeStyles = 'bg-indigo-600 text-white border-indigo-600';
          }

          return (
            <button
              key={`${currentQ.id}_opt_${idx}`}
              disabled={isAnswerSubmitted}
              onClick={() => selectAnswer(option)}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${buttonStyles} ${
                !isAnswerSubmitted ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Option Letter Tag */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyles}`}
              >
                {label}
              </div>

              {/* Option text */}
              <span className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                {option}
              </span>

              {/* Verification Icon indicator */}
              {isAnswerSubmitted && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Banner (Revealed after submission) */}
      {isAnswerSubmitted && (
        <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">
                {selectedAnswer === currentQ.correctAnswer ? 'Correct Answer! (+10 pts)' : 'Incorrect!'}
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentQ.explanation ||
                  `The verified correct answer is "${currentQ.correctAnswer}".`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Next Question CTA */}
      {isAnswerSubmitted && (
        <div className="mt-auto pt-2">
          <button
            onClick={nextQuestion}
            className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
