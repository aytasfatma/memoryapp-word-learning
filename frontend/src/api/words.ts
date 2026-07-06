import { apiRequest } from './client';

export interface Word {
  wordId: number;
  engWordName: string;
  turWordName: string;
  picture?: string;
  audioPath?: string;
  topic?: string;
  mnemonicHint?: string;
  samples: string[];
}

export interface CreateWordRequest {
  engWordName: string;
  turWordName: string;
  topic?: string;
  mnemonicHint?: string;
  samples: string[];
  picture?: File;
  audio?: File;
}

export function getWords() {
  return apiRequest<Word[]>('/words');
}

export function getWord(id: number) {
  return apiRequest<Word>(`/words/${id}`);
}

export function createWord(data: CreateWordRequest) {
  const formData = new FormData();
  formData.append('engWordName', data.engWordName);
  formData.append('turWordName', data.turWordName);
  if (data.topic) formData.append('topic', data.topic);
  if (data.mnemonicHint) formData.append('mnemonicHint', data.mnemonicHint);
  data.samples.forEach((sample, idx) => {
    formData.append(`samples[${idx}]`, sample);
  });
  if (data.picture) formData.append('picture', data.picture);
  if (data.audio) formData.append('audio', data.audio);

  return apiRequest<Word>('/words', {
    method: 'POST',
    body: formData,
  });
}

export function deleteWord(id: number) {
  return apiRequest<{ message: string }>(`/words/${id}`, {
    method: 'DELETE',
  });
}
