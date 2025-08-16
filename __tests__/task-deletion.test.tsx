import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '@/components/TaskList';
import { mockTask } from './utils';
import { Task } from '@/types';

describe('タスク削除機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockTasks: Task[] = [mockTask];
  let mockConfirm: jest.SpyInstance;

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
    mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    mockConfirm.mockRestore();
  });

  test('タスクが正しく削除されることを確認', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('このタスクを削除しますか？');
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  test('削除確認ダイアログが呼び出されること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('このタスクを削除しますか？');
  });

  test('削除確認ダイアログでキャンセルを選択した場合、タスクが削除されないこと', () => {
    mockConfirm.mockReturnValueOnce(false);

    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('このタスクを削除しますか？');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('削除後にタスクがリストから削除されることを確認', () => {
    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('このタスクを削除しますか？');
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);

    // 削除後のタスクリストを再レンダリング
    rerender(
      <TaskList
        tasks={[]}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    expect(screen.queryByText(mockTask.title)).not.toBeInTheDocument();
  });
});
