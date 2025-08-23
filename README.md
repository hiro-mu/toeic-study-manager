# TOEIC Study Manager

TOEIC学習の進捗管理アプリケーション。タスク管理、目標設定、進捗の可視化、カレンダービュー、統計分析などの機能を提供します。

## 技術スタック

### フロントエンド

- **Next.js 15.4.6** (App Router)
- **React 19.1.0** (Client Components)
- **TypeScript 5.9.2** (厳格な型付け)
- **Tailwind CSS v4** (ユーティリティファースト)

### 開発・テストツール

- **Jest 30.0.5** + **Testing Library** (テスト)
- **ESLint** + **TypeScript ESLint** (静的解析)
- **Turbopack** (高速開発サーバー)

### データ管理

- **LocalStorage** (クライアントサイドデータ永続化) - 既存実装
- **Firebase Firestore** (クラウドデータベース) - 新実装・移行中
- **React Hooks** (useState, useEffect)

## プロジェクト構成

```plaintext
toeic_learn_app/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot用の指示ファイル
├── __tests__/                     # テストファイル
│   ├── calendar.test.tsx         # カレンダー機能テスト
│   ├── goal-management.test.tsx  # 目標管理テスト
│   ├── multiple-tasks-visual.test.tsx # 複数タスク表示テスト
│   ├── statistics.test.tsx       # 統計機能テスト
│   ├── task-completion.test.tsx  # タスク完了テスト
│   ├── task-creation.test.tsx    # タスク作成テスト
│   ├── task-deletion.test.tsx    # タスク削除テスト
│   ├── task-editing.test.tsx     # タスク編集テスト
│   └── utils.ts                  # テストユーティリティ
├── public/                       # 静的ファイル
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                          # ソースコード
│   ├── app/                      # Next.js App Router
│   │   ├── favicon.ico          # ファビコン
│   │   ├── globals.css          # グローバルスタイル
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── page.tsx            # メインページ
│   ├── components/              # Reactコンポーネント
│   │   ├── Calendar.tsx         # カレンダービュー
│   │   ├── CompletionModal.tsx  # タスク完了モーダル
│   │   ├── DeleteConfirmModal.tsx # 削除確認モーダル
│   │   ├── Header.tsx          # ヘッダーコンポーネント（目標設定）
│   │   ├── TaskEditModal.tsx   # タスク編集モーダル
│   │   ├── TaskForm.tsx        # タスク作成フォーム
│   │   ├── TaskList.tsx        # タスク一覧
│   │   └── TaskModal.tsx       # タスク詳細モーダル
│   ├── types/                   # TypeScript型定義
│   │   └── index.ts            # 共通型定義
│   └── utils/                   # ユーティリティ関数
│       └── statistics.ts       # 統計計算関数
├── eslint.config.mjs           # ESLint設定
├── jest.config.ts              # Jest設定
├── jest.setup.ts               # Jestセットアップ
├── next.config.ts              # Next.js設定
├── postcss.config.mjs          # PostCSS設定
└── tsconfig.json               # TypeScript設定
```

## アーキテクチャ詳細

### 🏗️ システム構成

#### アプリケーション層 (`app/`)

**`layout.tsx` - ルートレイアウト**

- アプリケーション全体のレイアウト定義
- 多言語対応 (lang="ja")
- Google Fonts (Inter) の設定
- Chart.js の外部ライブラリ読み込み
- グラデーション背景の設定

**`page.tsx` - メインページ**

- アプリケーションのメイン画面とステート管理
- タスクの状態管理 (未完了/完了)
- 目標設定の管理 (目標スコア、試験日)
- LocalStorageとの連携
- 各種ハンドラー関数の定義

#### コンポーネント設計原則

1. **単一責任原則**: 1つのコンポーネントは1つの責任のみ
2. **Props Drilling回避**: 深いネストでの値渡しを避ける
3. **状態の局所化**: 状態は最も近い共通祖先で管理
4. **再利用性**: 汎用的なコンポーネントの作成

#### データフロー

```text
LocalStorage → useEffect → State → Components → Event Handlers → State → LocalStorage
```

##### タスク管理フロー

