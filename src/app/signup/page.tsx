'use client';

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode="signup"
          onSuccess={() => router.replace('/')}
        />

        <div className="text-center mt-6">
          <p className="text-gray-600">
            既にアカウントをお持ちの方は{' '}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
