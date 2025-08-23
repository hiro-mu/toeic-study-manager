# TOEIC Study Manager - アーキテクチャドキュメント

## 📋 概要

TOEIC Study Managerは、TOEIC学習を効率的に管理するためのReact/Next.jsベースのWebアプリケーションです。タスク管理、学習進捗の追跡、統計分析、カレンダービューなどの機能を提供します。

## 🏗️ アーキテクチャ構成

### 技術スタック

- **フレームワーク**: Next.js 15.4.6 (App Router)
- **言語**: TypeScript 5.9.2
- **UI**: React 19.1.0
- **スタイリング**: Tailwind CSS v4
- **状態管理**: React Hooks (useState, useEffect)
- **データ永続化**: LocalStorage
- **テスト**: Jest + Testing Library
- **開発ツール**: Turbopack, ESLint

### ディレクトリ構造

```text
src/
├── app/                    # Next.js App Router
│   ├── favicon.ico        # ファビコン
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── Calendar.tsx       # カレンダービュー
│   ├── CompletionModal.tsx # タスク完了モーダル
│   ├── DeleteConfirmModal.tsx # 削除確認モーダル
│   ├── Header.tsx         # ヘッダーコンポーネント
│   ├── TaskEditModal.tsx  # タスク編集モーダル
│   ├── TaskForm.tsx       # タスク作成フォーム
│   ├── TaskList.tsx       # タスクリスト表示
│   └── TaskModal.tsx      # タスク詳細モーダル
├── types/                 # TypeScript型定義
│   └── index.ts          # 共通型定義
└── utils/                 # ユーティリティ関数
    └── statistics.ts      # 統計計算関数
```

## 🎯 主要機能とコンポーネント

### 1. アプリケーション層 (`app/`)

#### `layout.tsx` - ルートレイアウト

- **責務**: アプリケーション全体のレイアウト定義
- **特徴**:
  - 多言語対応 (lang="ja")
  - Google Fonts (Inter) の設定
  - Chart.js の外部ライブラリ読み込み
  - グラデーション背景の設定

#### `page.tsx` - メインページ

- **責務**: アプリケーションのメイン画面とステート管理
- **主要機能**:
  - タスクの状態管理 (未完了/完了)
  - 目標設定の管理 (目標スコア、試験日)
  - LocalStorageとの連携
  - 各種ハンドラー関数の定義

### 2. コンポーネント層 (`components/`)

#### `Header.tsx` - ヘッダーコンポーネント

- **責務**: アプリケーションタイトルと目標設定
- **Props**: `goals`, `onUpdateGoals`
- **機能**: 目標スコアと試験日の入力フォーム

#### `TaskForm.tsx` - タスク作成フォーム

- **責務**: 新規タスクの作成と一括作成
- **主要機能**:
  - 単一タスク作成
  - 日付範囲指定による一括タスク作成
  - バリデーション機能
  - カテゴリ選択 (reading, listening, grammar, vocabulary, mock-test, other)

#### `TaskList.tsx` - タスクリスト

- **責務**: タスクの一覧表示と操作
- **主要機能**:
  - タスクの日付順ソート
  - 期限切れタスクの強調表示
  - タスクの完了、編集、削除操作
  - モーダル制御

#### `Calendar.tsx` - カレンダービュー

- **責務**: カレンダー形式でのタスク表示
- **主要機能**:
  - 月次カレンダーの表示
  - タスクの日別表示
  - 今日の強調表示
  - 試験日の特別表示

#### モーダルコンポーネント群

- **`CompletionModal.tsx`**: タスク完了時のデータ入力
- **`TaskEditModal.tsx`**: タスクの編集
- **`DeleteConfirmModal.tsx`**: 削除確認
- **`TaskModal.tsx`**: タスク詳細表示

### 3. 型定義層 (`types/`)

#### `index.ts` - 共通型定義

```typescript
// 主要な型定義
interface Task {
  id: number;
  title: string;
  category: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  completionData?: {
    time: number;
    difficulty: string;
    focus: string;
  };
}

interface Goal {
  targetScore: number;
  examDate: string | null;
}
```

### 4. ユーティリティ層 (`utils/`)

