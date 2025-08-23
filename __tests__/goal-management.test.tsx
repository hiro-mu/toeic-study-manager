import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import { clearLocalStorage } from './utils';
import type { Goal } from '@/types';

describe('目標設定・管理機能', () => {
  const mockOnSaveGoals = jest.fn();

  const initialGoals: Goal = {
    targetScore: 0,
    examDate: null
  };

  beforeEach(() => {
    clearLocalStorage();
    mockOnSaveGoals.mockClear();
  });

  test('目標スコアが正しく変更されること', () => {
    render(
      <Header
        completedTasks={5}
        totalTasks={10}
        completionRate={50}
        goals={initialGoals}
        onSaveGoals={mockOnSaveGoals}
      />
    );
    const scoreInput = screen.getByLabelText('目標スコア');

    // 初期値が空であることを確認（targetScore=0の場合、|| '' により空文字列になる）
    expect(scoreInput).toHaveValue(null);

    // 目標スコアを入力
    fireEvent.change(scoreInput, { target: { value: '800' } });

    // onSaveGoalsが呼ばれたことを確認
    expect(mockOnSaveGoals).toHaveBeenCalledWith({
      targetScore: 800,
      examDate: null
    });
  });

  test('試験日が正しく設定されることを確認', () => {
    render(
      <Header
        completedTasks={5}
        totalTasks={10}
        completionRate={50}
        goals={initialGoals}
        onSaveGoals={mockOnSaveGoals}
      />
    );
    const dateInput = screen.getByLabelText('試験日');

    // 初期値が空であることを確認
    expect(dateInput).toHaveValue('');

    // 試験日を入力
    const futureDate = '2025-12-31';
    fireEvent.change(dateInput, { target: { value: futureDate } });

    // onSaveGoalsが呼ばれたことを確認
    expect(mockOnSaveGoals).toHaveBeenCalledWith({
      targetScore: 0,
      examDate: futureDate
    });
  });
});