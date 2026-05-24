'use client';

import { useAuth } from '@/hooks/useAuth';
import type { Goal } from '@/types';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  goals: Goal | null;
  onSaveGoals: (goals: Goal) => void;
}

export default function Header({ completedTasks, totalTasks, completionRate, goals, onSaveGoals }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      {/* ヘッダータイトルとユーザー情報 */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <h1 className="text-3xl text-center text-primary mb-3 sm:mb-0">📚 TOEIC Study Manager</h1>

        {/* ユーザー情報とログアウト */}
        {user && (
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-lg">👤</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow-md"
              title="ログアウト"
            >
              📤 ログアウト
            </button>
          </div>
        )}
      </div>

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