#### `statistics.ts` - 統計計算

- **`calculateProgress()`**: タスク完了率の計算
- **`calculateDaysLeft()`**: 試験日までの残り日数
- **`calculateRequiredTasksPerDay()`**: 1日あたりの必要タスク数
- **`calculateTotalStudyTime()`**: 総学習時間の計算

## 🔄 データフロー

### 1. 状態管理フロー

```text
LocalStorage → useEffect → State → Components → Event Handlers → State → LocalStorage
```

### 2. タスク管理フロー

```text
TaskForm → onAddTask → page.tsx → State Update → TaskList → Display
```

### 3. タスク完了フロー

```text
TaskList → CompletionModal → onCompleteTask → State Update → Statistics Update
```

## 💾 データ永続化

### LocalStorage構成

- **`toeicTasks`**: 未完了タスクの配列
- **`toeicCompletedTasks`**: 完了済みタスクの配列
- **`toeicGoals`**: 目標設定 (目標スコア、試験日)

### データ構造の特徴

- タスクの完了状態による分離管理
- 完了データ (学習時間、難易度、集中度) の記録
- 日付形式の統一 (ISO 8601: YYYY-MM-DD)

## 🎨 UI/UXの設計原則

### 1. レスポンシブデザイン

- Tailwind CSSによるユーティリティファーストアプローチ
- モバイルファーストの設計

### 2. 視覚的フィードバック

- グラデーション背景 (`from-blue-400 to-purple-600`)
- カード型のレイアウト (`rounded-2xl shadow-lg`)
- 期限切れタスクの色分け表示

### 3. ユーザビリティ

- 確認モーダルによる誤操作防止
- 一括タスク作成による効率化
- カレンダービューによる視覚的な進捗確認

## 🧪 テスト戦略

### テスト構成

- **Jest**: テストランナー
- **Testing Library**: コンポーネントテスト
- **Jest Environment**: jsdom環境

### テストファイル (`__tests__/`)

- カレンダー機能のテスト
- 目標管理のテスト
- タスク操作のテスト
- 統計計算のテスト

## 🔧 開発環境

### ビルドツール

- **Turbopack**: 高速な開発サーバー
- **Next.js Build**: 本番ビルド

### 品質管理

- **ESLint**: コード品質チェック
- **TypeScript**: 型安全性の確保
- **Prettier**: コードフォーマット (設定推奨)

## 📈 パフォーマンス考慮事項

### 1. クライアントサイドレンダリング

- `'use client'`ディレクティブによるCSR
- LocalStorageによる高速データアクセス

### 2. バンドル最適化

- 動的インポートの活用 (必要に応じて)
- Tree shakingによる不要コードの除去

### 3. メモリ管理

- 適切なクリーンアップ処理
- イベントリスナーの適切な管理

## 🔮 拡張性と今後の改善点

### 1. 機能拡張案

- **データバックアップ**: クラウド同期機能
- **通知機能**: タスクリマインダー
- **分析機能**: 学習傾向の可視化
- **ソーシャル機能**: 学習記録の共有

### 2. 技術的改善案

- **状態管理**: Zustand/Reduxの導入
- **データベース**: Supabase/Firebaseの統合
- **PWA対応**: オフライン機能の追加
- **パフォーマンス**: React.memoによる最適化

### 3. アーキテクチャ改善案

- **レイヤー分離**: ビジネスロジックの分離
- **型安全性強化**: Zodによるランタイムバリデーション
- **テストカバレッジ**: E2Eテストの追加
- **アクセシビリティ**: ARIA属性の強化

## 🏆 ベストプラクティス

### 1. コード品質

- TypeScriptによる型安全性の確保
- 一貫したコンポーネント設計
- Props interfaceの明確な定義

### 2. 保守性

- 責任の明確な分離
- 再利用可能なコンポーネント設計
- 設定ファイルの外部化

### 3. セキュリティ

- XSS対策 (React標準の保護機能)
- LocalStorageの適切な使用
- 入力値のバリデーション

---

**最終更新**: 2025年8月23日  
**ドキュメントバージョン**: 1.0  
**対象アプリケーションバージョン**: 0.1.0
