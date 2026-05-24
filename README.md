# Yomiru

## 文節ごとに読む、寝ながら読書PWA 📖

Yomiru は、電子書籍を文節ごとに中央表示する自動送りリーダー。
ページをめくらず、視点を動かさず、寝る前でも読み進められる PWA。

## スクリーンショット

> 後で実画面に差し替え

| ライブラリ | リーダー | 睡眠モード |
|---|---|---|
| `docs/screenshots/library.png` | `docs/screenshots/reader.png` | `docs/screenshots/sleep-mode.png` |

## 技術ハイライト

- Next.js 15 / React 19 / TypeScript 5.6
- Tailwind CSS v4 による軽量 UI
- Dexie + IndexedDB によるローカル完結の書籍管理
- zustand による読書状態と設定管理
- Framer Motion による文節クロスフェード
- `@ducanh2912/next-pwa` による PWA / Offline 対応
- txt / EPUB / 青空文庫ルビ記法対応
- Vitest 4 による文節分割、ルビ解析、DB 層のテスト

## 主な機能

- 文節ごとの自動送り
- 秒/文節での速度調整
- 睡眠ランプダウンによる自動減速と暗化
- タップ、スワイプ、キーボード操作
- ローカル書籍インポート
- IndexedDB への進捗保存
- PWA インストール

## ローカル起動

```bash
bun install
bun run dev
```

開発サーバー起動後、ブラウザで `http://localhost:3000` を開く。

## よく使うコマンド

```bash
bun run lint
bun run test:run
bun run build
```

## 動作要件

- モダンブラウザ
  - Chrome
  - Edge
  - Safari
  - Firefox
- PWA 対応ブラウザ推奨
- IndexedDB 有効

## デプロイURL

Vercel にてデプロイ予定。
手順は [docs/deploy.md](docs/deploy.md) を参照。

## 青空文庫出典表記

サンプル書籍追加時に、作品名、著者、底本、青空文庫URLを記載する。

| 作品 | 著者 | 出典 | 備考 |
|---|---|---|---|
| 未追加 | 未追加 | 未追加 | T-013 で追記 |

## ライセンス

MIT
