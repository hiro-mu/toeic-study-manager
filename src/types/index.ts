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
  email: string | null;
  isAnonymous: boolean;
  emailVerified?: boolean;
  displayName?: string | null;
}

// 励ましメッセージ関連の型
export interface EncouragementMessage {
  id: string;
  text: string;
  emoji: string;
  category: EncouragementCategory;
  context: MessageContext[];
}

export type EncouragementCategory =
  | 'greeting'        // 挨拶・開始時
  | 'progress'        // 進捗達成時
  | 'motivation'      // モチベーション向上
  | 'completion'      // タスク完了時
  | 'goal'           // 目標設定時
  | 'daily'          // 日常的な励まし
  | 'challenge';     // 挑戦・難しい時

export type MessageContext =
  | 'morning'         // 朝
  | 'afternoon'       // 午後
  | 'evening'         // 夜
  | 'high_progress'   // 高い進捗率
  | 'low_progress'    // 低い進捗率
  | 'first_task'      // 初回タスク
  | 'streak'          // 連続学習
  | 'near_goal';      // 目標に近い
