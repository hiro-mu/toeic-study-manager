import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '@/components/TaskList';
import { mockTask } from './utils';
import { Task } from '@/types';

describe('タスク削除機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockTasks: Task[] = [mockTask];
  let mockConfirm: jest.SpyInstance;

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  test('削除ボタンをクリックしたとき、モーダルが表示され、削除するを選択した場合、タスクが正しく削除されることを確認', () => {
    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // タスクを削除しますか？の文字が表示されることを確認
    expect(screen.getByText('タスクを削除しますか？')).toBeInTheDocument();

    // 削除確認ダイアログでOKをクリック
    const confirmButton = screen.getByText('削除する');
    fireEvent.click(confirmButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);

    // 削除後のタスクリストを再レンダリング
    rerender(
      <TaskList
        tasks={[]}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    // タスクが削除されたことを確認
    expect(screen.queryByText(mockTask.title)).not.toBeInTheDocument();
  });

  test('削除ボタンをクリックしたとき、モーダルが表示され、キャンセルを選択した場合、タスクが削除されないこと', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // タスクを削除しますか？の文字が表示されることを確認
    expect(screen.getByText('タスクを削除しますか？')).toBeInTheDocument();

    // 削除確認ダイアログでOKをクリック
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);
    expect(mockOnDelete).not.toHaveBeenCalled();

    // モーダルが閉じられ、タスクがまだ表示されることを確認
    expect(screen.queryByText('タスクを削除しますか？')).not.toBeInTheDocument();
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });
});
