'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskEditModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: number, updatedTask: {
    title: string;
    category: string;
    description: string;
    dueDate: string;
  }) => void;
}

export default function TaskEditModal({ isOpen, task, onClose, onSave }: TaskEditModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setDescription(task.description || '');
      setDueDate(task.dueDate);
      setError('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    if (!dueDate) {
      setError('期限は必須です');
      return;
    }

    if (!task) return;

    onSave(task.id, {
      title: title.trim(),
      category,
      description: description.trim(),
      dueDate,
    });

    setError('');
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      listening: 'リスニング',
      reading: 'リーディング',
      vocabulary: '単語',
      grammar: '文法',
      other: 'その他',
    };
    return names[category] || category;
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">タスクを編集</h3>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="editTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              タスク名
            </label>
            <input
              id="editTaskTitle"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="タスク名を入力"
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editTaskCategory" className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー
              </label>
              <select
                id="editTaskCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base text-black"
              >
                <option value="other">その他</option>
                <option value="listening">リスニング</option>
                <option value="reading">リーディング</option>
                <option value="vocabulary">単語</option>
                <option value="grammar">文法</option>
              </select>
            </div>

            <div>
              <label htmlFor="editTaskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                id="editTaskDueDate"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setError('');
                }}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base text-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="editTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              説明（任意）
            </label>
            <textarea
              id="editTaskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明を入力（任意）"
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base h-24 resize-none text-black"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-lg"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-lg hover:opacity-90"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}