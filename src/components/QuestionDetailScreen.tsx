import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizQuestion } from '../types/quiz';
import { INITIAL_CUSTOM_QUESTIONS } from '../services/storageService';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  HelpCircle,
  Play,
  Plus,
  BookOpen,
  Filter
} from 'lucide-react';

export const QuestionDetailScreen: React.FC = () => {
  const {
    customQuestions,
    detailedQuestion,
    setDetailedQuestion,
    deleteCustomQuestion,
    setCurrentScreen,
    startQuiz,
    categories,
  } = useQuiz();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Combined question pool for exploration (custom questions + sample pool)
  const allAvailableQuestions: QuizQuestion[] = [
    ...customQuestions,
    ...INITIAL_CUSTOM_QUESTIONS.filter((seed) => !customQuestions.some((cq) => cq.id === seed.id)),
  ];

  const filteredQuestions = allAvailableQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || q.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryList = [
    'All',
    'Flutter & Dart',
    'Computer Science',
    'Science & Nature',
    'General Knowledge',
  ];

  // If a specific question was clicked to view its full details
  if (detailedQuestion) {
    return (
      <div className="flex flex-col min-h-full pb-20 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setDetailedQuestion(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Question List</span>
          </button>

          {detailedQuestion.isCustom && (
            <button
              onClick={() => {
                deleteCustomQuestion(detailedQuestion.id);
                setDetailedQuestion(null);
              }}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete question from device storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Detailed Question Card */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {detailedQuestion.category}
            </span>
            {detailedQuestion.isCustom && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Custom Created
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
            {detailedQuestion.question}
          </h2>

          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            All Available Options
          </div>

          {/* Options with Correct Answer Highlight */}
          <div className="flex flex-col gap-2.5">
            {detailedQuestion.options.map((option, idx) => {
              const isCorrect = option === detailedQuestion.correctAnswer;
              const labels = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={`opt_det_${idx}`}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-colors ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {labels[idx % labels.length]}
                  </div>

                  <span className="flex-1">{option}</span>

                  {isCorrect && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct Answer</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {detailedQuestion.explanation && (
            <div className="mt-5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">
                    Concept Explanation
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {detailedQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            const cat = categories.find((c) => c.name === detailedQuestion.category) || categories[0];
            startQuiz(cat);
          }}
          className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Practice Quizzes in this Category</span>
        </button>
      </div>
    );
  }

  // Question List / Explorer Screen
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
              Question Bank Explorer
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tap any question to view all 4 options & correct answer
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('add_question')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions, categories, answers..."
          className="w-full h-10 pl-9 pr-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Question List View */}
      {filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            No matching questions found
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            Try adjusting your search query or filter, or add a custom question to this category.
          </p>
          <button
            onClick={() => setCurrentScreen('add_question')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Create Question
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => setDetailedQuestion(q)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 active:scale-[0.99] text-left transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {q.category}
                </span>
                {q.isCustom && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 font-medium">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {q.question}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="truncate">Correct: {q.correctAnswer}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
