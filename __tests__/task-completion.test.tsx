import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '@/components/TaskList';
import { mockTask } from './utils';
import { Task } from '@/types';

describe('タスク完了機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockTasks: Task[] = [mockTask];

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
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
});
