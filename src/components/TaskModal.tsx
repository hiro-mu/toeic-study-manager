import { Task } from '@/types';

interface TaskModalProps {
  tasks: Task[];
  date: string;
  onClose: () => void;
}

export default function TaskModal({ tasks, date, onClose }: TaskModalProps) {
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{formattedDate}のタスク</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-lg ${task.completed
                ? 'bg-green-100 border border-green-200'
                : 'bg-blue-100 border border-blue-200'
                }`}
            >
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              {task.description && (
                <p className="text-gray-800 mt-1">{task.description}</p>
              )}
              <div className="mt-2 text-sm">
                <span className={`${task.completed ? 'text-green-600' : 'text-blue-600'
                  }`}>
                  {task.completed ? '完了' : '未完了'}
                </span>
                {task.completionData && (
                  <span className="ml-4 text-gray-900">
                    学習時間: {task.completionData.time}分
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
