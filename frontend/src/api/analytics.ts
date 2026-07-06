import { apiRequest } from './client';

export interface TopicStats {
  topic: string;
  totalAttempts: number;
  totalCorrect: number;
  successPercentage: number;
}

export interface AnalyticsReport {
  totalWordsStudied: number;
  totalMasteredWords: number;
  topicBreakdown: TopicStats[];
}

export function getAnalyticsReport() {
  return apiRequest<AnalyticsReport>('/analytics/report');
}
