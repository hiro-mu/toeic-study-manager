import { Task } from '@/types';

/**
 * タスクの完了率を計算する
 */
export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed);
  return Math.round((completedTasks.length / tasks.length) * 100);
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
