import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '@/components/TaskList';
import TaskEditModal from '@/components/TaskEditModal';
import { mockTask } from './utils';
import { Task } from '@/types';

describe('タスク編集機能', () => {
  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockTasks: Task[] = [mockTask];

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  test('編集ボタンをクリックするとタスク編集モーダルが表示されること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    expect(screen.getByText('タスクを編集')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.dueDate)).toBeInTheDocument();
  });

  test('タスクタイトルをクリックしても編集モーダルが表示されること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const taskTitle = screen.getByText(mockTask.title);
    fireEvent.click(taskTitle);

    expect(screen.getByText('タスクを編集')).toBeInTheDocument();
  });

  test('編集モーダルで値を変更して保存できること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // タスク名を変更
    const titleInput = screen.getByDisplayValue(mockTask.title);
    fireEvent.change(titleInput, { target: { value: '編集されたタスク' } });

    // カテゴリーを変更
    const categorySelect = screen.getByDisplayValue('reading');
    fireEvent.change(categorySelect, { target: { value: 'listening' } });

    // 期限を変更
    const dueDateInput = screen.getByDisplayValue(mockTask.dueDate);
    fireEvent.change(dueDateInput, { target: { value: '2025-12-31' } });

    // 説明を追加
    const descriptionInput = screen.getByPlaceholderText('説明を入力（任意）');
    fireEvent.change(descriptionInput, { target: { value: '編集された説明' } });

    // 保存ボタンをクリック
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // onEditTaskが正しい引数で呼ばれることを確認
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask.id, {
      title: '編集されたタスク',
      category: 'listening',
      description: '編集された説明',
      dueDate: '2025-12-31'
    });

    // モーダルが閉じられることを確認
    expect(screen.queryByText('タスクを編集')).not.toBeInTheDocument();
  });

  test('編集モーダルでキャンセルボタンをクリックするとモーダルが閉じること', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('タスクを編集')).not.toBeInTheDocument();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('タスク名が空の場合にエラーが表示されること', () => {
    render(
      <TaskEditModal
        isOpen={true}
        task={mockTask}
        onClose={jest.fn()}
        onSave={mockOnEdit}
      />
    );

    const titleInput = screen.getByDisplayValue(mockTask.title);
    fireEvent.change(titleInput, { target: { value: '' } });

    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    expect(screen.getByRole('alert')).toHaveTextContent('タイトルは必須です');
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('期限が空の場合にエラーが表示されること', () => {
    render(
      <TaskEditModal
        isOpen={true}
        task={mockTask}
        onClose={jest.fn()}
        onSave={mockOnEdit}
      />
    );

    const dueDateInput = screen.getByDisplayValue(mockTask.dueDate);
    fireEvent.change(dueDateInput, { target: { value: '' } });

    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    expect(screen.getByRole('alert')).toHaveTextContent('期限は必須です');
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('編集後にタスクリストが更新されること', () => {
    const updatedTask = {
      ...mockTask,
      title: '編集されたタスク',
      category: 'listening',
      description: '編集された説明',
      dueDate: '2025-12-31'
    };

    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    // 編集後のタスクリストを再レンダリング
    rerender(
      <TaskList
        tasks={[updatedTask]}
        onCompleteTask={mockOnComplete}
        onDeleteTask={mockOnDelete}
        onEditTask={mockOnEdit}
      />
    );

    expect(screen.getByText('編集されたタスク')).toBeInTheDocument();
    expect(screen.queryByText(mockTask.title)).not.toBeInTheDocument();
  });
});