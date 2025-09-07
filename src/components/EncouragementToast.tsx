'use client';

import type { EncouragementMessage } from '@/types';
import { useEffect, useState, useCallback } from 'react';

interface EncouragementToastProps {
  message: EncouragementMessage | null;
  onClose: () => void;
  autoHideDuration?: number; // ミリ秒（デフォルト: 5秒）
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export default function EncouragementToast({
  message,
  onClose,
  autoHideDuration = 5000,
  position = 'top-right'
}: EncouragementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    // アニメーション完了後に非表示
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (message) {
      // フェードイン開始
      setIsVisible(true);
      setIsAnimating(true);
      
      // 自動非表示タイマー
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [message, autoHideDuration, handleClose]);

  if (!message || !isVisible) {
    return null;
  }

  // ポジションに応じたクラス
  const getPositionClasses = (): string => {
    const base = 'fixed z-50';
    switch (position) {
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'top-center':
        return `${base} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'bottom-center':
        return `${base} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${base} top-4 right-4`;
    }
  };

  return (
    <div className={getPositionClasses()}>
      <div
        className={`
          max-w-sm bg-white border-l-4 border-blue-500 rounded-lg shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        <div className="p-4">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl" role="img" aria-label="encouragement">
                {message.emoji}
              </span>
              <span className="text-sm font-medium text-blue-600">
                学習応援メッセージ
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

          {/* メッセージ本文 */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {message.text}
          </p>

          {/* プログレスバー（自動消去の進行表示） */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all ease-linear"
                style={{
                  width: isAnimating ? '0%' : '100%',
                  transitionDuration: `${autoHideDuration}ms`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 複数のトーストメッセージを管理するためのコンテナーコンポーネント
 */
interface EncouragementToastContainerProps {
  messages: EncouragementMessage[];
  onMessageClose: (messageId: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
  autoHideDuration?: number;
}

export function EncouragementToastContainer({
  messages,
  onMessageClose,
  position = 'top-right',
  autoHideDuration = 5000
}: EncouragementToastContainerProps) {
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={message.id}
          style={{
            // 複数メッセージがある場合、縦にずらして表示
            transform: position.includes('top') 
              ? `translateY(${index * 80}px)` 
              : `translateY(${-index * 80}px)`
          }}
        >
          <EncouragementToast
            message={message}
            onClose={() => onMessageClose(message.id)}
            position={position}
            autoHideDuration={autoHideDuration}
          />
        </div>
      ))}
    </>
  );
}

/**
 * カスタムフック: 励ましメッセージの表示管理
 */
export function useEncouragementToast() {
  const [currentMessage, setCurrentMessage] = useState<EncouragementMessage | null>(null);

  const showMessage = (message: EncouragementMessage) => {
    setCurrentMessage(message);
  };

  const hideMessage = () => {
    setCurrentMessage(null);
  };

  return {
    currentMessage,
    showMessage,
    hideMessage
  };
}
