'use client';

import type { Goal } from '@/types';

interface HeaderProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  goals: Goal | null;
  onSaveGoals: (goals: Goal) => void;
}

export default function Header({ completedTasks, totalTasks, completionRate, goals, onSaveGoals }: HeaderProps) {
  const handleTargetScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoals: Goal = {
      targetScore: Number(e.target.value),
      examDate: goals?.examDate || null
    };
    onSaveGoals(newGoals);
  };

  const handleExamDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoals: Goal = {
      targetScore: goals?.targetScore || 0,
      examDate: e.target.value || null
    };
    onSaveGoals(newGoals);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mb-5">
      <h1 className="text-3xl text-center text-primary mb-5">📚 TOEIC Study Manager</h1>

      {/* 進捗表示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
          <div className="text-sm text-secondary">完了率</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-secondary">完了タスク</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{totalTasks - completedTasks}</div>
          <div className="text-sm text-secondary">残りタスク</div>
        </div>
      </div>

      {/* 目標設定 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetScore" className="block text-sm font-medium text-primary mb-1">
            目標スコア
          </label>
          <input
            id="targetScore"
            type="number"
            value={goals?.targetScore || ''}
            onChange={handleTargetScoreChange}
            placeholder="目標スコアを入力"
            className="p-3 border-2 border-gray-200 rounded-lg text-base text-primary w-full"
            step="10"
            min="0"
            max="990"
          />
        </div>
        <div>
          <label htmlFor="examDate" className="block text-sm font-medium text-primary mb-1">
            試験日
          </label>
          <input
            id="examDate"
            type="date"
            value={goals?.examDate || ''}
            onChange={handleExamDateChange}
            className="p-3 border-2 border-gray-200 rounded-lg text-base text-primary w-full"
          />
        </div>
      </div>
    </div>
  );
}