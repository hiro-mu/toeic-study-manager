# Firebase移行設計書

## 📊 データ構造設計

### 現在のLocalStorageからFirestoreへのマッピング

#### 1. Firestore Collections 構造

```
users/{userId}/
├── profile/
│   └── goals
├── tasks/
│   ├── {taskId}
│   └── ...
└── completedTasks/
    ├── {taskId}
    └── ...
```

#### 2. データ型変更

| 項目 | LocalStorage | Firestore | 変更理由 |
|------|-------------|-----------|---------|
| Task ID | `number` | `string` (DocumentID) | Firestoreの自動生成ID使用 |
| Timestamps | `string` (ISO) | `Timestamp` | Firestoreネイティブ型 |
| User isolation | なし | `userId` パス | ユーザー別データ分離 |

#### 3. 型定義の更新

```typescript
// Firebase用の新しい型定義
export interface FirebaseTask {
  id: string; // Firestore DocumentID
  title: string;
  category: TaskCategory;
  description?: string;
  dueDate: Timestamp;
  completed: boolean;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  completionData?: CompletionData;
  userId: string; // ユーザー識別子
}

export interface FirebaseGoal {
  targetScore: number;
  examDate: Timestamp | null;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔐 認証戦略

### 1. 初期実装: 匿名認証
- ユーザー登録不要でデータ保存可能
- デバイス固有のデータ管理
- 後でメール認証へのアップグレード可能

### 2. データ移行戦略
- LocalStorageデータを匿名ユーザーに関連付け
- 一回限りの移行プロセス
- 移行完了後はFirestoreがプライマリ

## 🛡️ セキュリティルール設計

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 オフライン対応

- Firestoreのオフライン永続化有効化
- ネットワーク状態の監視
- 同期インジケーターの表示
- 競合解決戦略の実装

## 🔄 移行フローデザイン

### 1. 移行検出
```typescript
const needsMigration = () => {
  const hasLocalData = localStorage.getItem('toeicTasks') !== null;
  const hasFirestoreData = // Firestore確認ロジック
  return hasLocalData && !hasFirestoreData;
};
```

### 2. 移行実行
1. ユーザー確認ダイアログ表示
2. 匿名認証実行
3. LocalStorageデータ読み込み
4. Firestoreフォーマットに変換
5. バッチ書き込み実行
6. 検証・確認
7. LocalStorageクリア

### 3. エラーハンドリング
- ネットワークエラー対応
- データ整合性チェック
- ロールバック機能
- ユーザー通知

## 📈 パフォーマンス考慮事項

### 1. クエリ最適化
- 複合インデックス設計
- ページネーション実装
- キャッシュ戦略

### 2. リアルタイム更新
```typescript
// タスク一覧のリアルタイム監視
useEffect(() => {
  if (!user) return;
  
  const unsubscribe = onSnapshot(
    collection(db, `users/${user.uid}/tasks`),
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasks);
    }
  );
  
  return unsubscribe;
}, [user]);
```

## 🧪 テスト戦略

### 1. Firebase Emulator Suite使用
- ローカルテスト環境
- セキュリティルールテスト
- データ移行テスト

### 2. テストデータ管理
- テスト用アカウント作成
- モックデータ生成
- テスト後クリーンアップ

## 📊 監視・分析

### 1. Firebase Analytics
- ユーザー行動追跡
- 機能使用率分析
- エラー発生率監視

### 2. Performance Monitoring
- ページロード時間
- Firestoreクエリ性能
- ネットワーク遅延分析

更新日: 2025年8月23日
