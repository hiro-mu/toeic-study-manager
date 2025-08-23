import { Task, TaskCategory } from '@/types';

/**
 * カテゴリ別進捗統計の型定義
 */
export interface CategoryStats {
  category: TaskCategory;
  completed: number;
  total: number;
  percentage: number;
}

/**
 * タスクの完了率を計算する
 */
export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed);
  return Math.round((completedTasks.length / tasks.length) * 100);
}

/**
 * カテゴリ別の進捗統計を計算する
 */
export function calculateCategoryStats(tasks: Task[]): CategoryStats[] {
  const categories: TaskCategory[] = ['reading', 'listening', 'grammar', 'vocabulary', 'mock-test', 'other'];

  return categories.map(category => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const completed = categoryTasks.filter(task => task.completed).length;
    const total = categoryTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      category,
      completed,
      total,
      percentage
    };
  });
}

/**
 * 試験日までの残り日数を計算する
 */
export function calculateDaysLeft(examDate: string, today: Date = new Date()): number {
  if (!examDate) return 0;

  const exam = new Date(examDate);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * 1日あたりの必要タスク数を計算する
 */
export function calculateRequiredTasksPerDay(tasks: Task[], daysLeft: number): number {
  if (daysLeft === 0) return 0;
  const incompleteTasks = tasks.filter(task => !task.completed);
  return Number((incompleteTasks.length / daysLeft).toFixed(1));
}

/**
 * 総学習時間を計算する
 */
export function calculateTotalStudyTime(completedTasks: Task[]): number {
  return completedTasks.reduce((total, task) => {
    return total + (task.completionData?.time || 0);
  }, 0);
}
