'use client';

import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    category: string;
    description: string;
    dueDate: string;
  }) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      setError('タイトルと期限は必須です');
      return;
    }
    setError('');

    onAddTask({
      title,
      category,
      description,
      dueDate,
    });

    // フォームをリセット
    setTitle('');
    setCategory('other');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {error && (
        <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
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
          className="w-full p-3 border-2 border-black-200 rounded-lg text-base text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリー
          </label>
          <select
            id="taskCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border-2 border-black-200 rounded-lg text-base text-black"
          >
            <option value="other">カテゴリーを選択</option>
            <option value="listening">リスニング</option>
            <option value="reading">リーディング</option>
            <option value="vocabulary">単語</option>
            <option value="grammar">文法</option>
          </select>
        </div>

        <div>
          <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="p-3 border-2 border-black-200 rounded-lg text-base text-black"
          />
        </div>
      </div>

      <div>
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
          説明（任意）
        </label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError('');
          }}
          placeholder="説明を入力（任意）"
          className="w-full p-3 border-2 border-black-200 rounded-lg text-base h-24 resize-none text-black"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-400 to-purple-600 text-white px-5 py-3 rounded-lg hover:opacity-90"
      >
        タスクを追加
      </button>
    </form>
  );
}
