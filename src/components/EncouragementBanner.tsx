'use client';

import type { EncouragementMessage } from '@/types';
import { getEncouragementMessage } from '@/utils/encouragementMessages';
import { useEffect, useState } from 'react';

interface EncouragementBannerProps {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  hasGoal: boolean;
  refreshTrigger?: number; // 外部からの更新トリガー
}

export default function EncouragementBanner({
  completionRate,
  totalTasks,
  completedTasks,
  hasGoal,
  refreshTrigger = 0
}: EncouragementBannerProps) {
  const [message, setMessage] = useState<EncouragementMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 励ましメッセージを取得
    const encouragementMessage = getEncouragementMessage({
      completionRate,
      totalTasks,
      completedTasks,
      hasGoal
    });

    setMessage(encouragementMessage);
    setIsVisible(true);

    // 10秒後に自動で非表示にする
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(hideTimer);
  }, [completionRate, totalTasks, completedTasks, hasGoal, refreshTrigger]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!message || !isVisible) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg relative">
      <div className="flex items-center space-x-3">
        <span className="text-xl flex-shrink-0" role="img" aria-label="encouragement">
          {message.emoji}
        </span>
        <p className="text-sm text-blue-800 leading-relaxed flex-grow">
          {message.text}
        </p>
        <button
          onClick={handleClose}
          className="text-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
          aria-label="メッセージを閉じる"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
