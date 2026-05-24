# Yomiru

![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?style=flat-square)
![Powered by Bun](https://img.shields.io/badge/Powered%20by-Bun-f6dece?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-2f855a?style=flat-square)

## 文節ごとに読む、寝ながら読書PWA 📖

Yomiru は、電子書籍を文節ごとに中央表示する自動送りリーダー。
ページをめくらず、視点を動かさず、寝る前でも読み進められる PWA。

## スクリーンショット

> 現在スクリーンショットは未撮影です。公開前に実画面へ差し替え予定。

| 画面 | 撮影状況 | 配置予定 |
|---|---|---|
| ライブラリ | 未撮影 | `docs/screenshots/library.png` |
| リーダー | 未撮影 | `docs/screenshots/reader.png` |
| 睡眠モード | 未撮影 | `docs/screenshots/sleep-mode.png` |

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

| 作品 | 著者 | 出典 | 青空文庫URL |
|---|---|---|---|
| 羅生門 | 芥川龍之介 | 青空文庫 | https://www.aozora.gr.jp/cards/000879/card127.html |
| 注文の多い料理店 | 宮沢賢治 | 青空文庫 | https://www.aozora.gr.jp/cards/000081/card43754.html |
| こころ | 夏目漱石 | 青空文庫 | https://www.aozora.gr.jp/cards/000148/card773.html |

## ライセンス

MIT
