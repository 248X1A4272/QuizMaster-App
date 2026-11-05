import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BestScoreRecord, QuizCategory, QuizQuestion, QuizResultRecord } from '../types/quiz';
import { APP_CATEGORIES, apiService } from '../services/apiService';
import { storageService } from '../services/storageService';
import { soundManager } from '../utils/sound';

export type ScreenName = 'home' | 'quiz' | 'result' | 'add_question' | 'question_bank' | 'question_detail' | 'history' | 'flutter_code';

export type SeedColor = 'indigo' | 'emerald' | 'violet' | 'amber';

interface QuizContextType {
  // Navigation & Theme
  currentScreen: ScreenName;
  setCurrentScreen: (screen: ScreenName) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  seedColor: SeedColor;
  setSeedColor: (color: SeedColor) => void;
  deviceOrientation: 'portrait' | 'landscape';
  toggleOrientation: () => void;
  isDeviceFrame: boolean;
  toggleDeviceFrame: () => void;

  // Categories & Data
  categories: QuizCategory[];
  selectedCategory: QuizCategory | null;
  bestScores: Record<string, BestScoreRecord>;
  customQuestions: QuizQuestion[];
  detailedQuestion: QuizQuestion | null;
  setDetailedQuestion: (q: QuizQuestion | null) => void;

  // Active Quiz State
  activeQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  currentScore: number;
  quizStatus: 'idle' | 'loading' | 'playing' | 'completed' | 'error';
  errorMessage: string | null;
  lastQuizResult: QuizResultRecord | null;
  isNewBestScore: boolean;
  recentHistory: QuizResultRecord[];

