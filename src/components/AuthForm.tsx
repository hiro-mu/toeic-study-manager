'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { signUp, signIn, resetPassword, error: authError, clearError } = useAuth();

  // エラーをクリアする関数
  const handleClearError = () => {
    clearError();
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleClearError(); // エラーをクリア

    try {
      if (mode === 'signup') {
        // パスワード確認
        if (password !== confirmPassword) {
          setFormError('パスワードが一致しません');
          return;
        }
        // パスワードの最低条件チェック
        if (password.length < 6) {
          setFormError('パスワードは6文字以上である必要があります');
          return;
        }
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      // 成功時のコールバック
      onSuccess?.();

    } catch (error: unknown) {
      console.error('Authentication error:', error);
      // useAuthのエラーメッセージを使用するため、ここでは特別な処理は不要
      // formErrorはuseAuthのerrorと重複表示を避けるため設定しない
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setFormError('パスワードリセットにはメールアドレスが必要です');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      await resetPassword(email);
      setFormError('パスワードリセットメールを送信しました');
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      setFormError('パスワードリセットに失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'signup' ? 'アカウント作成' : 'ログイン'}
        </h2>
        <p className="text-gray-600 mt-2">
          {mode === 'signup'
            ? 'TOEIC学習を始めましょう'
            : 'おかえりなさい！学習を続けましょう'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (authError || formError) {
                handleClearError();
              }
            }}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>

        {/* パスワード */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (authError || formError) {
                handleClearError();
              }
            }}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="6文字以上のパスワード"
            disabled={isSubmitting}
          />
        </div>

        {/* パスワード確認（新規登録時のみ） */}
        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード確認
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (authError || formError) {
                  handleClearError();
                }
              }}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="パスワードを再入力"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* エラーメッセージ */}
        {(authError || formError) && (
          <div className={`p-4 rounded-lg text-sm ${
            (formError && formError.includes('送信しました'))
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {authError || formError}
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting
            ? '処理中...'
            : mode === 'signup'
              ? 'アカウント作成'
              : 'ログイン'
          }
        </button>

        {/* パスワードリセット（ログイン時のみ） */}
        {mode === 'signin' && (
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isSubmitting}
            className="w-full text-blue-600 hover:text-blue-800 py-2 text-sm font-medium transition-colors"
          >
            パスワードを忘れた場合
          </button>
        )}
      </form>
    </div>
  );
}
