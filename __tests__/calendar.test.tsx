import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from '@/components/Calendar';
import { Task } from '@/types';
import { mockTask } from './utils';

describe('カレンダー表示機能', () => {
  const today = new Date('2025-08-13');
  const tasks: Task[] = [
    { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false },
    { ...mockTask, id: 2, dueDate: '2025-08-13', completed: true },
    { ...mockTask, id: 3, dueDate: '2025-08-14', completed: false },
  ];

  test('現在の月のカレンダーが正しく生成されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    // 月の表示を確認
    expect(screen.getByText('8月 2025')).toBeInTheDocument();

    // 日付が表示されていることを確認
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  test('タスクがある日付に正しいクラスが付与されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const day14Cell = screen.getByText('14').closest('div[class*="p-2"]');

    expect(day13Cell).toHaveClass('has-task');
    expect(day14Cell).toHaveClass('has-task');
  });

  test('完了済みタスクがある日付に正しいクラスが付与されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    expect(day13Cell).toHaveClass('has-completed-task');
  });

  test('タスクがない日付に特別なクラスが付与されないことを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    expect(day15Cell).not.toHaveClass('has-task');
    expect(day15Cell).not.toHaveClass('has-completed-task');
  });

  test('未完了と完了の両方のタスクがある日付には両方のクラスが付与されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    expect(day13Cell).toHaveClass('has-task');
    expect(day13Cell).toHaveClass('has-completed-task');
  });

  test('月の切り替えが正しく動作することを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const nextMonthButton = screen.getByText('次の月');
    const prevMonthButton = screen.getByText('前の月');

    fireEvent.click(nextMonthButton);
    expect(screen.getByText('9月 2025')).toBeInTheDocument();

    fireEvent.click(prevMonthButton);
    expect(screen.getByText('8月 2025')).toBeInTheDocument();
  });

  test('タスクのある日付をクリックするとモーダルが表示されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    expect(screen.getByText('2025年8月13日のタスク')).toBeInTheDocument();
    expect(screen.getAllByText(/完了/).length).toBeGreaterThan(0);

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(screen.queryByText('2025年8月13日のタスク')).not.toBeInTheDocument();
  });

  test('試験日が設定されている場合、カレンダー上で正しく表示されることを確認', () => {
    const goals = {
      targetScore: 800,
      examDate: '2025-08-15'
    };

    render(<Calendar tasks={tasks} currentDate={today} goals={goals} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    expect(day15Cell).toHaveClass('exam-date');
    expect(day15Cell).toHaveClass('bg-red-500');
  });

  test('試験日をクリックすると専用モーダルが表示されることを確認', () => {
    const goals = {
      targetScore: 800,
      examDate: '2025-08-15'
    };

    render(<Calendar tasks={tasks} currentDate={today} goals={goals} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    fireEvent.click(day15Cell!);

    expect(screen.getByText(/🎯 試験日: 2025年8月15日/)).toBeInTheDocument();
    expect(screen.getByText('TOEIC試験日です！')).toBeInTheDocument();
    expect(screen.getByText('目標スコア: 800点')).toBeInTheDocument();
  });

  test('試験日が設定されていない場合、特別な表示がされないことを確認', () => {
    const goals = {
      targetScore: 800,
      examDate: null
    };

    render(<Calendar tasks={tasks} currentDate={today} goals={goals} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    expect(day15Cell).not.toHaveClass('exam-date');
    expect(day15Cell).not.toHaveClass('bg-red-500');
  });

  test('カレンダーの凡例が正しく表示されることを確認', () => {
    render(<Calendar tasks={tasks} currentDate={today} />);

    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
    expect(screen.getByText('完了済みタスク')).toBeInTheDocument();
    expect(screen.getByText('試験日')).toBeInTheDocument();
  });

  test('試験日モーダルを閉じることができることを確認', () => {
    const goals = {
      targetScore: 800,
      examDate: '2025-08-15'
    };

    render(<Calendar tasks={tasks} currentDate={today} goals={goals} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    fireEvent.click(day15Cell!);

    expect(screen.getByText(/🎯 試験日/)).toBeInTheDocument();

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(screen.queryByText(/🎯 試験日/)).not.toBeInTheDocument();
  });
});
