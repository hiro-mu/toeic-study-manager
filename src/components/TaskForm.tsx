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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('タイトルと期限は必須です');
      return;
    }

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
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスク名"
          className="w-full p-3 border-2 border-gray-200 rounded-lg text-base text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border-2 border-gray-200 rounded-lg text-base text-black"
        >
          <option value="other">カテゴリーを選択</option>
          <option value="listening">リスニング</option>
          <option value="reading">リーディング</option>
          <option value="vocabulary">単語</option>
          <option value="grammar">文法</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 border-2 border-gray-200 rounded-lg text-base text-black"
        />
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明（任意）"
          className="w-full p-3 border-2 border-gray-200 rounded-lg text-base h-24 resize-none text-black"
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
