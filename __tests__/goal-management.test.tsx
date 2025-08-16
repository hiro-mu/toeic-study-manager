import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import { clearLocalStorage } from './utils';

describe('目標設定・管理機能', () => {
  const mockOnUpdateGoals = jest.fn();
  
  const initialGoalsWithDefaults = {
    targetScore: 0,
    examDate: null as string | null
  };

  beforeEach(() => {
    clearLocalStorage();
    mockOnUpdateGoals.mockClear();
  });

  test('目標スコアが正しく変更されること', () => {
    render(<Header goals={initialGoalsWithDefaults} onUpdateGoals={mockOnUpdateGoals} />);
    const scoreInput = screen.getByLabelText('目標スコア');

    // 初期値が0であることを確認
    expect(scoreInput).toHaveValue(0);
    
    // 目標スコアを入力
    fireEvent.change(scoreInput, { target: { value: '800' } });
    
    // onUpdateGoalsが呼ばれたことを確認
    expect(mockOnUpdateGoals).toHaveBeenCalledWith({
      targetScore: 800,
      examDate: null
    });
  });

  test('試験日が正しく設定されることを確認', () => {
    render(<Header goals={initialGoalsWithDefaults} onUpdateGoals={mockOnUpdateGoals} />);
    const dateInput = screen.getByLabelText('試験日');

    // 初期値が空であることを確認
    expect(dateInput).toHaveValue('');
    
    // 試験日を入力
    const futureDate = '2025-12-31';
    fireEvent.change(dateInput, { target: { value: futureDate } });
    
    // onUpdateGoalsが呼ばれたことを確認
    expect(mockOnUpdateGoals).toHaveBeenCalledWith({
      targetScore: 0, // または null（使用するinitialGoalsによる）
      examDate: futureDate
    });
  });
});