# 未コミット変更レビュー: Firebase Emulator 起動経路の変更

作成日: 2026-07-18
対象: 未コミット状態の差分

## レビュー結果

### 1. 中: Java 21 の解決方法が限定的で、従来動いていた環境を壊す可能性がある

- 対象箇所: [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L33-L66)
- 変更内容: JDK 21 を `JAVA_HOME`、macOS の `/usr/libexec/java_home`、Homebrew の固定パスから探すラッパーを追加している。
- 問題点: `java` コマンド自体の探索がないため、`PATH` 上では Java 21 が使えるが `JAVA_HOME` を設定していない環境や、SDKMAN! / asdf / 独自インストール構成では起動できない。
- 変更前との差: 変更前は [package.json](../package.json#L12-L13) の script から Firebase CLI を直接呼んでいたため、Java の解決は CLI と OS 標準の探索に委ねられていた。
- 想定再現条件: Linux / Windows 環境、または macOS でも Homebrew 固定パス以外で Java 21 を管理している開発環境。

### 2. 低: 追加された前提条件と実際のポート設定がドキュメントに反映されていない

- 対象箇所: [README.md](../README.md#L132-L163), [README.md](../README.md#L391-L399), [docs/firebase-setup-guide.md](./firebase-setup-guide.md#L60-L74), [docs/firebase-setup-guide.md](./firebase-setup-guide.md#L107-L126)
- 変更内容: emulator 起動が新しい Node ラッパー経由になり、JDK 21 が事実上の前提になった。
- 問題点: README とセットアップガイドには JDK 21 前提の記載がなく、セットアップガイド側はポート案内も実装とずれている。
- 実装上の正しい設定: [firebase.json](../firebase.json#L2-L17) と [src/lib/firebase.ts](../src/lib/firebase.ts#L41-L48) より、UI は 4001、Firestore は 8081、Auth は 9098 を使用する。

## 実装の全体像

- 変更の目的: `firebase-tools` を 15.24.0 に更新しつつ、Firebase Emulator 起動時に JDK 21 を自動設定する。
- 主な入口: [package.json](../package.json#L12-L14)
- 主な変更ファイル:
  - [package.json](../package.json)
  - [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs)
  - [package-lock.json](../package-lock.json)

## コードポインター付き解説

### [package.json](../package.json)

- [package.json](../package.json#L12-L14): `emulator` と `emulator:ui` を Firebase CLI 直呼びから Node ラッパー呼び出しへ変更。
- [package.json](../package.json#L36): `firebase-tools` を 14.14.0 から 15.24.0 へ更新。

### [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs)

- [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L6-L31): `java -version` の出力からメジャーバージョンを判定。
- [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L33-L66): JDK 21 の探索ロジック本体。
- [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L71-L73): JDK 21 が見つからない場合にエラー終了。
- [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L76-L85): `JAVA_HOME` と `PATH` を上書きした状態で `firebase emulators:start` を起動。
- [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L87-L99): 子プロセスの終了コードやシグナルを親へ引き継ぐ。

### [firebase.json](../firebase.json) と [src/lib/firebase.ts](../src/lib/firebase.ts)

- [firebase.json](../firebase.json#L2-L17): emulator の有効化対象とポート定義。
- [src/lib/firebase.ts](../src/lib/firebase.ts#L41-L48): 開発時に Auth を 9098、Firestore を 8081 に接続。

## エントリーポイントからの処理フロー

1. 開発者が `npm run emulator` または `npm run dev:emulator` を実行する。
2. 入口は [package.json](../package.json#L12-L14) で、Node が [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L1-L99) を起動する。
3. [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L33-L66) が Java 21 の候補を順に調べる。
4. 候補が見つからなければ [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L71-L73) で即終了する。
5. 見つかった場合は [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L76-L80) で `JAVA_HOME` と `PATH` を補正する。
6. 続いて [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L82-L85) が `firebase emulators:start` に元の引数を渡して起動する。
7. Firebase CLI は [firebase.json](../firebase.json#L2-L17) を読み、auth、firestore、ui のポートを確保する。
8. フロントエンドは [src/lib/firebase.ts](../src/lib/firebase.ts#L41-L48) で localhost:9098 と 8081 に接続する。

## 変更前後の挙動差分

### 変更前

- npm script から `firebase emulators:start` を直接実行していた。
- Java の解決は Firebase CLI と OS 標準の探索に委ねていた。

### 変更後

- npm script は必ず Node ラッパーを経由する。
- macOS で `/usr/libexec/java_home -v 21` か Homebrew の OpenJDK 21 がある環境では、既定 Java が 11 でも Java 21 に差し替えて起動できる。
- 一方で、探索先が固定化されたため、`PATH` ベースで Java 21 を提供している環境では回帰の可能性がある。

### ユーザー影響

- ローカル環境によっては、以前は起動できた `npm run emulator` が JDK 21 未検出で失敗する。
- ドキュメントどおりに操作しても、必要な前提条件や正しいポートが分からず、切り分けコストが上がる。

## 検証と前提

### 実行した確認

- `npm run emulator -- --help`
  - 新しいラッパー経由で Firebase CLI の help 表示まで到達することを確認した。
- `npm run emulator`
  - ローカルでは JDK 21 の自動解決は成功した。
  - 失敗理由は今回の変更そのものではなく、4001 / 9098 / 8081 が使用中だったためだった。

### 未確認事項

- Linux 環境での起動可否
- Windows 環境での起動可否
- SDKMAN! / asdf など PATH ベース管理環境での挙動

### 前提

- このレビューは 2026-07-18 時点の未コミット差分を対象にしている。
- 今後差分が更新された場合、この文書の内容も見直しが必要になる。

## 推奨対応

1. [scripts/run-firebase-emulator.mjs](../scripts/run-firebase-emulator.mjs#L33-L66) に `java` コマンドの PATH 探索を追加する。
2. [README.md](../README.md#L132-L163) と [docs/firebase-setup-guide.md](./firebase-setup-guide.md#L60-L74) に JDK 21 前提を明記する。
3. [docs/firebase-setup-guide.md](./firebase-setup-guide.md#L70-L74) と [docs/firebase-setup-guide.md](./firebase-setup-guide.md#L107-L126) のポート表記と起動コマンドを、現行実装に合わせて更新する。