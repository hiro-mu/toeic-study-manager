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
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id);
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

  test('タスク完了時に完了モーダルが表示されること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    expect(screen.getByText('タスク完了')).toBeInTheDocument();
    expect(screen.getByText('学習時間を入力してください')).toBeInTheDocument();
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

    const timeInput = screen.getByLabelText('学習時間（分）');
    fireEvent.change(timeInput, { target: { value: '30' } });

    expect(timeInput).toHaveValue('30');
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

    const timeInput = screen.getByLabelText('学習時間（分）');
    fireEvent.change(timeInput, { target: { value: 'abc' } });

    expect(screen.getByText('数値を入力してください')).toBeInTheDocument();
  });
});
