import Calendar from '@/components/Calendar';
import { Task } from '@/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTask } from './utils';

// 実際のTaskModalを使用した統合テスト
describe('カレンダー - TaskModal統合テスト', () => {
  const today = new Date('2025-08-13');
  const tasks: Task[] = [
    {
      ...mockTask,
      id: '1',
      title: '英単語学習',
      description: 'TOEIC頻出単語100個',
      category: 'vocabulary',
      dueDate: '2025-08-13',
      completed: false
    },
    {
      ...mockTask,
      id: '2',
      title: 'リスニング練習',
      description: 'Part 2 練習問題',
      category: 'listening',
      dueDate: '2025-08-13',
      completed: true,
      completionData: {
        time: 45,
        difficulty: '難しい',
        focus: '普通'
      }
    }
  ];

  const mockHandlers = {
    onCompleteTask: jest.fn(),
    onEditTask: jest.fn(),
    onDeleteTask: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('カレンダーからTaskModalを開いてタスク管理機能にアクセスできることを確認', async () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // TaskModalが開いていることを確認
    expect(screen.getByText('2025年8月13日のタスク')).toBeInTheDocument();

    // タスクが表示されていることを確認
    expect(screen.getByText('英単語学習')).toBeInTheDocument();
    expect(screen.getByText('リスニング練習')).toBeInTheDocument();

    // タスク管理ボタンが表示されていることを確認
    expect(screen.getByTitle('完了にする')).toBeInTheDocument(); // 未完了タスクのみ
    expect(screen.getAllByTitle('編集')).toHaveLength(2);
    expect(screen.getAllByTitle('削除')).toHaveLength(2);
  });

  test('カレンダーからタスクを直接完了できることを確認', async () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // 未完了タスクの完了ボタンをクリック
    const completeButton = screen.getByTitle('完了にする');
    fireEvent.click(completeButton);

    // 完了モーダルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('タスク完了記録')).toBeInTheDocument();
    });
  });

  test('カレンダーからタスクを直接編集できることを確認', async () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // 編集ボタンをクリック
    const editButtons = screen.getAllByTitle('編集');
    fireEvent.click(editButtons[0]);

    // 編集モーダルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('タスクを編集')).toBeInTheDocument();
    });
  });

  test('カレンダーからタスクを直接削除できることを確認', async () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // 削除ボタンをクリック
    const deleteButtons = screen.getAllByTitle('削除');
    fireEvent.click(deleteButtons[0]);

    // 削除確認モーダルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('タスクを削除しますか？')).toBeInTheDocument();
    });
  });

  test('完了データが詳細に表示されることを確認', () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // 完了データが表示されていることを確認
    expect(screen.getByText('学習時間: 45分')).toBeInTheDocument();
    expect(screen.getByText('難易度: 難しい')).toBeInTheDocument();
    expect(screen.getByText('集中度: 普通')).toBeInTheDocument();
  });

  test('タスクのないカレンダー日付では管理機能が利用できないことを確認', () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // タスクのない日付をクリック（15日）
    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');

    // クリックしてもモーダルが開かないことを確認
    fireEvent.click(day15Cell!);
    expect(screen.queryByText('2025年8月15日のタスク')).not.toBeInTheDocument();
  });

  test('カレンダーモーダルを閉じる機能が正しく動作することを確認', () => {
    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        {...mockHandlers}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // モーダルが開いていることを確認
    expect(screen.getByText('2025年8月13日のタスク')).toBeInTheDocument();

    // 閉じるボタンをクリック
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    // モーダルが閉じていることを確認
    expect(screen.queryByText('2025年8月13日のタスク')).not.toBeInTheDocument();
  });

  test('試験日の場合は専用モーダルが表示され、タスク管理機能は表示されないことを確認', () => {
    const goals = {
      targetScore: 800,
      examDate: '2025-08-15'
    };

    render(
      <Calendar
        tasks={tasks}
        currentDate={today}
        goals={goals}
        {...mockHandlers}
      />
    );

    // 試験日をクリック
    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    fireEvent.click(day15Cell!);

    // 試験日専用モーダルが表示されることを確認
    expect(screen.getByText(/🎯 試験日: 2025年8月15日/)).toBeInTheDocument();
    expect(screen.getByText('TOEIC試験日です！')).toBeInTheDocument();

    // タスク管理機能は表示されないことを確認
    expect(screen.queryByTitle('完了にする')).not.toBeInTheDocument();
    expect(screen.queryByTitle('編集')).not.toBeInTheDocument();
    expect(screen.queryByTitle('削除')).not.toBeInTheDocument();
  });
});
