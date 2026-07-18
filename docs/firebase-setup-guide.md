# Firebase環境設定ガイド

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18.17.0以上
- JDK 21以上（Firebase Emulator起動に必須）

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
3. **「メール/パスワード」を有効化**（主要認証方法）
4. 「匿名」を無効化または開発用として残す
5. 必要に応じて「メール確認」を有効化

#### 追加のセキュリティ設定（推奨）

- **パスワードポリシー**: Firebase Consoleの「設定」→「パスワードポリシー」で以下を設定
  - 最小文字数: 8文字
  - 大文字・小文字・数字・記号の組み合わせを要求
- **メール列挙保護**: gcloudツールで有効化（本番環境推奨）

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

`npm run emulator` は `scripts/run-firebase-emulator.mjs` を経由し、Java 21を解決した状態で Firebase CLI を起動します。

### Emulator UI アクセス

- **Emulator Suite UI**: [http://localhost:4001](http://localhost:4001)
- **Firestore Emulator**: [http://localhost:8081](http://localhost:8081)
- **Auth Emulator**: [http://localhost:9098](http://localhost:9098)

## 📊 データ構造

### Firestore Collections

```text
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
   - ポート4001/8081/9098が使用中でないか確認4000, 8080, 9099 を掴んでいる
   - `npm run emulator`で起動して確認

2. **`Unable to find JDK 21` エラー**
   - `java -version` で Java 21以上か確認
   - 必要なら `JAVA_HOME` を Java 21 に設定して再実行
   - あわせて PATH に `$JAVA_HOME/bin` を追加

   補足: シェル別設定例
   - bash/zsh: `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` と `export PATH="$JAVA_HOME/bin:$PATH"`
   - `java_home -v 21` で見つからない場合（Homebrewのkeg-only構成）: `export JAVA_HOME="$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home"` と `export PATH="$JAVA_HOME/bin:$PATH"`
   - fish: `set -gx JAVA_HOME (brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home` と `fish_add_path $JAVA_HOME/bin`

3. **認証エラー**
   - `.env.local`の設定値を確認
   - Firebaseプロジェクトでドメインが許可されているか確認

4. **データが表示されない**
   - Emulator UIでデータが正しく保存されているか確認
   - ブラウザの開発者ツールでエラーログ確認

### デバッグコマンド

```bash
# Firebase CLI確認
npx firebase --version

# Emulator状態確認
npm run emulator:ui

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
