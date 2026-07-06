import { apiRequest } from './client';

export interface MatchCard {
  cardId: string;
  wordId: number;
  text: string;
  language: 'en' | 'tr';
}

export interface AnagramQuestion {
  wordId: number;
  scrambledWord: string;
  turkishHint: string;
}

export interface WordSearchGame {
  grid: string[][];
  wordsToFind: string[];
  size: number;
}

export async function getMatchGame(wordCount: number) {
  const result = await apiRequest<{ cards: MatchCard[] }>(`/puzzle/match-game?wordCount=${wordCount}`);
  return result.cards;
}

export async function getAnagramGame(wordCount: number) {
  const result = await apiRequest<{ questions: AnagramQuestion[] }>(`/puzzle/anagram?wordCount=${wordCount}`);
  return result.questions;
}

export function getWordSearchGame(wordCount: number) {
  return apiRequest<WordSearchGame>(`/puzzle/word-search?wordCount=${wordCount}`);
}
