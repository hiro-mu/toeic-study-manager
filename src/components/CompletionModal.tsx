'use client';

import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  completionData?: {
    time: number;
    difficulty: string;
    focus: string;
  };
}

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { time: number; difficulty: string; focus: string }) => void;
}

function CompletionModal({ isOpen, onClose, onComplete }: CompletionModalProps) {
  const [time, setTime] = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [focus, setFocus] = useState('normal');

  const handleComplete = () => {
    const timeNumber = parseInt(time);
    if (!timeNumber || isNaN(timeNumber)) {
      alert('所要時間を正しく入力してください');
      return;
    }

    onComplete({
      time: timeNumber,
      difficulty,
      focus,
    });

    // フォームをリセット
    setTime('');
    setDifficulty('normal');
    setFocus('normal');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">タスク完了記録</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            所要時間（分）:
          </label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min="1"
            placeholder="30"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            難易度:
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="easy">易しい</option>
            <option value="normal">普通</option>
            <option value="hard">難しい</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            集中度:
          </label>
          <select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="focused">集中できた</option>
            <option value="normal">普通</option>
            <option value="distracted">散漫だった</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            キャンセル
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-lg hover:opacity-90"
          >
            完了記録
          </button>
        </div>
      </div>
    </div>
  );
}

export { CompletionModal };
export type { Task };
