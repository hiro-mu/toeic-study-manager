import { Task, TaskCategory } from '@/types';
import { calculateCategoryStats, calculateDaysLeft, calculateProgress, calculateRequiredTasksPerDay, calculateTotalStudyTime } from '@/utils/statistics';
import { mockTask } from './utils';

describe('統計計算機能', () => {
  test('完了率が正しく計算されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', completed: false },
      { ...mockTask, id: '2', completed: true },
      { ...mockTask, id: '3', completed: true },
      { ...mockTask, id: '4', completed: false }
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
      { ...mockTask, id: '1', completed: false },
      { ...mockTask, id: '2', completed: false },
      { ...mockTask, id: '3', completed: false },
      { ...mockTask, id: '4', completed: false }
    ];
    const daysLeft = 10;

    const tasksPerDay = calculateRequiredTasksPerDay(tasks, daysLeft);
    expect(tasksPerDay).toBe(0.4); // 4/10 = 0.4
  });

  test('総学習時間が正しく集計されることを確認', () => {
    const completedTasks: Task[] = [
      {
        ...mockTask,
        id: '1',
        completed: true,
        completionData: { time: 30, difficulty: 'medium', focus: 'high' }
      },
      {
        ...mockTask,
        id: '2',
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
        id: '1',
        completed: true,
        completionData: { time: 30, difficulty: 'medium', focus: 'high' }
      },
      {
        ...mockTask,
        id: '2',
        completed: true
      }
    ];

    const totalTime = calculateTotalStudyTime(completedTasks);
    expect(totalTime).toBe(30); // 完了データがないタスクは0として扱う
  });
});

