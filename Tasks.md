# Yomiru Tasks

## チェックリスト

- [x] T-001 プロジェクト初期化（Next.js 15 + Bun + Tailwind v4） — Bun 前提の Next.js / TypeScript / Tailwind / Vitest 基盤を作成
- [x] T-002 ドキュメント雛形（AGENTS / CLAUDE / spec / README / Tasks） — プロジェクト指示、仕様、README、タスク一覧を整備
- [x] T-003 ディレクトリ骨格と型定義 — `src` 配下の責務別ディレクトリと主要データ型を追加
- [x] T-004 Dexie導入とリポジトリ層 — IndexedDB スキーマと CRUD リポジトリを実装
- [x] T-005 設定ストア（zustand + Dexie同期） — アプリ設定を zustand と Dexie で同期保存
- [x] T-006 文節分割エンジン（純関数） — 句読点と改行ベースの文節分割ロジックを実装
- [x] T-007 青空文庫ルビパーサ — 青空文庫の明示/暗黙ルビと注記除去を実装
- [ ] T-008 .txt / 青空文庫テキストパーサ — テキスト読込、文字コード判定、青空文庫前処理を実装
- [ ] T-009 EPUBパーサ（jszip） — EPUB 展開、OPF 解析、章抽出、ルビ変換を実装
- [ ] T-010 パーサーWorker — txt / aozora / epub 解析を Worker 経由で実行
- [ ] T-011 文節分割Worker — 大型書籍の文節分割と RubyToken 対応を Worker 化
- [ ] T-012 インポートフロー（ライブラリページ） — ファイル取込、重複防止、DB 保存、一覧表示を実装
- [ ] T-013 サンプル書籍同梱 — 青空文庫由来サンプルと初回投入処理を追加
- [ ] T-014 リーダーストアと再生エンジン — 再生状態、タイマー、進捗保存を実装
- [ ] T-015 ChunkStage（中央表示+フェード） — 文節中央表示と RubyText、クロスフェードを実装
- [ ] T-016 リーダーページ（コントロール統合） — Reader UI、タップ/スワイプ操作、設定反映を統合
- [ ] T-017 睡眠最適化モード — 減速、暗化、自動停止のランプダウン計算を実装
- [ ] T-018 設定ページ — 速度、文字サイズ、テーマ、睡眠設定、データ削除を実装
- [ ] T-019 PWA化（next-pwa + manifest + icons） — manifest、アイコン、Service Worker を設定
- [ ] T-020 オフライン挙動とサンプル即時利用 — Offline でもサンプル読書できるプリキャッシュを整備
- [ ] T-021 アクセシビリティと操作補助 — キーボード操作、aria、reduced motion を追加
- [ ] T-022 shadcn風UIブラッシュアップ — Button / Slider / Switch などの UI 部品を整備
- [ ] T-023 OGP・メタ情報・LP仕上げ — LP、OGP、SEO メタ情報、OG 画像を整備
- [ ] T-024 サンプル書籍カバー自動生成 — 書籍カバー生成とライブラリ表示を改善
- [ ] T-025 主要ロジックのユニットテスト網羅 — segmenter、ruby、parser、DB、reader のテストを拡充
- [ ] T-026 手動QAチェックリスト — スマホ、PWA、Offline、操作系の手動 QA 手順を作成
- [ ] T-027 Lighthouse / バンドル最適化 — Mobile Performance、PWA、SEO、A11y 目標へ調整
- [ ] T-028 Vercelデプロイ設定 — Vercel 手順、Build/Install Command、README 欄を整備
- [ ] T-029 Obsidian Vault連携 — Vault 側メモ、ADR、調査メモ、MOC 参照を作成
- [ ] T-030 最終仕上げ・READMEブラッシュ — 第三者に見せられる README とスクショ導線へ仕上げ

## コミットメッセージ運用

- 形式: `T-XXX: 概要`
- 例: `T-002: documentation skeleton (CLAUDE/AGENTS/spec/README/Tasks)`
- 1タスク=1コミット
- 複数タスクを1コミットにまとめない
- push 禁止