```text
TaskForm → onAddTask → page.tsx → State Update → TaskList → Display
```

##### タスク完了フロー

```text
TaskList → CompletionModal → onCompleteTask → State Update → Statistics Update
```

### 🎨 UI/UX設計原則

#### レスポンシブデザイン

- Tailwind CSSによるユーティリティファーストアプローチ
- モバイルファーストの設計

#### 視覚的フィードバック

- グラデーション背景 (`from-blue-400 to-purple-600`)
- カード型のレイアウト (`rounded-2xl shadow-lg`)
- 期限切れタスクの色分け表示

#### ユーザビリティ

- 確認モーダルによる誤操作防止
- 一括タスク作成による効率化
- カレンダービューによる視覚的な進捗確認

### 📈 パフォーマンス考慮事項

#### クライアントサイドレンダリング

- `'use client'`ディレクティブによるCSR
- LocalStorageによる高速データアクセス

#### バンドル最適化

- 動的インポートの活用 (必要に応じて)
- Tree shakingによる不要コードの除去

#### メモリ管理

- 適切なクリーンアップ処理
- イベントリスナーの適切な管理

## 主要コンポーネント

- 目標TOEICスコアの設定
- 試験日の設定
- 目標の保存と更新

### TaskForm (`components/TaskForm.tsx`)

- 新規タスクの作成
- 日付範囲指定による一括タスク作成
- カテゴリー選択（リスニング、リーディング、単語、文法、模試、その他）
- 期限の設定
- タスクの説明追加

### TaskList (`components/TaskList.tsx`)

- タスク一覧の表示
- タスクの完了処理
- タスクの編集・削除
- 期限切れタスクの強調表示
- 日付順ソート機能

### Calendar (`components/Calendar.tsx`)

- 月次カレンダーの表示
- タスクの日別表示
- 今日の強調表示
- 試験日の特別表示

### モーダルコンポーネント群

#### CompletionModal (`components/CompletionModal.tsx`)

- タスク完了時の詳細記録
- 学習時間の記録
- 難易度の記録
- 集中度の記録

#### TaskEditModal (`components/TaskEditModal.tsx`)

- 既存タスクの編集
- タイトル、カテゴリ、期限の更新
- 説明の追加・編集

#### DeleteConfirmModal (`components/DeleteConfirmModal.tsx`)

- タスク削除の確認ダイアログ
- 誤操作防止機能

#### TaskModal (`components/TaskModal.tsx`)

- タスクの詳細表示
- 完了データの確認

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. ブラウザでアクセス

```plaintext
http://localhost:3000
```

### 4. テストの実行

```bash
# 全テストの実行
npm test

# テストウォッチモード
npm run test:watch

# テストカバレッジの確認
npm run test:coverage
```

### 5. Firebase Emulator（開発環境）

```bash
# Firebase Emulatorの起動
npm run emulator

# Next.js + Emulator同時起動
npm run dev:emulator
```

Firebase設定については `docs/firebase-setup-guide.md` を参照してください。

## 主要機能

### タスク管理

- タスクの作成、編集、削除
- 一括タスク作成（日付範囲指定）
- カテゴリー別のタスク管理
- 期限切れタスクの警告表示
- タスクの詳細表示

### 目標設定・進捗管理

- 目標TOEICスコアの設定
- 試験日の設定
- 進捗の可視化
- 完了率の計算
- 残り日数の表示

### 学習記録・統計

- 学習時間の記録
- 難易度・集中度の記録
- 総学習時間の計算
- カテゴリー別統計
- 学習傾向の分析

### カレンダー機能

- 月次カレンダービュー
- タスクの日別表示
- 試験日の特別表示
- 視覚的な進捗確認

## データ保存

アプリケーションは段階的にLocalStorageからFirebaseに移行中です：

### 現在のデータ保存方式

- **既存データ**: ブラウザのLocalStorage
- **新データ**: Firebase Firestore（匿名認証）
- **移行機能**: 既存データの自動移行サポート

### データ移行プロセス