  // Actions
  startQuiz: (category: QuizCategory) => Promise<void>;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  retakeCurrentQuiz: () => void;
  addCustomQuestion: (question: Omit<QuizQuestion, 'id' | 'isCustom' | 'createdAt'>) => QuizQuestion;
  deleteCustomQuestion: (id: string) => void;
  clearAllHistory: () => void;
  openQuestionDetail: (q: QuizQuestion) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProviderContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quizmaster_theme') === 'dark';
    }
    return false;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [seedColor, setSeedColor] = useState<SeedColor>('indigo');
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  // Data
  const [categories] = useState<QuizCategory[]>(APP_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [bestScores, setBestScores] = useState<Record<string, BestScoreRecord>>({});
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);
  const [recentHistory, setRecentHistory] = useState<QuizResultRecord[]>([]);
  const [detailedQuestion, setDetailedQuestion] = useState<QuizQuestion | null>(null);

  // Active Quiz
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'loading' | 'playing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuizResult, setLastQuizResult] = useState<QuizResultRecord | null>(null);
  const [isNewBestScore, setIsNewBestScore] = useState<boolean>(false);
  const [reviewsInProgress, setReviewsInProgress] = useState<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  // Load stored data on mount
  useEffect(() => {
    const scores = storageService.getBestScores();
    setBestScores(scores);
    const custom = storageService.getCustomQuestions();
    setCustomQuestions(custom);
    const hist = storageService.getHistory();
    setRecentHistory(hist);
  }, []);

  // Sync theme to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('quizmaster_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('quizmaster_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playTap();
  };

  const toggleOrientation = () => {
    setDeviceOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
    soundManager.playTap();
  };

  const toggleDeviceFrame = () => {
    setIsDeviceFrame((prev) => !prev);
    soundManager.playTap();
  };

  // Start a new quiz for a category
  const startQuiz = async (category: QuizCategory) => {
    setSelectedCategory(category);
    setQuizStatus('loading');
    setErrorMessage(null);
    setCurrentQuestionIndex(0);
    setCurrentScore(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setReviewsInProgress([]);
    setIsNewBestScore(false);
    setCurrentScreen('quiz');
    soundManager.playTap();

    try {
      const result = await apiService.fetchQuestions(category, customQuestions, 5);
      if (result.questions.length === 0) {
        setQuizStatus('error');
        setErrorMessage(result.error || 'No questions available for this category. Add your own questions!');
      } else {
        setActiveQuestions(result.questions);
        setQuizStatus('playing');
      }
    } catch (err: unknown) {
      setQuizStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch questions. Please try again.');
    }
  };

  // Select an option
  const selectAnswer = (answer: string) => {
    if (isAnswerSubmitted) return; // Lock to prevent multi-tapping

    setSelectedAnswer(answer);
    setIsAnswerSubmitted(true);

    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const isCorrect = answer === currentQ.correctAnswer;
    if (isCorrect) {
      setCurrentScore((prev) => prev + 10);
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    setReviewsInProgress((prev) => [
      ...prev,
      {
        question: currentQ.question,
        userAnswer: answer,
        correctAnswer: currentQ.correctAnswer,
        isCorrect,
      },
    ]);
  };

  // Advance to next question or complete quiz
  const nextQuestion = () => {
    soundManager.playTap();
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  // Complete and calculate final results
  const finishQuiz = () => {
    const total = activeQuestions.length;
    const correctCount = reviewsInProgress.filter((r) => r.isCorrect).length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    let performanceMsg = 'Practice makes perfect! Give it another try 🚀';
    if (percentage >= 90) {
      performanceMsg = 'Outstanding Masterclass! 🏆 You conquered this category!';
    } else if (percentage >= 70) {
      performanceMsg = 'Great Job! 🌟 Strong mastery of the subject!';
    } else if (percentage >= 50) {
      performanceMsg = 'Good Effort! 💡 Review your answers and try again!';
    }

    const finalRecord: QuizResultRecord = {
      id: `res_${Date.now()}`,
      category: selectedCategory?.name || 'General',
      totalQuestions: total,
      correctAnswers: correctCount,
      incorrectAnswers: total - correctCount,
      score: currentScore,
      percentage,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      performanceMessage: performanceMsg,
      questionReviews: reviewsInProgress,
    };

    const { isNewBest } = storageService.saveQuizResult(finalRecord);
    setIsNewBestScore(isNewBest);
    setLastQuizResult(finalRecord);
    setBestScores(storageService.getBestScores());
    setRecentHistory(storageService.getHistory());
    setQuizStatus('completed');
    setCurrentScreen('result');

    if (percentage >= 60) {
      soundManager.playFanfare();
    } else {
      soundManager.playTap();
    }
  };

  const retakeCurrentQuiz = () => {
    if (selectedCategory) {
      startQuiz(selectedCategory);
    } else {
      setCurrentScreen('home');
    }
  };

  const addCustomQuestion = (question: Omit<QuizQuestion, 'id' | 'isCustom' | 'createdAt'>) => {
    const created = storageService.addCustomQuestion(question);
    setCustomQuestions(storageService.getCustomQuestions());
    soundManager.playCorrect();
    return created;
  };

  const deleteCustomQuestion = (id: string) => {
    storageService.deleteCustomQuestion(id);
    setCustomQuestions(storageService.getCustomQuestions());
    soundManager.playTap();
  };

  const clearAllHistory = () => {
    storageService.clearAllData();
    setBestScores({});
    setRecentHistory([]);
    setCustomQuestions(storageService.getCustomQuestions());
    soundManager.playTap();
  };

  const openQuestionDetail = (q: QuizQuestion) => {
    setDetailedQuestion(q);
    setCurrentScreen('question_detail');
    soundManager.playTap();
  };

  return (
    <QuizContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isDarkMode,
        toggleDarkMode,
        soundEnabled,
        toggleSound,
        seedColor,
        setSeedColor,
        deviceOrientation,
        toggleOrientation,
        isDeviceFrame,
        toggleDeviceFrame,
        categories,
        selectedCategory,
        bestScores,
        customQuestions,
        detailedQuestion,
        setDetailedQuestion,
        activeQuestions,
        currentQuestionIndex,
        selectedAnswer,
        isAnswerSubmitted,
        currentScore,
        quizStatus,
        errorMessage,
        lastQuizResult,
        isNewBestScore,
        recentHistory,
        startQuiz,
        selectAnswer,
        nextQuestion,
        retakeCurrentQuiz,
        addCustomQuestion,
        deleteCustomQuestion,
        clearAllHistory,
        openQuestionDetail,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProviderContext');
  }
  return context;
};
