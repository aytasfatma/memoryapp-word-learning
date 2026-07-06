import { apiRequest } from './client';

export interface UserSettings {
  id: number;
  userId: string;
  dailyNewWordCount: number;
}

export function getSettings() {
  return apiRequest<UserSettings>('/usersettings');
}

export function updateSettings(dailyNewWordCount: number) {
  return apiRequest<UserSettings>('/usersettings', {
    method: 'PUT',
    body: JSON.stringify({ dailyNewWordCount }),
  });
}
