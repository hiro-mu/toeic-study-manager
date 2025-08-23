import Calendar from '@/components/Calendar';
import TaskList from '@/components/TaskList';
import { Task } from '@/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTask } from './utils';

describe('タスク完了機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockTasks: Task[] = [mockTask];

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  test('タスク完了時に完了状態が正しく更新されること', () => {
    const initialTask = { ...mockTask, completed: false };
    const completedTask = { ...mockTask, completed: true };
    const tasks = [initialTask];

    const { rerender } = render(
      <TaskList
        tasks={tasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    // モーダルで学習時間を入力
    const timeInput = screen.getByLabelText('所要時間（分）:');
    fireEvent.change(timeInput, { target: { value: '30' } });

    // 完了ボタンをクリック
    const modalCompleteButton = screen.getByText('完了記録');
    fireEvent.click(modalCompleteButton);

    // タスクの完了処理が正しい引数で呼ばれることを確認
    expect(mockOnComplete).toHaveBeenCalledWith(initialTask.id, { "difficulty": "normal", "focus": "normal", "time": 30 });

    // モーダルが閉じられることを確認
    expect(screen.queryByText('タスク完了')).not.toBeInTheDocument();

    // タスクが完了状態に更新されたことを確認
    rerender(
      <TaskList
        tasks={[completedTask]}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    // 完了状態のタスクが正しく表示されることを確認
    expect(screen.queryByRole('button', { name: '完了' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '完了記録' })).not.toBeInTheDocument();
    expect(screen.getByText(completedTask.title)).toBeInTheDocument();
  });

  test('完了したタスクが未完了リストから削除されること', () => {
    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    // 完了後のタスクリストを再レンダリング
    rerender(
      <TaskList
        tasks={[]}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    expect(screen.queryByText(mockTask.title)).not.toBeInTheDocument();
  });

  test('完了モーダルで学習時間が入力できること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    const timeInput = screen.getByLabelText('所要時間（分）:');
    fireEvent.change(timeInput, { target: { value: '30' } });

    expect(timeInput).toHaveValue(30);
  });

  test('学習時間に数値以外を入力した場合のバリデーション', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    const timeInput = screen.getByLabelText('所要時間（分）:');
    fireEvent.change(timeInput, { target: { value: 'abc' } });

    const modalCompleteButton = screen.getByText('完了記録');
    fireEvent.click(modalCompleteButton);

    expect(screen.getByRole('alert')).toHaveTextContent('所要時間を正しく入力してください');
  });

  // カレンダー経由のタスク完了テスト
  test('カレンダーモーダルからタスク完了ができることを確認', async () => {
    const testTasks: Task[] = [
      { ...mockTask, id: '1', dueDate: '2025-08-13', completed: false }
    ];

    render(
      <Calendar
        tasks={testTasks}
        currentDate={new Date('2025-08-13')}
        onCompleteTask={mockOnComplete}
        onEditTask={mockOnEdit}
        onDeleteTask={mockOnDelete}
      />
    );

    // カレンダーの日付をクリック
    const day13Cell = screen.getByText('13').closest('div[class*="p-2"]');
    fireEvent.click(day13Cell!);

    // TaskModalが開いていることを確認
    expect(screen.getByText('2025年8月13日のタスク')).toBeInTheDocument();

    // 完了ボタンをクリック
    const completeButton = screen.getByTitle('完了にする');
    fireEvent.click(completeButton);

    // 完了モーダルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('タスク完了記録')).toBeInTheDocument();
    });

    // 学習時間を入力
    const timeInput = screen.getByLabelText('所要時間（分）:');
    fireEvent.change(timeInput, { target: { value: '45' } });

    // 完了記録ボタンをクリック
    const recordButton = screen.getByText('完了記録');
    fireEvent.click(recordButton);

    // コールバックが正しく呼ばれることを確認
    expect(mockOnComplete).toHaveBeenCalledWith('1', {
      time: 45,
      difficulty: 'normal',
      focus: 'normal'
    });
  });
});
