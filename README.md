# 🎯 TOEIC Study Manager

> 効率的なTOEIC学習を支援する、Firebase ベースの包括的な学習管理Webアプリケーション

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1.0-ffca28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Test Coverage](https://img.shields.io/badge/Test%20Coverage-98%25-green)](https://jestjs.io/)

## ✨ プロジェクト概要

**TOEIC Study Manager** は、TOEIC学習を体系的に管理するためのモダンなWebアプリケーションです。タスク管理、進捗追跡、統計分析、カレンダー表示など、学習効率を最大化する包括的な機能を提供します。

### 🎨 主要な特徴

- **🔐 包括的認証システム** - Firebase Authenticationによるセキュアなユーザー管理
- **📝 高度なタスク管理** - 単発・期間タスクの作成、編集、削除、完了管理
- **📊 リアルタイム統計** - カテゴリ別進捗、完了率、学習時間の詳細分析
- **📅 インタラクティブカレンダー** - 視覚的な進捗確認とタスク管理
- **🎯 目標設定機能** - 目標スコア設定と試験日管理
- **📱 レスポンシブデザイン** - モバイル・デスクトップ対応
- **⚡ 高速パフォーマンス** - Turbopack による高速開発・ビルド
- **💬 励ましメッセージシステム** - 学習モチベーション維持のためのインテリジェント応援機能

## 🛠️ 技術スタック

### フロントエンド

- **[Next.js 15.4.6](https://nextjs.org/)** - App Router、Server Components、Turbopack対応
- **[React 19.1.0](https://reactjs.org/)** - 最新のReact機能とHooks
- **[TypeScript 5.9.2](https://www.typescriptlang.org/)** - 厳格な型安全性
- **[Tailwind CSS v4](https://tailwindcss.com/)** - ユーティリティファーストCSS

### バックエンド・データベース

- **[Firebase 12.1.0](https://firebase.google.com/)** - Authentication、Firestore Database
- **[Firestore](https://firebase.google.com/docs/firestore)** - NoSQLドキュメントデータベース
- **Firebase Emulator Suite** - ローカル開発環境

### 開発・テストツール

- **[Jest 30.0.5](https://jestjs.io/)** - テストフレームワーク
- **[Testing Library](https://testing-library.com/)** - React コンポーネントテスト
- **[ESLint](https://eslint.org/)** + **TypeScript ESLint** - 静的コード解析
- **[Concurrently](https://www.npmjs.com/package/concurrently)** - 並行プロセス実行

## 🚀 セットアップと実行

### 前提条件

- **Node.js** (v18.17.0以上推奨)
- **npm** または **yarn**
- **Firebase プロジェクト** (本番環境の場合)

### 1. リポジトリクローン

```bash
git clone https://github.com/hiro-mu/toeic-study-manager.git
cd toeic-study-manager
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. Firebase設定 (本番環境)

環境変数ファイル `.env.local` を作成し、Firebase設定を追加:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 開発サーバー起動

#### ローカル開発（Firebaseエミュレーター使用）

```bash
# Firebaseエミュレーターと開発サーバーを同時起動
npm run dev:emulator

# または個別に起動
npm run emulator  # Firebaseエミュレーター
npm run dev       # Next.js開発サーバー（Turbopack）
```

#### 本番Firebase接続

```bash
npm run dev
```

### 5. アプリケーションアクセス

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## 📋 利用可能なスクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 (Turbopack) |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm test` | テスト実行 |
| `npm run test:watch` | テストウォッチモード |
| `npm run lint` | ESLint実行 |
| `npm run emulator` | Firebaseエミュレーター起動 |
| `npm run emulator:ui` | エミュレーターUI付き起動 |
| `npm run dev:emulator` | エミュレーター + 開発サーバー同時起動 |

## 🎯 主要機能詳細

### 📝 タスク管理システム

- **単発タスク作成**: タイトル、カテゴリ、説明、期限設定
- **期間タスク一括作成**: 指定期間での自動タスク生成
- **6つのカテゴリ**: Reading, Listening, Grammar, Vocabulary, Mock Test, Other
- **完了時詳細記録**: 学習時間、難易度、集中度の記録
- **リアルタイム編集・削除**: インライン編集機能

### 📊 統計・分析機能

- **全体進捗率**: 完了タスク数に基づく進捗計算
- **カテゴリ別統計**: 各カテゴリの完了率とタスク数
- **学習時間分析**: 総学習時間と平均時間の計算
- **試験日カウントダウン**: 残り日数と1日必要タスク数の計算

### 📅 カレンダー機能

- **月次カレンダー表示**: タスクの視覚的配置
- **タスク数インジケーター**:
  - 1個: 青いドット
  - 2-3個: 複数ドット
  - 4個以上: 数字バッジ
  - 9個超: "9+" 表示
- **試験日マーカー**: 設定された試験日の特別表示
- **直接タスク管理**: カレンダーからのタスク操作

### 🎯 目標設定システム

- **目標スコア設定**: TOEICスコア目標の設定
- **試験日管理**: 試験予定日の設定と追跡
- **進捗追跡**: 目標に対する現在の進捗状況

### 🔐 認証システム

- **メール/パスワード認証**: Firebase Authentication
- **パスワードリセット**: セキュアなパスワード回復機能
- **匿名認証**: 開発・テスト用途
- **セッション管理**: 自動ログイン状態保持

### 💬 励ましメッセージシステム

- **インテリジェント表示**: ユーザーの学習状況に応じた適応的メッセージ配信
- **24種類のメッセージ**: 心理学的に設計された多様な励ましコンテンツ
- **コンテキスト認識**: 時間帯、進捗率、学習履歴に基づくメッセージ選択
- **2つの表示形式**:
  - **ヘッダーバナー**: インライン表示での自然な統合
  - **トースト通知**: タスク完了時の右上ポップアップ
- **重複回避システム**: LocalStorageによる最近表示メッセージの管理
- **レスポンシブアニメーション**: 美しいフェードイン/アウトエフェクト

## 🧪 テスト

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# 特定のテストファイル
npm test task-creation.test.tsx
```

### テストカバレッジ

- **総テスト数**: 131テスト
- **成功率**: 100% (131/131)
- **カバー範囲**:
  - コンポーネント機能テスト
  - 統計計算ロジック
  - ユーザーインタラクション
  - データ操作機能
  - 励ましメッセージシステム
  - エッジケース・セキュリティ検証

## 🏗️ アーキテクチャ詳細

### ディレクトリ構造

```text
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ
│   ├── signin/            # サインインページ
│   └── signup/            # サインアップページ
├── components/            # Reactコンポーネント
│   ├── AuthForm.tsx       # 認証フォーム
│   ├── Calendar.tsx       # カレンダー表示
│   ├── TaskForm.tsx       # タスク作成フォーム
│   ├── TaskList.tsx       # タスクリスト
│   ├── Header.tsx         # ヘッダーコンポーネント
│   ├── EncouragementToast.tsx     # 励ましメッセージトースト
│   └── EncouragementBanner.tsx    # 励ましメッセージバナー
├── hooks/                 # カスタムHooks
│   └── useAuth.ts         # 認証状態管理
├── lib/                   # ライブラリ・設定
│   ├── firebase.ts        # Firebase設定
│   └── dataService.ts     # Firestoreデータアクセス
├── types/                 # TypeScript型定義
│   └── index.ts           # 共通型定義
└── utils/                 # ユーティリティ関数
    ├── statistics.ts      # 統計計算関数
    └── encouragementMessages.ts  # 励ましメッセージロジック
```

### データフロー

```text
Firebase Auth → useAuth Hook → React State → UI Components
     ↓
Firestore → DataService → State Management → Component Updates
```

### 型システム

- **厳格なTypeScript**: `strict: true` 設定
- **包括的な型定義**: Task, Goal, AuthUser, CategoryStats等
- **Firebase型変換**: FirestoreとReact間の型安全な変換

## 🔧 開発ガイドライン

### コーディング規約

- **TypeScript**: 明示的な型定義、`any`型の禁止
- **React**: 関数コンポーネント、適切なHooks使用
- **ファイル命名**: PascalCase（コンポーネント）、camelCase（ユーティリティ）
- **インポート順序**: React → 外部ライブラリ → 内部モジュール → 相対パス

### コンポーネント設計原則

- **単一責任原則**: 1コンポーネント1責任
- **Props型定義**: 明示的なinterface定義
- **状態管理**: 最小限の状態管理、適切な状態配置
- **再利用性**: 汎用的なコンポーネント設計

## 🚀 本番環境デプロイ

### ビルド

```bash
npm run build
```

### Firebase Hosting (推奨)

1. Firebase CLI インストール

```bash
npm install -g firebase-tools
```

1. Firebaseプロジェクト初期化

```bash
firebase init hosting
```

1. デプロイ

```bash
firebase deploy
```

### Vercel (代替選択肢)

```bash
npx vercel
```

## 🤝 コントリビューション

### 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### 開発時の確認事項

- [ ] ESLintエラーの解消
- [ ] 既存テストの通過
- [ ] 新機能のテスト追加
- [ ] TypeScript型エラーの解消
- [ ] レスポンシブデザインの確認

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - React開発フレームワーク
- [Firebase](https://firebase.google.com/) - バックエンドサービス
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [React Testing Library](https://testing-library.com/) - テストライブラリ

---

**📞 サポート**: 問題や質問がある場合は、[Issues](https://github.com/hiro-mu/toeic-study-manager/issues) ページでお気軽にお問い合わせください。

**⭐ Star this repo** if you find it helpful!
