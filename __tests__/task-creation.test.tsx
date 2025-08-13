import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '@/components/TaskForm';
import { mockGoal, clearLocalStorage, setLocalStorageItem } from './utils';

describe('タスク作成機能', () => {
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    clearLocalStorage();
    mockOnAddTask.mockClear();
  });

  test('必須項目（タスク名）が入力されていない場合にエラーが表示されること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const submitButton = screen.getByText('タスクを追加');

    fireEvent.click(submitButton);

    expect(screen.getByText('タスク名は必須です')).toBeInTheDocument();
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('必須項目がすべて入力されている場合にタスクが作成されること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    // 必須項目を入力
    fireEvent.change(screen.getByLabelText('タスク名'), {
      target: { value: 'TOEIC Part 5の練習' }
    });

    fireEvent.change(screen.getByLabelText('カテゴリー'), {
      target: { value: 'reading' }
    });

    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2025-12-31' }
    });

    fireEvent.click(screen.getByText('タスクを追加'));

    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'TOEIC Part 5の練習',
      category: 'reading',
      description: '',
      dueDate: '2025-12-31'
    });
  });

  test('カテゴリーが正しく設定されること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    const categorySelect = screen.getByLabelText('カテゴリー');
    fireEvent.change(categorySelect, { target: { value: 'reading' } });

    expect(categorySelect).toHaveValue('reading');
  });

  test('入力値がクリアされた状態で新しいタスクを作成できること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);

    // 1つ目のタスクを作成
    fireEvent.change(screen.getByLabelText('タスク名'), {
      target: { value: 'タスク1' }
    });
    fireEvent.click(screen.getByText('タスクを追加'));

    // フォームがクリアされていることを確認
    expect(screen.getByLabelText('タスク名')).toHaveValue('');

    // 2つ目のタスクを作成できることを確認
    fireEvent.change(screen.getByLabelText('タスク名'), {
      target: { value: 'タスク2' }
    });
    fireEvent.click(screen.getByText('タスクを追加'));

    expect(mockOnAddTask).toHaveBeenCalledTimes(2);
  });
});
