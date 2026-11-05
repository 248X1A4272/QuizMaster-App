import { BestScoreRecord, QuizQuestion, QuizResultRecord } from '../types/quiz';

const STORAGE_KEYS = {
  BEST_SCORES: 'quizmaster_best_scores',
  QUIZ_HISTORY: 'quizmaster_history',
  CUSTOM_QUESTIONS: 'quizmaster_custom_questions',
  SETTINGS: 'quizmaster_settings',
};

// Seed questions representing local user-created or offline-ready questions
export const INITIAL_CUSTOM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'custom_1',
    question: 'Which Flutter widget is used as the fundamental visual building block for Material Design structure with app bar, drawer, and body?',
    category: 'Flutter & Dart',
    options: ['Scaffold', 'MaterialApp', 'Container', 'Column'],
    correctAnswer: 'Scaffold',
    explanation: 'Scaffold provides a standardized API for presenting top app bars, bottom navigation, floating action buttons, and drawers.',
    difficulty: 'easy',
    isCustom: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'custom_2',
    question: 'What is the primary role of ChangeNotifier in Flutter state management with Provider?',
    category: 'Flutter & Dart',
    options: [
      'Notifies listeners whenever notifyListeners() is called to trigger rebuilds',
      'Directly handles HTTP requests to background REST APIs',
      'Manages SQLite database transactions synchronously',
      'Provides animation curves for Hero transitions'
    ],
    correctAnswer: 'Notifies listeners whenever notifyListeners() is called to trigger rebuilds',
    explanation: 'ChangeNotifier is a class included in Flutter SDK that provides change notifications to its listeners via notifyListeners().',
    difficulty: 'medium',
    isCustom: true,
    createdAt: '2026-11-02',
  },
  {
    id: 'custom_3',
    question: 'In Dart, what does the "?." operator (null-aware operator) do?',
    category: 'Flutter & Dart',
    options: [
      'Calls a method or property only if the target object is not null',
      'Throws an unhandled NullPointerException immediately',
      'Converts any variable to a nullable type at runtime',
      'Assigns a default fallback value if null'
    ],
    correctAnswer: 'Calls a method or property only if the target object is not null',
    explanation: 'The ?. operator evaluates property access only if the target is non-null; otherwise it returns null safely without throwing.',
    difficulty: 'easy',
    isCustom: true,
    createdAt: '2026-11-03',
  },
  {
    id: 'custom_4',
    question: 'What is the speed of light in vacuum approximately?',
    category: 'Science & Nature',
    options: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '3,000 km/s'],
    correctAnswer: '300,000 km/s',
    explanation: 'The speed of light in vacuum is precisely 299,792,458 m/s, or approximately 300,000 km/s.',
    difficulty: 'easy',
    isCustom: true,
    createdAt: '2026-11-04',
  },
  {
    id: 'custom_5',
    question: 'Which planet in our solar system is known for its prominent system of rings composed mainly of water ice?',
    category: 'Science & Nature',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctAnswer: 'Saturn',
    explanation: 'Saturn has the most extensive and visible ring system in the solar system, composed of ice particles with a smaller amount of rocky debris.',
    difficulty: 'easy',
    isCustom: true,
    createdAt: '2026-11-04',
  }
];

export const storageService = {
  // Best scores (like SharedPreferences getInt / setString)
  getBestScores(): Record<string, BestScoreRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BEST_SCORES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading best scores from localStorage', e);
    }
    return {};
  },

  saveQuizResult(result: QuizResultRecord): { isNewBest: boolean; previousBest: number } {
    try {
      const bestScores = this.getBestScores();
      const catKey = result.category;
      const current = bestScores[catKey];
      let isNewBest = false;
      const previousBest = current ? current.bestScore : 0;

      if (!current || result.score > current.bestScore) {
        isNewBest = true;
        bestScores[catKey] = {
          category: catKey,
          bestScore: result.score,
          bestPercentage: result.percentage,
          totalPlayed: (current?.totalPlayed || 0) + 1,
          lastPlayed: result.date,
        };
      } else {
        bestScores[catKey] = {
          ...current,
          totalPlayed: current.totalPlayed + 1,
          lastPlayed: result.date,
        };
      }

      localStorage.setItem(STORAGE_KEYS.BEST_SCORES, JSON.stringify(bestScores));

      // Also append to history
      const history = this.getHistory();
      history.unshift(result);
      // Keep up to 50 recent records
      const trimmed = history.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(trimmed));

      return { isNewBest, previousBest };
    } catch (e) {
      console.error('Error saving quiz result to localStorage', e);
      return { isNewBest: false, previousBest: 0 };
    }
  },

  getHistory(): QuizResultRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading history from localStorage', e);
    }
    return [];
  },

  getCustomQuestions(): QuizQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with seed custom questions on first run
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(INITIAL_CUSTOM_QUESTIONS));
      return INITIAL_CUSTOM_QUESTIONS;
    } catch (e) {
      console.error('Error reading custom questions', e);
      return INITIAL_CUSTOM_QUESTIONS;
    }
  },

  addCustomQuestion(question: Omit<QuizQuestion, 'id' | 'isCustom' | 'createdAt'>): QuizQuestion {
    const list = this.getCustomQuestions();
    const newQuestion: QuizQuestion = {
      ...question,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newQuestion, ...list];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    return newQuestion;
  },

  deleteCustomQuestion(id: string): boolean {
    const list = this.getCustomQuestions();
    const updated = list.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    return true;
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.BEST_SCORES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(INITIAL_CUSTOM_QUESTIONS));
  }
};
