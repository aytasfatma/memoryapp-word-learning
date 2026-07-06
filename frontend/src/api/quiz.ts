import { apiRequest } from './client';

export interface QuizQuestion {
  wordId: number;
  prompt: string;
  questionType: 'MultipleChoice' | 'TextInput';
  choices?: string[];
}

export interface QuizAnswer {
  isCorrect: boolean;
  correctAnswer: string;
  isMastered: boolean;
  nextReviewDate: string;
}

export function getTodayQuiz() {
  return apiRequest<QuizQuestion[]>('/quiz/today');
}

export function submitAnswer(wordId: number, answer: string) {
  return apiRequest<QuizAnswer>('/quiz/answer', {
    method: 'POST',
    body: JSON.stringify({ wordId, answer }),
  });
}
