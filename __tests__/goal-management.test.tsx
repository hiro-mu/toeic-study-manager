import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '@/components/TaskForm';
import { mockGoal, clearLocalStorage, setLocalStorageItem } from './utils';

describe('目標設定・管理機能', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  test('目標スコアが正しく設定されること', () => {
    render(<TaskForm />);
    const scoreInput = screen.getByLabelText('目標スコア');
    fireEvent.change(scoreInput, { target: { value: '800' } });
    expect(scoreInput).toHaveValue('800');
  });

  test('目標スコアに数値以外を入力した場合のバリデーション', () => {
    render(<TaskForm />);
    const scoreInput = screen.getByLabelText('目標スコア');
    fireEvent.change(scoreInput, { target: { value: 'abc' } });
    expect(screen.getByText('数値を入力してください')).toBeInTheDocument();
  });

  test('試験日が正しく設定されることを確認', () => {
    render(<TaskForm />);
    const dateInput = screen.getByLabelText('試験日');
    const futureDate = '2025-12-31';
    fireEvent.change(dateInput, { target: { value: futureDate } });
    expect(dateInput).toHaveValue(futureDate);
  });

  test('過去の日付を試験日に設定した場合の処理', () => {
    render(<TaskForm />);
    const dateInput = screen.getByLabelText('試験日');
    const pastDate = '2023-01-01';
    fireEvent.change(dateInput, { target: { value: pastDate } });
    expect(screen.getByText('過去の日付は設定できません')).toBeInTheDocument();
  });

  test('目標更新時にローカルストレージに正しく保存されることを確認', () => {
    render(<TaskForm />);
    const scoreInput = screen.getByLabelText('目標スコア');
    const dateInput = screen.getByLabelText('試験日');
    const saveButton = screen.getByText('保存');

    fireEvent.change(scoreInput, { target: { value: '800' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
    fireEvent.click(saveButton);

    const savedGoal = JSON.parse(localStorage.getItem('goal') || '{}');
    expect(savedGoal).toEqual({
      targetScore: 800,
      examDate: '2025-12-31'
    });
  });

  test('目標データの初期値が正しく読み込まれることを確認', () => {
    setLocalStorageItem('goal', mockGoal);
    render(<TaskForm />);

    const scoreInput = screen.getByLabelText('目標スコア');
    const dateInput = screen.getByLabelText('試験日');

    expect(scoreInput).toHaveValue('800');
    expect(dateInput).toHaveValue('2025-12-31');
  });
});
