import { calculateProgress, calculateDaysLeft, calculateRequiredTasksPerDay, calculateTotalStudyTime } from '@/utils/statistics';
import { Task } from '@/types';
import { mockTask } from './utils';

describe('統計計算機能', () => {
  test('完了率が正しく計算されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, completed: false },
      { ...mockTask, id: 2, completed: true },
      { ...mockTask, id: 3, completed: true },
      { ...mockTask, id: 4, completed: false }
    ];

    const progress = calculateProgress(tasks);
    expect(progress).toBe(50); // 2/4 = 50%
  });

  test('総タスク数が0の場合の完了率計算', () => {
    const progress = calculateProgress([]);
    expect(progress).toBe(0);
  });

  test('残り日数が正しく計算されることを確認', () => {
    const examDate = '2025-12-31';
    const today = new Date('2025-08-13');

    const daysLeft = calculateDaysLeft(examDate, today);
    expect(daysLeft).toBe(140); // 2025/12/31 - 2025/08/13 = 140日
  });

  test('試験日が設定されていない場合の残り日数表示', () => {
    const daysLeft = calculateDaysLeft('', new Date());
    expect(daysLeft).toBe(0);
  });

  test('過去の試験日の場合の残り日数表示', () => {
    const examDate = '2023-12-31';
    const today = new Date('2025-08-13');

    const daysLeft = calculateDaysLeft(examDate, today);
    expect(daysLeft).toBe(0);
  });

  test('1日必要タスク数が正しく計算されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, completed: false },
      { ...mockTask, id: 2, completed: false },
      { ...mockTask, id: 3, completed: false },
      { ...mockTask, id: 4, completed: false }
    ];
    const daysLeft = 10;

    const tasksPerDay = calculateRequiredTasksPerDay(tasks, daysLeft);
    expect(tasksPerDay).toBe(0.4); // 4/10 = 0.4
  });

  test('総学習時間が正しく集計されることを確認', () => {
    const completedTasks: Task[] = [
      {
        ...mockTask,
        id: 1,
        completed: true,
        completionData: { time: 30, difficulty: 'medium', focus: 'high' }
      },
      {
        ...mockTask,
        id: 2,
        completed: true,
        completionData: { time: 45, difficulty: 'easy', focus: 'medium' }
      }
    ];

    const totalTime = calculateTotalStudyTime(completedTasks);
    expect(totalTime).toBe(75); // 30 + 45 = 75
  });

  test('完了データがないタスクがある場合の総学習時間計算', () => {
    const completedTasks: Task[] = [
      {
        ...mockTask,
        id: 1,
        completed: true,
        completionData: { time: 30, difficulty: 'medium', focus: 'high' }
      },
      {
        ...mockTask,
        id: 2,
        completed: true
      }
    ];

    const totalTime = calculateTotalStudyTime(completedTasks);
    expect(totalTime).toBe(30); // 完了データがないタスクは0として扱う
  });
});
