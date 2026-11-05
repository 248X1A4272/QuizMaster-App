export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isCustom?: boolean;
  createdAt?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  apiCategoryId?: number;
  description: string;
  iconName: string;
  color: string;
  questionCount: number;
}

export interface QuizResultRecord {
  id: string;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  date: string;
  performanceMessage: string;
  questionReviews: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface BestScoreRecord {
  category: string;
  bestScore: number;
  bestPercentage: number;
  totalPlayed: number;
  lastPlayed: string;
}
