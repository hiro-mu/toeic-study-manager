import { auth } from '@/lib/firebase';
import type { AuthUser } from '@/types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { useEffect, useState } from 'react';

// Firebase認証エラーコードを日本語メッセージに変換
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に登録されています。ログインページからサインインしてください。';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます。6文字以上で設定してください。';
    case 'auth/invalid-email':
      return '無効なメールアドレスです。正しい形式で入力してください。';
    case 'auth/user-not-found':
      return 'このメールアドレスは登録されていません。新規登録してください。';
    case 'auth/wrong-password':
      return 'パスワードが間違っています。正しいパスワードを入力してください。';
    case 'auth/too-many-requests':
      return 'ログイン試行回数が上限に達しました。しばらく時間をおいてから再試行してください。';
    case 'auth/network-request-failed':
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
    case 'auth/operation-not-allowed':
      return 'この認証方法は無効になっています。管理者にお問い合わせください。';
    case 'auth/invalid-credential':
      return '認証情報が無効です。メールアドレスとパスワードを確認してください。';
    default:
      return `認証エラーが発生しました: ${errorCode}`;
  }
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAnonymous: firebaseUser.isAnonymous,
            emailVerified: firebaseUser.emailVerified,
            displayName: firebaseUser.displayName
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // メール/パスワードでユーザー登録
  const signUp = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error: unknown) {
      console.error('Sign up failed:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown-error';
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // メール/パスワードでログイン
  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error: unknown) {
      console.error('Sign in failed:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown-error';
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // パスワードリセット
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown-error';
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 匿名ログイン（開発・テスト用に残す）
  const signInAnonymouslyHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInAnonymously(auth);
    } catch (error: unknown) {
      console.error('Anonymous sign in failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const signOutHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
    } catch (error: unknown) {
      console.error('Sign out failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // エラーをクリアする関数
  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    resetPassword,
    signInAnonymously: signInAnonymouslyHandler,
    signOut: signOutHandler,
    clearError
  };
}