describe('カテゴリ別進捗計算機能', () => {
  test('各カテゴリの進捗が正しく計算されることを確認', () => {
    const tasks: Task[] = [
      // リーディング: 2完了/3総計 = 67%
      { ...mockTask, id: '1', category: 'reading', completed: true },
      { ...mockTask, id: '2', category: 'reading', completed: true },
      { ...mockTask, id: '3', category: 'reading', completed: false },
      // リスニング: 1完了/2総計 = 50%
      { ...mockTask, id: '4', category: 'listening', completed: true },
      { ...mockTask, id: '5', category: 'listening', completed: false },
      // 文法: 0完了/1総計 = 0%
      { ...mockTask, id: '6', category: 'grammar', completed: false },
      // 単語: 1完了/1総計 = 100%
      { ...mockTask, id: '7', category: 'vocabulary', completed: true }
      // mock-test, other: 0完了/0総計 = 0%
    ];

    const categoryStats = calculateCategoryStats(tasks);

    // 結果の検証
    expect(categoryStats).toHaveLength(6);

    const readingStats = categoryStats.find(stat => stat.category === 'reading');
    expect(readingStats).toEqual({
      category: 'reading',
      completed: 2,
      total: 3,
      percentage: 67
    });

    const listeningStats = categoryStats.find(stat => stat.category === 'listening');
    expect(listeningStats).toEqual({
      category: 'listening',
      completed: 1,
      total: 2,
      percentage: 50
    });

    const grammarStats = categoryStats.find(stat => stat.category === 'grammar');
    expect(grammarStats).toEqual({
      category: 'grammar',
      completed: 0,
      total: 1,
      percentage: 0
    });

    const vocabularyStats = categoryStats.find(stat => stat.category === 'vocabulary');
    expect(vocabularyStats).toEqual({
      category: 'vocabulary',
      completed: 1,
      total: 1,
      percentage: 100
    });

    const mockTestStats = categoryStats.find(stat => stat.category === 'mock-test');
    expect(mockTestStats).toEqual({
      category: 'mock-test',
      completed: 0,
      total: 0,
      percentage: 0
    });

    const otherStats = categoryStats.find(stat => stat.category === 'other');
    expect(otherStats).toEqual({
      category: 'other',
      completed: 0,
      total: 0,
      percentage: 0
    });
  });

  test('空のタスク配列でカテゴリ統計を計算', () => {
    const categoryStats = calculateCategoryStats([]);

    expect(categoryStats).toHaveLength(6);
    categoryStats.forEach(stat => {
      expect(stat.completed).toBe(0);
      expect(stat.total).toBe(0);
      expect(stat.percentage).toBe(0);
    });
  });

  test('単一カテゴリのみのタスクでカテゴリ統計を計算', () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', category: 'reading', completed: true },
      { ...mockTask, id: '2', category: 'reading', completed: false },
      { ...mockTask, id: '3', category: 'reading', completed: true }
    ];

    const categoryStats = calculateCategoryStats(tasks);
    const readingStats = categoryStats.find(stat => stat.category === 'reading');

    expect(readingStats).toEqual({
      category: 'reading',
      completed: 2,
      total: 3,
      percentage: 67
    });

    // 他のカテゴリは全て0になるはず
    const otherCategories = categoryStats.filter(stat => stat.category !== 'reading');
    otherCategories.forEach(stat => {
      expect(stat.completed).toBe(0);
      expect(stat.total).toBe(0);
      expect(stat.percentage).toBe(0);
    });
  });

  test('全てのタスクが完了している場合のカテゴリ統計', () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', category: 'reading', completed: true },
      { ...mockTask, id: '2', category: 'listening', completed: true },
      { ...mockTask, id: '3', category: 'grammar', completed: true }
    ];

    const categoryStats = calculateCategoryStats(tasks);

    const readingStats = categoryStats.find(stat => stat.category === 'reading');
    expect(readingStats?.percentage).toBe(100);

    const listeningStats = categoryStats.find(stat => stat.category === 'listening');
    expect(listeningStats?.percentage).toBe(100);

    const grammarStats = categoryStats.find(stat => stat.category === 'grammar');
    expect(grammarStats?.percentage).toBe(100);
  });

  test('全てのタスクが未完了の場合のカテゴリ統計', () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', category: 'reading', completed: false },
      { ...mockTask, id: '2', category: 'listening', completed: false },
      { ...mockTask, id: '3', category: 'vocabulary', completed: false }
    ];

    const categoryStats = calculateCategoryStats(tasks);

    const readingStats = categoryStats.find(stat => stat.category === 'reading');
    expect(readingStats?.percentage).toBe(0);

    const listeningStats = categoryStats.find(stat => stat.category === 'listening');
    expect(listeningStats?.percentage).toBe(0);

    const vocabularyStats = categoryStats.find(stat => stat.category === 'vocabulary');
    expect(vocabularyStats?.percentage).toBe(0);
  });

  test('パーセンテージが正しく四捨五入されることを確認', () => {
    const tasks: Task[] = [
      // リーディング: 1完了/3総計 = 33.33... → 33%
      { ...mockTask, id: '1', category: 'reading', completed: true },
      { ...mockTask, id: '2', category: 'reading', completed: false },
      { ...mockTask, id: '3', category: 'reading', completed: false }
    ];

    const categoryStats = calculateCategoryStats(tasks);
    const readingStats = categoryStats.find(stat => stat.category === 'reading');

    expect(readingStats?.percentage).toBe(33);
  });

  test('大量のタスクでカテゴリ統計が正しく計算されることを確認', () => {
    // 各カテゴリに50個ずつタスクを作成（計300個）
    const tasks: Task[] = [];
    const categories: TaskCategory[] = ['reading', 'listening', 'grammar', 'vocabulary', 'mock-test', 'other'];

    categories.forEach((category, categoryIndex) => {
      for (let i = 0; i < 50; i++) {
        tasks.push({
          ...mockTask,
          id: `${categoryIndex * 50 + i}`,
          category,
          completed: i < 25 // 最初の25個を完了済みに
        });
      }
    });

    const categoryStats = calculateCategoryStats(tasks);

    // 全カテゴリで25/50 = 50%になるはず
    categoryStats.forEach(stat => {
      expect(stat.completed).toBe(25);
      expect(stat.total).toBe(50);
      expect(stat.percentage).toBe(50);
    });
  });

  test('端数のパーセンテージ計算の精度確認', () => {
    const tasks: Task[] = [
      // リーディング: 2完了/7総計 = 28.57... → 29%
      { ...mockTask, id: '1', category: 'reading', completed: true },
      { ...mockTask, id: '2', category: 'reading', completed: true },
      { ...mockTask, id: '3', category: 'reading', completed: false },
      { ...mockTask, id: '4', category: 'reading', completed: false },
      { ...mockTask, id: '5', category: 'reading', completed: false },
      { ...mockTask, id: '6', category: 'reading', completed: false },
      { ...mockTask, id: '7', category: 'reading', completed: false }
    ];

    const categoryStats = calculateCategoryStats(tasks);
    const readingStats = categoryStats.find(stat => stat.category === 'reading');

    expect(readingStats?.percentage).toBe(29); // Math.round(28.57) = 29
  });

  test('カテゴリ統計の戻り値構造確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', category: 'reading', completed: true }
    ];

    const categoryStats = calculateCategoryStats(tasks);

    // 戻り値が正しい構造になっていることを確認
    expect(Array.isArray(categoryStats)).toBe(true);
    expect(categoryStats).toHaveLength(6);

    categoryStats.forEach(stat => {
      expect(stat).toHaveProperty('category');
      expect(stat).toHaveProperty('completed');
      expect(stat).toHaveProperty('total');
      expect(stat).toHaveProperty('percentage');

      expect(typeof stat.category).toBe('string');
      expect(typeof stat.completed).toBe('number');
      expect(typeof stat.total).toBe('number');
      expect(typeof stat.percentage).toBe('number');

      expect(stat.completed).toBeGreaterThanOrEqual(0);
      expect(stat.total).toBeGreaterThanOrEqual(0);
      expect(stat.percentage).toBeGreaterThanOrEqual(0);
      expect(stat.percentage).toBeLessThanOrEqual(100);
    });
  });
});
