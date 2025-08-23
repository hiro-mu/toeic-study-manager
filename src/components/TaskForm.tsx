'use client';

import { useState } from 'react';
import type { TaskCategory } from '@/types';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => void;
  onAddBulkTasks: (tasks: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }[]) => void;
}

export default function TaskForm({ onAddTask, onAddBulkTasks }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const generateDateRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      setError('タイトルは必須です');
      return;
    }

    if (isRangeMode) {
      if (!startDate || !endDate) {
        setError('開始日と終了日は必須です');
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setError('開始日は終了日より前の日付を選択してください');
        return;
      }

      const dateRange = generateDateRange(startDate, endDate);
      const bulkTasks = dateRange.map(date => ({
        title,
        category: category as TaskCategory,
        description,
        dueDate: date,
      }));

      onAddBulkTasks(bulkTasks);
    } else {
      if (!dueDate) {
        setError('期限は必須です');
        return;
      }

      onAddTask({
        title,
        category: category as TaskCategory,
        description,
        dueDate,
      });
    }

    setError('');


    // フォームをリセット
    setTitle('');
    setCategory('other');
    setDescription('');
    setDueDate('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="taskMode"
            checked={!isRangeMode}
            onChange={() => setIsRangeMode(false)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-primary">単発タスク</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="taskMode"
            checked={isRangeMode}
            onChange={() => setIsRangeMode(true)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-primary">期間タスク（一括作成）</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-primary mb-1">
            タスク名
          </label>
          <input
            id="taskTitle"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder="タスク名を入力"
            className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-primary"
          />
        </div>

        <div className={`grid grid-cols-1 ${isRangeMode ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
          <div>
            <label htmlFor="taskCategory" className="block text-sm font-medium text-primary mb-1">
              カテゴリー
            </label>
            <select
              id="taskCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-primary"
            >
              <option value="other">カテゴリーを選択</option>
              <option value="listening">リスニング</option>
              <option value="reading">リーディング</option>
              <option value="vocabulary">単語</option>
              <option value="grammar">文法</option>
            </select>
          </div>

          {!isRangeMode ? (
            <div>
              <label htmlFor="taskDueDate" className="block text-sm font-medium text-primary mb-1">
                期限
              </label>
              <input
                id="taskDueDate"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setError('');
                }}
                className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-primary"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-primary mb-1">
                  開始日
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setError('');
                  }}
                  className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-primary"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-primary mb-1">
                  終了日
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setError('');
                  }}
                  className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-primary"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-primary mb-1">
            説明（任意）
          </label>
          <textarea
            id="taskDescription"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            placeholder={isRangeMode ? "説明を入力（任意）- 各日のタスクに共通で適用されます" : "説明を入力（任意）"}
            className="w-full p-3 border-2 border-black-200 rounded-lg text-base h-24 resize-none text-primary"
          />
        </div>

        {isRangeMode && startDate && endDate && new Date(startDate) <= new Date(endDate) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-primary">
              📅 {new Date(startDate).toLocaleDateString('ja-JP')} から {new Date(endDate).toLocaleDateString('ja-JP')} まで、
              <strong>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}個</strong>のタスクが作成されます
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-purple-600 text-white px-5 py-3 rounded-lg hover:opacity-90"
        >
          {isRangeMode ? 'タスクを一括作成' : 'タスクを追加'}
        </button>
      </form>
    </div>
  );
}