1. **移行検出**: 初回アクセス時にLocalStorageデータの存在を確認
2. **移行ダイアログ**: ユーザーに移行の確認
3. **匿名認証**: Firebase匿名ユーザーとして認証
4. **データ移行**: LocalStorageからFirestoreに一括移行
5. **検証**: 移行データの整合性確認
6. **切り替え**: Firestoreをプライマリデータソースに設定

### LocalStorage構成（移行前）

- **`toeicTasks`**: 未完了タスクの配列
- **`toeicCompletedTasks`**: 完了済みタスクの配列
- **`toeicGoals`**: 目標設定（スコア、試験日）

### Firestore構成（移行後）

```
users/{userId}/
├── profile/
│   └── goals (document)
└── tasks/
    ├── {taskId} (document)
    └── ...
```

- **認証**: Firebase匿名認証
- **セキュリティ**: ユーザー別データ分離
- **オフライン**: 自動同期とオフライン対応

### データ構造

```typescript
// タスク
interface Task {
  id: number;
  title: string;
  category: 'reading' | 'listening' | 'grammar' | 'vocabulary' | 'mock-test' | 'other';
  description?: string;
  dueDate: string; // YYYY-MM-DD形式
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  completionData?: {
    time: number;      // 学習時間（分）
    difficulty: string; // 難易度
    focus: string;     // 集中度
  };
}

// 目標設定
interface Goal {
  targetScore: number;
  examDate: string | null; // YYYY-MM-DD形式
}
```

## テスト環境

### テストフレームワーク

- **Jest 30.0.5**: テストランナー
- **Testing Library**: コンポーネントテスト
- **jsdom**: ブラウザ環境のシミュレーション

### テストカバレッジ

主要な機能に対するテストを実装：

- カレンダー機能のテスト
- 目標管理のテスト
- タスクCRUD操作のテスト
- 統計計算のテスト
- ユーティリティ関数のテスト

## 開発ガイドライン

### コーディング規約

- **TypeScript**: 厳格な型付けを使用
- **ESLint**: コード品質の維持
- **Prettier**: 一貫したコードフォーマット
- **コンポーネント**: 関数コンポーネント + Hooks
- **CSS**: Tailwind CSSのユーティリティクラス

### ファイル命名規約

- **コンポーネント**: PascalCase.tsx
- **型定義**: camelCase.ts
- **ユーティリティ**: camelCase.ts
- **テスト**: kebab-case.test.tsx

### 推奨開発フロー

1. 型定義の作成・更新
2. コンポーネントの実装
3. 単体テストの追加
4. 統合テストの実行
5. ESLintチェック

## 今後の拡張予定

### 🚀 機能拡張

#### 短期目標

- データバックアップ・同期機能
- 通知・リマインダー機能
- 学習統計の詳細分析
- PWA対応（オフライン機能）

#### 中長期目標

- **データバックアップ**: クラウド同期機能
- **通知機能**: タスクリマインダー
- **分析機能**: 学習傾向の可視化
- **ソーシャル機能**: 学習記録の共有

### 🔧 技術的改善

#### アーキテクチャ改善

- **状態管理**: Zustand/Reduxの導入
- **データベース**: Supabase/Firebaseの統合
- **レイヤー分離**: ビジネスロジックの分離
- **型安全性強化**: Zodによるランタイムバリデーション

#### パフォーマンス最適化

- React.memoによる最適化
- 仮想化による大規模データ対応
- コード分割とレイジーローディング
- キャッシュ戦略の実装

#### 品質向上

- **テストカバレッジ**: E2Eテストの追加
- **アクセシビリティ**: ARIA属性の強化
- **セキュリティ**: 入力値検証の強化
- **パフォーマンス監視**: Core Web Vitalsの改善

### 🏆 ベストプラクティス継続

#### コード品質維持

- TypeScriptによる型安全性の確保
- 一貫したコンポーネント設計
- Props interfaceの明確な定義
- 責任の明確な分離

#### 保守性向上

- 再利用可能なコンポーネント設計
- 設定ファイルの外部化
- ドキュメントの継続的更新
- テストの継続的改善

## ライセンス

このプロジェクトは学習目的で作成されています。

## 作成者

TOEIC Study Manager v1.0  
更新日: 2025年8月23日
