# Yomiru 仕様凍結

## コンセプト

Yomiru は、電子書籍を文節ごとに中央表示する自動送り PWA リーダー。
視点固定で目の移動を減らし、寝ながらの読書、睡眠導入、ページめくり不要の体験を提供する。

## 確定事項

| 項目 | 決定 |
|---|---|
| プラットフォーム | PWA/Web。スマホで寝ながら使う想定 |
| 対応形式 | `.txt` / EPUB / 青空文庫。ルビ対応必須 |
| 表示方式 | 自動送り。秒/文節指定、睡眠ランプダウン |
| 文節分割 | 句読点・改行ベースのシンプル分割。MVPでは形態素解析なし |
| 認証/同期 | なし。IndexedDB ローカル完結 |
| サンプル | 著作権切れの青空文庫由来作品を同梱 |
| 公開範囲 | ポートフォリオ公開を視野に入れる |

## 対応形式と前処理

| 形式 | 前処理 |
|---|---|
| `.txt` | UTF-8 を試行し、失敗時は Shift_JIS。ファイル名を初期タイトルにする |
| EPUB | JSZip で展開し、`container.xml`、OPF、spine 順に章を抽出する |
| 青空文庫 | ヘッダ/フッタ/注記を除去し、ルビ記法を解析する |

### 青空文庫ルビ

- 明示形式: `｜常用漢字外《じょうようかんじがい》`
- 暗黙形式: `吾輩《わがはい》`
- 暗黙形式は直前の連続漢字 `/[一-龠々ヵヶ]+/` のみにルビを付与
- 注記 `［＃...］` は本文とルビトークンから除去
- 出力は plain text と `RubyToken[]`

## 表示方式

- 1文節を画面中央に表示
- 横書き中央寄せ
- Framer Motion でクロスフェード
- 表示速度は `displayDuration` 秒/文節
- フェード時間 `fadeMs` を差し引き、実静止時間を確保する
- タップ操作
  - センター短タップ: 一時停止/再開
  - 左1/3 / 右1/3: 前後文節
  - 上/下スワイプ: 速度 ±0.5秒
  - 長押し: 設定ドロワー
  - ESC/戻る: ライブラリへ

## 睡眠ランプダウン式

```ts
p = elapsedMs / (rampMinutes * 60000);
effectiveDuration = base * (1 + p * 2);
brightness = Math.max(0.2, 1 - p);
shouldPause = p >= 1.2;
```

- `effectiveDuration` は最終的に基本値の3倍まで減速
- `brightness` は黒オーバーレイの透明度計算に使う
- `shouldPause` が true になったら自動停止

## データモデル概要

### Book

- 書籍メタ情報
- title / author / format / importedAt / totalChunks / coverDataUrl / sourceHash
- `sourceHash` で重複インポートを防ぐ

### Chunk

- 文節単位の本文
- bookId / index / text / ruby / chapterIndex
- `id` は `${bookId}:${index}`

### RubyToken

- ルビ表示用トークン
- base / rt
- rt なしの場合は通常テキストとして描画

### ReadingState

- bookId ごとの読書進捗
- currentIndex / lastReadAt / speedSetting

### AppSettings

- アプリ全体設定
- fontSize / theme / sleepMode / sleepRampMinutes / displayDuration / fadeMs / seededSamples

## Dexie スキーマ

```ts
db.version(1).stores({
  books: "id, importedAt, sourceHash",
  chunks: "id, bookId, [bookId+index], chapterIndex",
  readingState: "bookId, lastReadAt",
  settings: "id",
});
```

## 体験仕様

| 項目 | 仕様 |
|---|---|
| 初回起動 | サンプル書籍を読み込める |
| ライブラリ | 書籍一覧、インポート、削除、読書再開 |
| リーダー | 文節中央表示、自動送り、操作オーバーレイ |
| 設定 | 速度、文字サイズ、テーマ、睡眠モード、フェード |
| 進捗保存 | 5秒ごと、または操作時に IndexedDB 保存 |

## テーマ

| theme | bg | fg | 用途 |
|---|---|---|---|
| light | `#fafaf7` | `#1a1a1a` | 昼 |
| dark | `#0d0d0d` | `#e6e6e6` | 夜 |
| lamp | `#0a0000` | `#ff3a3a` | 睡眠前・暗所 |

## 非機能要件

- PWA としてインストール可能
- Offline でもサンプル読書が継続できる
- 書籍データは IndexedDB に保存し、サーバーへ送らない
- Lighthouse Mobile 目標
  - Performance 90以上
  - PWA pass
  - SEO 100
  - Best Practices 100
  - Accessibility 95以上
- A11y
  - 現在文節を `aria-live="polite"` で通知
  - ボタンに `aria-label`
  - `prefers-reduced-motion` でフェード短縮
  - キーボードだけで読書操作を完結できる
