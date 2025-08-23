// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

// Firebase config - 開発環境ではダミー値、本番環境では環境変数から読み込む
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-toeic-study-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Debug: Firebase設定を確認
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config Debug:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Not set',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 20)}...` : 'Not set',
  });
}

// Firebase app initialization
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Development environment setup - 一時的にエミュレーター接続を無効化
if (false && process.env.NODE_ENV === 'development') {
  // Emulator接続 (一度だけ実行)
  const globalAny = globalThis as unknown as { _firestoreEmulatorConnected?: boolean };
  if (typeof window !== 'undefined' && !globalAny._firestoreEmulatorConnected) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9098', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8081);
      globalAny._firestoreEmulatorConnected = true;
      console.log('🔧 Firebase Emulator connected');
    } catch (error) {
      console.log('Emulator connection failed or already connected:', error);
    }
  }
}

// Enable offline persistence in production
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence');
    }
  });
}

export { app };
