'use client';

import { useEffect, useState } from 'react';
import { CompletionModal, type Task } from './CompletionModal';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: number, completionData: { time: number; difficulty: string; focus: string }) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [today] = useState(() => new Date().toISOString().split('T')[0]);

  // タスクを日付順にソート
  const sortedTasks = [...tasks].sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleCompleteTask = (taskId: number) => {
    setCurrentTaskId(taskId);
    setShowCompletionModal(true);
  };

  const handleCompletionSubmit = (completionData: { time: number; difficulty: string; focus: string }) => {
    if (currentTaskId !== null) {
      onCompleteTask(currentTaskId, completionData);
      setShowCompletionModal(false);
      setCurrentTaskId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      listening: 'bg-blue-100 text-blue-700',
      reading: 'bg-purple-100 text-purple-700',
      vocabulary: 'bg-green-100 text-green-700',
      grammar: 'bg-orange-100 text-orange-700',
      other: 'bg-black-100 text-black-700',
    };
    return colors[category] || colors.other;
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

  return (
    <div>
      {sortedTasks.map((task) => {
        const isOverdue = task.dueDate < today;
        const categoryClass = getCategoryColor(task.category);

        return (
          <div
            key={task.id}
            className={`bg-white p-4 rounded-xl mb-3 border-l-4 ${isOverdue ? 'border-red-500 bg-red-50' : 'border-blue-400'
              }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-black">{task.title}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="px-3 py-1 text-sm bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-lg hover:opacity-90"
                >
                  完了
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:opacity-90"
                >
                  削除
                </button>
              </div>
            </div>

            <div className="text-sm text-black">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mr-2 ${categoryClass}`}>
                {getCategoryName(task.category)}
              </span>
              期限: {task.dueDate} {isOverdue && '(期限切れ)'}
            </div>

            {task.description && (
              <p className="mt-2 text-sm text-black">{task.description}</p>
            )}
          </div>
        );
      })}

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onComplete={handleCompletionSubmit}
      />
    </div>
  );
}
