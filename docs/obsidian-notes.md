# Yomiru プロジェクトノート

## 概要
文節ごとに読む自動送り PWA リーダー。Next.js 15 / React 19 / IndexedDB / zustand 構成。

## リポジトリ
パス: F:/Hobby/Book

## 技術的決定（ADR）

### ADR-001: IndexedDB をローカル完結に選択
認証不要・同期不要の読書アプリとして、Dexie + IndexedDB でローカル完結を選択。
オフライン動作と PWA との相性が良い。

### ADR-002: 文節分割を純関数で実装
segmenter を副作用のない純関数として実装し、Worker から呼び出す構造にした。
テストしやすく、メインスレッドをブロックしない。

### ADR-003: フォーマット検出をプリフライトで実施
.txt ファイルのアップロード時に最初の 1KB を読んで青空文庫マーカーを検出。
MIME ではなく内容ベースで判定することで正確性を高めた。

## 実装済みモジュール
- src/lib/segmenter/ - 文節分割エンジン
- src/lib/ruby/aozoraRuby.ts - 青空文庫ルビパーサ
- src/lib/parsers/ - txt / aozora / epub パーサ
- src/lib/db/repositories/ - Dexie リポジトリ層
- src/features/reader/useReaderEngine.ts - 自動送りエンジン
- src/lib/reader/sleepRamp.ts - 睡眠ランプダウン計算
