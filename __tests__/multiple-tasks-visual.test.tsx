import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from '@/components/Calendar';
import { Task } from '@/types';
import { mockTask } from './utils';

describe('複数タスクの視覚的表示機能', () => {
  const today = new Date('2025-08-13');

  test('1つのタスクがある日付に小さな青いドットが表示されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const dotIndicator = day13Cell?.querySelector('.w-2.h-2.bg-blue-500.rounded-full');
    
    expect(dotIndicator).toBeInTheDocument();
  });

  test('2-3個のタスクがある日付に複数の小さなドットが表示されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false },
      { ...mockTask, id: 2, dueDate: '2025-08-13', completed: true },
      { ...mockTask, id: 3, dueDate: '2025-08-13', completed: false }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const dotIndicators = day13Cell?.querySelectorAll('.w-1\\.5.h-1\\.5.bg-blue-500.rounded-full');
    
    expect(dotIndicators).toHaveLength(3);
  });

  test('4個以上のタスクがある日付に数字付きの赤いバッジが表示されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false },
      { ...mockTask, id: 2, dueDate: '2025-08-13', completed: true },
      { ...mockTask, id: 3, dueDate: '2025-08-13', completed: false },
      { ...mockTask, id: 4, dueDate: '2025-08-13', completed: true },
      { ...mockTask, id: 5, dueDate: '2025-08-13', completed: false }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const badge = day13Cell?.querySelector('.bg-red-500.text-white.text-xs.rounded-full');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  test('9個を超えるタスクがある日付に「9+」が表示されることを確認', () => {
    const tasks: Task[] = Array.from({ length: 12 }, (_, i) => ({
      ...mockTask,
      id: i + 1,
      dueDate: '2025-08-13',
      completed: i % 2 === 0
    }));

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const badge = day13Cell?.querySelector('.bg-red-500.text-white.text-xs.rounded-full');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('9+');
  });

  test('タスクがない日付にインジケーターが表示されないことを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-14', completed: false }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const indicators = day13Cell?.querySelectorAll('.w-2, .w-1\\.5, .bg-red-500');
    
    expect(indicators).toHaveLength(0);
  });

  test('異なる日付に異なる数のタスクがある場合、それぞれ正しく表示されることを確認', () => {
    const tasks: Task[] = [
      // 13日: 1タスク
      { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false },
      // 14日: 3タスク
      { ...mockTask, id: 2, dueDate: '2025-08-14', completed: false },
      { ...mockTask, id: 3, dueDate: '2025-08-14', completed: true },
      { ...mockTask, id: 4, dueDate: '2025-08-14', completed: false },
      // 15日: 5タスク
      { ...mockTask, id: 5, dueDate: '2025-08-15', completed: false },
      { ...mockTask, id: 6, dueDate: '2025-08-15', completed: true },
      { ...mockTask, id: 7, dueDate: '2025-08-15', completed: false },
      { ...mockTask, id: 8, dueDate: '2025-08-15', completed: true },
      { ...mockTask, id: 9, dueDate: '2025-08-15', completed: false }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    // 13日: 1つのドット
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const day13Dot = day13Cell?.querySelector('.w-2.h-2.bg-blue-500.rounded-full');
    expect(day13Dot).toBeInTheDocument();

    // 14日: 3つのドット
    const day14Cell = screen.getByText('14').closest('div[class*="p-2"]');
    const day14Dots = day14Cell?.querySelectorAll('.w-1\\.5.h-1\\.5.bg-blue-500.rounded-full');
    expect(day14Dots).toHaveLength(3);

    // 15日: 数字バッジ「5」
    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    const day15Badge = day15Cell?.querySelector('.bg-red-500.text-white.text-xs.rounded-full');
    expect(day15Badge).toBeInTheDocument();
    expect(day15Badge).toHaveTextContent('5');
  });

  test('完了済みと未完了のタスクが混在している場合も正しくカウントされることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-13', completed: false },
      { ...mockTask, id: 2, dueDate: '2025-08-13', completed: true },
      { ...mockTask, id: 3, dueDate: '2025-08-13', completed: false },
      { ...mockTask, id: 4, dueDate: '2025-08-13', completed: true }
    ];

    render(<Calendar tasks={tasks} currentDate={today} />);

    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    const badge = day13Cell?.querySelector('.bg-red-500.text-white.text-xs.rounded-full');
    
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('4');
  });

  test('カレンダーの凡例にタスク数インジケーターの説明が表示されることを確認', () => {
    const tasks: Task[] = [];

    render(<Calendar tasks={tasks} currentDate={today} />);

    expect(screen.getByText('1タスク')).toBeInTheDocument();
    expect(screen.getByText('2-3タスク')).toBeInTheDocument();
    expect(screen.getByText('4+タスク')).toBeInTheDocument();
  });

  test('試験日とタスクインジケーターが同じ日にある場合、両方が表示されることを確認', () => {
    const tasks: Task[] = [
      { ...mockTask, id: 1, dueDate: '2025-08-15', completed: false },
      { ...mockTask, id: 2, dueDate: '2025-08-15', completed: true }
    ];

    const goals = {
      targetScore: 800,
      examDate: '2025-08-15'
    };

    render(<Calendar tasks={tasks} currentDate={today} goals={goals} />);

    const day15Cell = screen.getByText('15').closest('div[class*="p-2"]');
    
    // 試験日の表示
    expect(day15Cell).toHaveClass('exam-date');
    expect(day15Cell).toHaveClass('bg-red-500');
    
    // 試験日マーカー（黄色いドット）
    const examMarker = day15Cell?.querySelector('.bg-yellow-400.rounded-full');
    expect(examMarker).toBeInTheDocument();
    
    // タスクインジケーターは試験日の場合は表示されない（仕様通り）
    const taskIndicators = day15Cell?.querySelectorAll('.w-1\\.5.h-1\\.5.bg-blue-500.rounded-full');
    expect(taskIndicators).toHaveLength(0);
  });
});