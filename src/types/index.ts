import { Timestamp } from 'firebase/firestore';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  completionData?: CompletionData;
}

// Firebase用の型定義
export interface FirebaseTask {
  id: string; // Firestore DocumentID
  title: string;
  category: TaskCategory;
  description?: string;
  dueDate: Timestamp;
  completed: boolean;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  completionData?: CompletionData;
  userId: string;
}

export interface Goal {
  targetScore: number;
  examDate: string | null; // ISO format date string (YYYY-MM-DD) or null if not set
}

// Firebase用の目標設定型
export interface FirebaseGoal {
  targetScore: number;
  examDate: Timestamp | null;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CompletionData {
  time: number;      // 学習時間（分）
  difficulty: string; // 難易度
  focus: string;     // 集中度
}

// タスクカテゴリーの型定義
export type TaskCategory = 'reading' | 'listening' | 'grammar' | 'vocabulary' | 'mock-test' | 'other';

// 認証関連の型
export interface AuthUser {
  uid: string;
  email?: string;
  isAnonymous: boolean;
}
