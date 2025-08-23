import { Task, TaskCategory } from '@/types';
import { useState } from 'react';
import { CompletionModal } from './CompletionModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import TaskEditModal from './TaskEditModal';

interface TaskModalProps {
  tasks: Task[];
  date: string;
  onClose: () => void;
  onCompleteTask?: (taskId: string, completionData: {
    time: number;
    difficulty: string;
    focus: string;
  }) => void;
  onEditTask?: (taskId: string, updatedTask: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => void;
  onDeleteTask?: (taskId: string) => void;
}

export default function TaskModal({
  tasks,
  date,
  onClose,
  onCompleteTask,
  onEditTask,
  onDeleteTask
}: TaskModalProps) {
  const [showCompletionModal, setShowCompletionModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCompleteTask = (completionData: {
    time: number;
    difficulty: string;
    focus: string;
  }) => {
    if (showCompletionModal && onCompleteTask) {
      onCompleteTask(showCompletionModal, completionData);
      setShowCompletionModal(null);
    }
  };

  const handleEditTask = (taskId: string, updatedTask: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => {
    if (onEditTask) {
      onEditTask(taskId, updatedTask);
      setShowEditModal(null);
    }
  };

  const handleDeleteTask = () => {
    if (showDeleteModal && onDeleteTask) {
      onDeleteTask(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">{formattedDate}のタスク</h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${task.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-primary flex-1">{task.title}</h3>
                  <div className="flex space-x-1 ml-2">
                    {!task.completed && onCompleteTask && (
                      <button
                        onClick={() => setShowCompletionModal(task.id)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="完了にする"
                      >
                        ✅
                      </button>
                    )}
                    {onEditTask && (
                      <button
                        onClick={() => setShowEditModal(task.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="編集"
                      >
                        ✏️
                      </button>
                    )}
                    {onDeleteTask && (
                      <button
                        onClick={() => setShowDeleteModal(task.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="削除"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {task.description && (
                  <p className="text-secondary text-sm mb-2">{task.description}</p>
                )}

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`px-2 py-1 rounded ${task.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {task.completed ? '完了' : '未完了'}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
                    {task.category}
                  </span>
                  {task.completionData && (
                    <>
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                        学習時間: {task.completionData.time}分
                      </span>
                      <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">
                        難易度: {task.completionData.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700">
                        集中度: {task.completionData.focus}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                この日にはタスクがありません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 完了モーダル */}
      {showCompletionModal && (
        <CompletionModal
          isOpen={true}
          onClose={() => setShowCompletionModal(null)}
          onComplete={handleCompleteTask}
        />
      )}

      {/* 編集モーダル */}
      {showEditModal && (
        <TaskEditModal
          task={tasks.find(t => t.id === showEditModal)!}
          isOpen={true}
          onClose={() => setShowEditModal(null)}
          onSave={handleEditTask}
        />
      )}

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={true}
          onConfirm={handleDeleteTask}
          onCancel={() => setShowDeleteModal(null)}
          taskTitle={tasks.find(t => t.id === showDeleteModal)?.title || ''}
        />
      )}
    </>
  );
}
