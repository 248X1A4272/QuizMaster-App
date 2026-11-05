import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export const AddQuestionScreen: React.FC = () => {
  const {
    addCustomQuestion,
    setCurrentScreen,
    openQuestionDetail,
  } = useQuiz();

  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Flutter & Dart');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successSaved, setSuccessSaved] = useState<boolean>(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  const categories = [
    'Flutter & Dart',
    'Computer Science',
    'Science & Nature',
    'General Knowledge',
    'Geography',
    'History',
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!questionText.trim()) {
      newErrors.question = 'Question text cannot be blank.';
    } else if (questionText.trim().length < 8) {
      newErrors.question = 'Question text must be at least 8 characters long.';
    }

    if (!optionA.trim()) newErrors.optionA = 'Option A cannot be empty.';
    if (!optionB.trim()) newErrors.optionB = 'Option B cannot be empty.';
    if (!optionC.trim()) newErrors.optionC = 'Option C cannot be empty.';
    if (!optionD.trim()) newErrors.optionD = 'Option D cannot be empty.';

    // Check for duplicate options
    const options = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()].filter(Boolean);
    const uniqueOptions = new Set(options.map((o) => o.toLowerCase()));
    if (uniqueOptions.size < options.length) {
      newErrors.duplicate = 'All four answer options must be unique.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let correctText = optionA.trim();
    if (correctKey === 'B') correctText = optionB.trim();
    if (correctKey === 'C') correctText = optionC.trim();
    if (correctKey === 'D') correctText = optionD.trim();

    const created = addCustomQuestion({
      question: questionText.trim(),
      category,
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswer: correctText,
      explanation: explanation.trim() || undefined,
      difficulty: 'medium',
    });

    setSuccessSaved(true);
    setLastSavedId(created.id);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setCorrectKey('A');
    setErrors({});
    setSuccessSaved(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* App Bar Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setCurrentScreen('home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            Add Custom Question
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Validated question creation saved to device storage
          </p>
        </div>
      </div>

      {/* Success Notification Modal / Alert */}
      {successSaved ? (
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-md text-center my-auto animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Question Successfully Saved!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Your question was validated and added to local device storage. It is now playable under "{category}" and "My Custom Questions".
          </p>

          <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
            <button
              onClick={resetForm}
              className="w-full h-11 rounded-2xl bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Another Question</span>
            </button>
            <button
              onClick={() => setCurrentScreen('question_bank')}
              className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              <span>Explore Question Bank</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Quiz Category</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>Question Text</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Min 8 characters</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
              }}
              placeholder="e.g. Which widget provides the core visual scaffolding in Flutter?"
              className={`p-3.5 rounded-2xl border bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.question ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.question && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.question}
              </span>
            )}
          </div>

          {/* Answer Options */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Four Multiple-Choice Options</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                Radio marks correct answer
              </span>
            </div>

            {errors.duplicate && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.duplicate}</span>
              </div>
            )}

            {[
              { key: 'A', value: optionA, setter: setOptionA, errorKey: 'optionA' },
              { key: 'B', value: optionB, setter: setOptionB, errorKey: 'optionB' },
              { key: 'C', value: optionC, setter: setOptionC, errorKey: 'optionC' },
              { key: 'D', value: optionD, setter: setOptionD, errorKey: 'optionD' },
            ].map(({ key, value, setter, errorKey }) => {
              const isMarkedCorrect = correctKey === key;

              return (
                <div key={key} className="flex flex-col gap-1">
                  <div
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all ${
                      isMarkedCorrect
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Radio button to designate as correct */}
                    <button
                      type="button"
                      onClick={() => setCorrectKey(key as 'A' | 'B' | 'C' | 'D')}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isMarkedCorrect
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                      title={`Click to mark Option ${key} as correct answer`}
                    >
                      {key}
                    </button>

                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        setter(e.target.value);
                        if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: '' }));
                      }}
                      placeholder={`Option ${key} text...`}
                      className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none py-1.5"
                    />

                    {isMarkedCorrect && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0">
                        Correct Answer
                      </span>
                    )}
                  </div>
                  {errors[errorKey] && (
                    <span className="text-[10px] text-rose-500 pl-2">
                      {errors[errorKey]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Explanation & Learning Notes</span>
              <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why is the chosen option correct? (Shown during quiz review)"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Question to Device Storage</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
