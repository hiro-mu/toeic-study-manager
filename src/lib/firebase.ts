// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';

// Firebase config - 開発環境でのエミュレーター使用時はダミー値、本番環境では環境変数から読み込む
const useEmulator = process.env.NODE_ENV === 'development';

const firebaseConfig = {
  apiKey: useEmulator ? "demo-key" : (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key"),
  authDomain: useEmulator ? "demo-project.firebaseapp.com" : (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com"),
  projectId: useEmulator ? "demo-toeic-study-app" : (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-toeic-study-app"),
  storageBucket: useEmulator ? "demo-project.appspot.com" : (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com"),
  messagingSenderId: useEmulator ? "123456789" : (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789"),
  appId: useEmulator ? "1:123456789:web:abcdef" : (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"),
};

// Debug: Firebase設定を確認
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config Debug:', {
    useEmulator,
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

// Development environment setup - エミュレーター接続を有効化
if (useEmulator) {
  // Emulator接続 (一度だけ実行)
  const globalAny = globalThis as unknown as { _firestoreEmulatorConnected?: boolean };
  if (typeof window !== 'undefined' && !globalAny._firestoreEmulatorConnected) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9098', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8081);
      globalAny._firestoreEmulatorConnected = true;
      console.log('🔧 Firebase Emulator connected successfully');
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
