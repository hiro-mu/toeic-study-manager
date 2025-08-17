'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ isOpen, taskTitle, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-4 text-gray-900">タスクを削除しますか？</h3>
          <p className="text-gray-700 mb-2">
            「<span className="font-semibold">{taskTitle}</span>」を削除します。
          </p>
          <p className="text-red-600 text-sm mb-6">
            この操作は取り消せません。
          </p>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-lg"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}