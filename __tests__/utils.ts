import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Task, Goal } from '@/types';

// テストユーティリティ関数
export function renderWithProviders(ui: ReactElement) {
  return render(ui);
}

// モックデータ
export const mockTask: Task = {
  id: 1,
  title: 'TOEIC Part 5の練習',
  category: 'reading',
  dueDate: '2025-08-13',
  completed: false,
  createdAt: '2025-08-13T00:00:00.000Z',
};

export const mockGoal: Goal = {
  targetScore: 800,
  examDate: '2025-12-31',
};

// LocalStorageヘルパー
export const clearLocalStorage = () => {
  window.localStorage.clear();
};

export const setLocalStorageItem = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = (key: string) => {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
