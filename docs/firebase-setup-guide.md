# Firebase環境設定ガイド

## 🚀 開発環境セットアップ

### 1. 環境変数設定

`.env.local.example`を`.env.local`にコピーし、Firebase Console から取得した値で更新してください：

```bash
cp .env.local.example .env.local
```

### 2. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：`toeic-study-manager`）
4. Google Analyticsを有効化（推奨）
5. プロジェクトを作成

### 3. Firebaseアプリの追加

1. プロジェクトホーム画面で「ウェブアプリを追加」
2. アプリ名を入力（例：`TOEIC Study Manager`）
3. Firebase Hostingも設定するにチェック（任意）
4. Firebase設定コードをコピーして`.env.local`に設定

### 4. Authentication設定

1. Firebase Consoleの「Authentication」へ
2. 「Sign-in method」タブをクリック
3. 「匿名」を有効化
4. 「メール/パスワード」も有効化（将来の拡張用）

### 5. Firestore設定

1. Firebase Consoleの「Firestore Database」へ
2. 「データベースを作成」をクリック
3. **テストモード**で開始（セキュリティルールは後で設定）
4. ロケーション選択（asia-northeast1推奨）

### 6. セキュリティルール設定

プロジェクトルートの`firestore.rules`を使用：

```bash
firebase deploy --only firestore:rules
```

## 🧪 ローカル開発

### Firebase Emulator Suite使用

```bash
# Emulatorのみ起動
npm run emulator

# Next.js + Emulator同時起動
npm run dev:emulator
```

### Emulator UI アクセス

- **Emulator Suite UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099

## 📊 データ構造

### Firestore Collections

```
/users/{userId}/
  ├── profile/
  │   └── goals (document)
  └── tasks/
      ├── {taskId} (document)
      └── ...
```

### Task Document例

```json
{
  "title": "TOEIC Part 5の練習",
  "category": "reading",
  "description": "文法問題の練習",
  "dueDate": "2025-08-30T00:00:00.000Z",
  "completed": false,
  "createdAt": "2025-08-23T13:30:00.000Z",
  "userId": "anonymous-user-id"
}
```

## 🔧 トラブルシューティング

### よくある問題

1. **エミュレーター接続エラー**
   - ポート8080/9099が使用中でないか確認
   - `firebase emulators:start`で個別起動して確認

2. **認証エラー**
   - `.env.local`の設定値を確認
   - Firebaseプロジェクトでドメインが許可されているか確認

3. **データが表示されない**
   - Emulator UIでデータが正しく保存されているか確認
   - ブラウザの開発者ツールでエラーログ確認

### デバッグコマンド

```bash
# Firebase CLI確認
npx firebase --version

# Emulator状態確認
npx firebase emulators:start --only firestore,auth --inspect-functions

# プロジェクト状態確認
npx firebase projects:list
```

## 📝 移行チェックリスト

- [ ] Firebaseプロジェクト作成
- [ ] 環境変数設定（`.env.local`）
- [ ] Authentication設定（匿名認証有効化）
- [ ] Firestore設定（テストモード）
- [ ] Emulator動作確認
- [ ] セキュリティルールデプロイ
- [ ] 本番環境向けセキュリティルール更新

更新日: 2025年8月23日
