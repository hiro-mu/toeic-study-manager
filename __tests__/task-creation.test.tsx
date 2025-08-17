import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '@/components/TaskForm';
import { mockGoal, clearLocalStorage, setLocalStorageItem } from './utils';

describe('タスク作成機能', () => {
  const mockOnAddTask = jest.fn();
  const mockOnAddBulkTasks = jest.fn();

  beforeEach(() => {
    clearLocalStorage();
    mockOnAddTask.mockClear();
    mockOnAddBulkTasks.mockClear();
  });

  test('必須項目（タスク名）が入力されていない場合にエラーが表示されること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
    const submitButton = screen.getByText('タスクを追加');

    fireEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent('タイトルは必須です');
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  test('必須項目がすべて入力されている場合にタスクが作成されること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);

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
    render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);

    const categorySelect = screen.getByLabelText('カテゴリー');
    fireEvent.change(categorySelect, { target: { value: 'reading' } });

    expect(categorySelect).toHaveValue('reading');
  });

  test('入力値がクリアされた状態で新しいタスクを作成できること', () => {
    render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);

    // 1つ目のタスクを作成
    fireEvent.change(screen.getByLabelText('タスク名'), {
      target: { value: 'タスク1' }
    });
    fireEvent.click(screen.getByText('タスクを追加'));

    fireEvent.change(screen.getByLabelText('カテゴリー'), {
      target: { value: 'reading' }
    });

    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2025-12-31' }
    });

    fireEvent.click(screen.getByText('タスクを追加'));

    // フォームがクリアされていることを確認
    expect(screen.getByLabelText('タスク名')).toHaveValue('');

    // 2つ目のタスクを作成できることを確認
    fireEvent.change(screen.getByLabelText('タスク名'), {
      target: { value: 'タスク2' }
    });

    fireEvent.change(screen.getByLabelText('カテゴリー'), {
      target: { value: 'reading' }
    });

    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2025-12-31' }
    });

    fireEvent.click(screen.getByText('タスクを追加'));

    expect(mockOnAddTask).toHaveBeenCalledTimes(2);
  });

  describe('一括作成機能', () => {
    test('期間タスクモードに切り替えできること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      expect(rangeRadio).toBeChecked();
      expect(screen.getByText('タスクを一括作成')).toBeInTheDocument();
      expect(screen.getByLabelText('開始日')).toBeInTheDocument();
      expect(screen.getByLabelText('終了日')).toBeInTheDocument();
    });

    test('期間タスクで必須項目が入力されていない場合にエラーが表示されること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      // 期間タスクモードに切り替え
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      // タスク名のみ入力
      fireEvent.change(screen.getByLabelText('タスク名'), {
        target: { value: '毎日の単語学習' }
      });
      
      fireEvent.click(screen.getByText('タスクを一括作成'));
      
      expect(screen.getByRole('alert')).toHaveTextContent('開始日と終了日は必須です');
      expect(mockOnAddBulkTasks).not.toHaveBeenCalled();
    });

    test('開始日が終了日より後の場合にエラーが表示されること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      // 期間タスクモードに切り替え
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      // 必須項目を入力（開始日 > 終了日）
      fireEvent.change(screen.getByLabelText('タスク名'), {
        target: { value: '毎日の単語学習' }
      });
      fireEvent.change(screen.getByLabelText('開始日'), {
        target: { value: '2025-12-31' }
      });
      fireEvent.change(screen.getByLabelText('終了日'), {
        target: { value: '2025-12-01' }
      });
      
      fireEvent.click(screen.getByText('タスクを一括作成'));
      
      expect(screen.getByRole('alert')).toHaveTextContent('開始日は終了日より前の日付を選択してください');
      expect(mockOnAddBulkTasks).not.toHaveBeenCalled();
    });

    test('期間タスクが正しく一括作成されること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      // 期間タスクモードに切り替え
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      // 必須項目を入力（3日間）
      fireEvent.change(screen.getByLabelText('タスク名'), {
        target: { value: '毎日の単語学習' }
      });
      fireEvent.change(screen.getByLabelText('カテゴリー'), {
        target: { value: 'vocabulary' }
      });
      fireEvent.change(screen.getByLabelText('開始日'), {
        target: { value: '2025-08-13' }
      });
      fireEvent.change(screen.getByLabelText('終了日'), {
        target: { value: '2025-08-15' }
      });
      fireEvent.change(screen.getByLabelText('説明（任意）'), {
        target: { value: '毎日30分の単語学習' }
      });
      
      fireEvent.click(screen.getByText('タスクを一括作成'));
      
      expect(mockOnAddBulkTasks).toHaveBeenCalledWith([
        {
          title: '毎日の単語学習',
          category: 'vocabulary',
          description: '毎日30分の単語学習',
          dueDate: '2025-08-13'
        },
        {
          title: '毎日の単語学習',
          category: 'vocabulary',
          description: '毎日30分の単語学習',
          dueDate: '2025-08-14'
        },
        {
          title: '毎日の単語学習',
          category: 'vocabulary',
          description: '毎日30分の単語学習',
          dueDate: '2025-08-15'
        }
      ]);
    });

    test('作成されるタスク数のプレビューが正しく表示されること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      // 期間タスクモードに切り替え
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      // 開始日と終了日を入力
      fireEvent.change(screen.getByLabelText('開始日'), {
        target: { value: '2025-08-13' }
      });
      fireEvent.change(screen.getByLabelText('終了日'), {
        target: { value: '2025-08-17' }
      });
      
      // プレビューが表示されることを確認（5日間 = 5個のタスク）
      expect(screen.getByText(/5個のタスクが作成されます/)).toBeInTheDocument();
    });

    test('期間タスク作成後にフォームがクリアされること', () => {
      render(<TaskForm onAddTask={mockOnAddTask} onAddBulkTasks={mockOnAddBulkTasks} />);
      
      // 期間タスクモードに切り替え
      const rangeRadio = screen.getByLabelText('期間タスク（一括作成）');
      fireEvent.click(rangeRadio);
      
      // 必須項目を入力
      fireEvent.change(screen.getByLabelText('タスク名'), {
        target: { value: '毎日の単語学習' }
      });
      fireEvent.change(screen.getByLabelText('開始日'), {
        target: { value: '2025-08-13' }
      });
      fireEvent.change(screen.getByLabelText('終了日'), {
        target: { value: '2025-08-15' }
      });
      
      fireEvent.click(screen.getByText('タスクを一括作成'));
      
      // フォームがクリアされていることを確認
      expect(screen.getByLabelText('タスク名')).toHaveValue('');
      expect(screen.getByLabelText('開始日')).toHaveValue('');
      expect(screen.getByLabelText('終了日')).toHaveValue('');
    });
  });
});
