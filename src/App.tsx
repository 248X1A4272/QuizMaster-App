import React from 'react';
import { QuizProviderContext, useQuiz } from './context/QuizContext';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AddQuestionScreen } from './components/AddQuestionScreen';
import { QuestionDetailScreen } from './components/QuestionDetailScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { FlutterDevTools } from './components/FlutterDevTools';

const AppContent: React.FC = () => {
  const { currentScreen } = useQuiz();

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'result':
      return <ResultScreen />;
    case 'add_question':
      return <AddQuestionScreen />;
    case 'question_bank':
    case 'question_detail':
      return <QuestionDetailScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'flutter_code':
      return <FlutterDevTools />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <QuizProviderContext>
      <DeviceFrame>
        <AppContent />
      </DeviceFrame>
    </QuizProviderContext>
  );
}
