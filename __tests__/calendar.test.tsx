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
});
