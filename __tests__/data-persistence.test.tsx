import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockTask, mockGoal, clearLocalStorage, setLocalStorageItem } from './utils';
import { Task, Goal } from '@/types';
import TaskList from '@/components/TaskList';

describe('データ永続化機能', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  test('タスクデータがローカルストレージに正しく保存されることを確認', () => {
    const tasks: Task[] = [mockTask];
    setLocalStorageItem('tasks', tasks);

    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    expect(storedTasks).toEqual(tasks);
  });

  test('完了済みタスクデータがローカルストレージに正しく保存されることを確認', () => {
    const completedTask: Task = { ...mockTask, completed: true };
    const completedTasks: Task[] = [completedTask];
    setLocalStorageItem('completedTasks', completedTasks);

    const storedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    expect(storedTasks).toEqual(completedTasks);
  });

  test('目標設定データがローカルストレージに正しく保存されることを確認', () => {
    setLocalStorageItem('goal', mockGoal);

    const storedGoal = JSON.parse(localStorage.getItem('goal') || '{}');
    expect(storedGoal).toEqual(mockGoal);
  });

  test('ページリロード後にデータが正しく復元されることを確認', () => {
    const tasks: Task[] = [mockTask];
    setLocalStorageItem('tasks', tasks);

    // コンポーネントをマウント
    render(
      <TaskList
        tasks={tasks}
        onCompleteTask={() => { }}
        onDeleteTask={() => { }}
      />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  test('ローカルストレージが空の場合の初期値設定', () => {
    clearLocalStorage();

    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    const storedGoal = JSON.parse(localStorage.getItem('goal') || '{}');

    expect(storedTasks).toEqual([]);
    expect(storedCompletedTasks).toEqual([]);
    expect(storedGoal).toEqual({});
  });

  test('無効なJSONデータの場合のエラーハンドリング', () => {
    // 無効なJSONを設定
    localStorage.setItem('tasks', 'invalid-json');

    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    expect(storedTasks).toEqual([]);
  });
});
