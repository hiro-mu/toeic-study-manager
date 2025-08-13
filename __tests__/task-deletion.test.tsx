import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '@/components/TaskList';
import { mockTask } from './utils';
import { Task } from '@/types';

describe('タスク削除機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockTasks: Task[] = [mockTask];

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
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

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  test('削除確認ダイアログが表示されること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    expect(screen.getByText('タスクを削除しますか？')).toBeInTheDocument();
    expect(screen.getByText('この操作は取り消せません')).toBeInTheDocument();
  });

  test('削除確認ダイアログでキャンセルを選択した場合、タスクが削除されないこと', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
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

    const confirmButton = screen.getByText('削除する');
    fireEvent.click(confirmButton);

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
