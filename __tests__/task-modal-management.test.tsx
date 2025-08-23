import TaskModal from '@/components/TaskModal';
import { Task } from '@/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTask } from './utils';

// モックコンポーネント
jest.mock('@/components/CompletionModal', () => ({
  CompletionModal: ({ isOpen, onClose, onComplete }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="completion-modal">
        <button onClick={() => onComplete({ time: 30, difficulty: '普通', focus: '良い' })}>
          完了記録を保存
        </button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    );
  }
}));

jest.mock('@/components/TaskEditModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onSave, task }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="edit-modal">
        <button onClick={() => onSave(task.id, {
          title: '編集されたタスク',
          category: 'reading',
          description: '編集された説明',
          dueDate: '2025-08-13'
        })}>
          保存
        </button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    );
  }
}));

jest.mock('@/components/DeleteConfirmModal', () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm, onCancel }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-modal">
        <button onClick={onConfirm}>削除確認</button>
        <button onClick={onCancel}>キャンセル</button>
      </div>
    );
  }
}));

describe('TaskModal - タスク管理機能', () => {
  const mockTasks: Task[] = [
    {
      ...mockTask,
      id: '1',
      title: '英単語学習',
      description: 'TOEIC頻出単語100個',
      category: 'vocabulary',
      dueDate: '2025-08-13',
      completed: false
    },
    {
      ...mockTask,
      id: '2',
      title: 'リスニング練習',
      description: 'Part 2 練習問題',
      category: 'listening',
      dueDate: '2025-08-13',
      completed: true,
      completionData: {
        time: 45,
        difficulty: '難しい',
        focus: '普通'
      }
    }
  ];

  const mockHandlers = {
    onClose: jest.fn(),
    onCompleteTask: jest.fn(),
    onEditTask: jest.fn(),
    onDeleteTask: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TaskModalが正しく表示されることを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('2025年8月13日のタスク')).toBeInTheDocument();
    expect(screen.getByText('英単語学習')).toBeInTheDocument();
    expect(screen.getByText('リスニング練習')).toBeInTheDocument();
  });

  test('未完了タスクに完了ボタンが表示されることを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const uncompletedTaskCard = screen.getByText('英単語学習').closest('div[class*="p-4"]');
    const completeButton = uncompletedTaskCard?.querySelector('button[title="完了にする"]');

    expect(completeButton).toBeInTheDocument();
    expect(completeButton).toHaveTextContent('✅');
  });

  test('完了済みタスクに完了ボタンが表示されないことを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const completedTaskCard = screen.getByText('リスニング練習').closest('div[class*="p-4"]');
    const completeButton = completedTaskCard?.querySelector('button[title="完了にする"]');

    expect(completeButton).not.toBeInTheDocument();
  });

  test('すべてのタスクに編集と削除ボタンが表示されることを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const editButtons = screen.getAllByTitle('編集');
    const deleteButtons = screen.getAllByTitle('削除');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);

    editButtons.forEach(button => expect(button).toHaveTextContent('✏️'));
    deleteButtons.forEach(button => expect(button).toHaveTextContent('🗑️'));
  });

  test('完了ボタンをクリックすると完了モーダルが表示されることを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const completeButton = screen.getByTitle('完了にする');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId('completion-modal')).toBeInTheDocument();
    });
  });

  test('編集ボタンをクリックすると編集モーダルが表示されることを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const editButtons = screen.getAllByTitle('編集');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });
  });

  test('削除ボタンをクリックすると削除確認モーダルが表示されることを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const deleteButtons = screen.getAllByTitle('削除');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });
  });

  test('タスク完了処理が正しく動作することを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const completeButton = screen.getByTitle('完了にする');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByTestId('completion-modal')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('完了記録を保存');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockHandlers.onCompleteTask).toHaveBeenCalledWith('1', {
        time: 30,
        difficulty: '普通',
        focus: '良い'
      });
    });
  });

  test('タスク編集処理が正しく動作することを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const editButtons = screen.getAllByTitle('編集');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockHandlers.onEditTask).toHaveBeenCalledWith('1', {
        title: '編集されたタスク',
        category: 'reading',
        description: '編集された説明',
        dueDate: '2025-08-13'
      });
    });
  });

  test('タスク削除処理が正しく動作することを確認', async () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const deleteButtons = screen.getAllByTitle('削除');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('削除確認');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockHandlers.onDeleteTask).toHaveBeenCalledWith('1');
    });
  });

  test('完了データが正しく表示されることを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('学習時間: 45分')).toBeInTheDocument();
    expect(screen.getByText('難易度: 難しい')).toBeInTheDocument();
    expect(screen.getByText('集中度: 普通')).toBeInTheDocument();
  });

  test('タスクがない場合のメッセージが表示されることを確認', () => {
    render(
      <TaskModal
        tasks={[]}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('この日にはタスクがありません')).toBeInTheDocument();
  });

  test('モーダルの閉じるボタンが動作することを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        {...mockHandlers}
      />
    );

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  test('コールバック関数が提供されていない場合、対応するボタンが表示されないことを確認', () => {
    render(
      <TaskModal
        tasks={mockTasks}
        date="2025-08-13"
        onClose={mockHandlers.onClose}
        // コールバック関数を提供しない
      />
    );

    expect(screen.queryByTitle('完了にする')).not.toBeInTheDocument();
    expect(screen.queryByTitle('編集')).not.toBeInTheDocument();
    expect(screen.queryByTitle('削除')).not.toBeInTheDocument();
  });
});
