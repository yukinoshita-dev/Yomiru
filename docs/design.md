# Yomiru 設計ドック

spec.md の確定事項を踏まえ、実装に落とすための設計判断と内部構造をまとめる。
仕様の文言で揺れた場合は spec.md を正、本書を補足として扱う。

## 1. アーキテクチャ全体像

```
+---------------------------+
|  UI Layer (App Router)    |  src/app/**
|   - Library page          |
|   - Reader page           |
|   - Settings page         |
+-------------+-------------+
              | hooks / stores
+-------------v-------------+
|  Feature Layer            |  src/features/**
|   - reader engine         |
|   - import flow           |
|   - settings store        |
+-------------+-------------+
              | pure logic / DTO
+-------------v-------------+
|  Domain Logic Layer       |  src/lib/**
|   - segmenter             |
|   - ruby (aozora)         |
|   - parsers (txt/epub)    |
|   - sleepRamp             |
|   - workers/*             |
+-------------+-------------+
              | repository boundary
+-------------v-------------+
|  Persistence Layer        |  src/lib/db/**
|   - Dexie schema          |
|   - repositories          |
+---------------------------+
```

- UI 層は Dexie や File API を直接触らない
- Domain Logic 層はすべて pure function ベースでテスタブル
- I/O は repository / worker / browser API の3境界に閉じる

## 2. ディレクトリ責務

| パス | 役割 |
|---|---|
| `src/app/` | App Router のページ・レイアウト・グローバル CSS |
| `src/app/(library)/` | ライブラリページ（書籍一覧・インポート・削除） |
| `src/app/reader/[bookId]/` | リーダーページ（中央表示・操作・睡眠モード） |
| `src/app/settings/` | 設定ページ |
| `src/components/` | 汎用 UI（Button / Slider / Switch / RubyText など） |
| `src/features/reader/` | リーダー再生エンジン・ストア・フック |
| `src/features/library/` | インポートフロー・ライブラリ操作 |
| `src/features/settings/` | 設定ストア |
| `src/lib/db/` | Dexie スキーマと repositories |
| `src/lib/segmenter/` | 文節分割（純関数） |
| `src/lib/ruby/` | 青空文庫ルビ解析（純関数） |
| `src/lib/parsers/` | txt / aozora / epub のパーサ |
| `src/lib/sleepRamp/` | 睡眠ランプダウン計算（純関数） |
| `src/lib/workers/` | Web Worker 実装と postMessage 型 |
| `src/lib/utils/` | エンコーディング判定など補助 |
| `src/types/` | ドメイン共有の型定義 |
| `public/samples/` | サンプル書籍（青空文庫由来） |

## 3. データモデル

spec.md の定義をベースに、TS 型として次を採用する。

```ts
type BookFormat = "txt" | "aozora" | "epub";

interface Book {
  id: string;            // ULID
  title: string;
  author?: string;
  format: BookFormat;
  importedAt: number;    // epoch ms
  totalChunks: number;
  coverDataUrl?: string;
  sourceHash: string;    // 重複インポート防止
}

interface Chunk {
  id: string;            // `${bookId}:${index}`
  bookId: string;
  index: number;
  text: string;
  ruby?: RubyToken[];
  chapterIndex?: number;
}

interface RubyToken {
  base: string;
  rt?: string;
}

interface ReadingState {
  bookId: string;
  currentIndex: number;
  lastReadAt: number;
  speedSetting?: number;
}

interface AppSettings {
  id: "default";
  fontSize: number;
  theme: "light" | "dark" | "lamp";
  sleepMode: boolean;
  sleepRampMinutes: number;
  displayDuration: number; // 秒/文節
  fadeMs: number;
  seededSamples: boolean;
}
```

### Dexie スキーマ

```ts
db.version(1).stores({
  books: "id, importedAt, sourceHash",
  chunks: "id, bookId, [bookId+index], chapterIndex",
  readingState: "bookId, lastReadAt",
  settings: "id",
});
```

複合インデックス `[bookId+index]` で連続読みのレンジ取得を高速化する。

## 4. 再生エンジン

`src/features/reader/useReaderEngine.ts` を中心に、次の状態を保持する。

```ts
type ReaderStatus = "idle" | "playing" | "paused" | "rampDownComplete";

interface ReaderEngineState {
  status: ReaderStatus;
  currentIndex: number;
  startedAt: number | null;
  elapsedMs: number;
}
```

- `setInterval` ではなく `requestAnimationFrame` ベースで経過時間を更新
- `displayDuration` と `fadeMs` から実静止時間を計算
- 5秒ごと or 操作時に IndexedDB へ `ReadingState` を保存

## 5. 睡眠ランプダウン

spec.md の計算式に従い、純関数 `computeSleepRamp(elapsedMs, base, rampMinutes)` を提供する。

```ts
interface SleepRampResult {
  effectiveDuration: number;
  brightness: number;
  shouldPause: boolean;
}
```

戻り値のみ依存させ、副作用なし。UI 層はこの結果を黒オーバーレイ透明度・タイマー長さ・自動停止判定に利用する。

## 6. 文節分割

`segment(text: string, ruby?: RubyToken[]): Chunk[]` を純関数として実装。

- 句読点（、。！？!?）改行・空行で分割
- 文末記号は前の文節に含める
- 半角・全角空白は分割境界としては扱わない
- ルビトークンを保持したまま分割し、`RubyToken[]` を文節に再アサインする
- 文節空文字は除外

MVP では形態素解析を行わない。テストで境界ケースを固定する。

## 7. ルビ仕様

青空文庫ルビは `src/lib/ruby/aozoraRuby.ts` で次の順序で解析する。

1. 注記 `［＃...］` を除去
2. 明示形式 `｜ベース《ルビ》` を抽出
3. 暗黙形式 `漢字列《ルビ》` を抽出
   - 直前の連続する `[一-龠々ヵヶ]+` のみにルビ付与
4. 残った文字列を plain text として返す
5. 結果は `{ text: string, ruby: RubyToken[] }`

## 8. パーサ戦略

| 形式 | 入口 | 出口 |
|---|---|---|
| `.txt` | `parseTxt(buf): { title, text, ruby }` | text + 空ルビ |
| 青空文庫 | `parseAozora(buf): { title, text, ruby }` | text + RubyToken[] |
| EPUB | `parseEpub(buf): { title, author, chapters }` | 章ごとの text + ruby |

- 文字コード判定: まず UTF-8 として decode、エラー時 Shift_JIS に fallback
- EPUB は JSZip で展開し、`META-INF/container.xml` → OPF → spine の順で章を抽出
- ルビ要素 `<ruby><rb>X</rb><rt>Y</rt></ruby>` は RubyToken に正規化

## 9. ワーカー戦略

CPU を要する処理はメインスレッドを塞がないために Worker 化する。

| Worker | 入力 | 出力 |
|---|---|---|
| `parserWorker` | `{ format, buffer }` | `{ title, author?, chapters }` |
| `segmenterWorker` | `{ chapters, withRuby }` | `Chunk[]` |

- postMessage で構造化複製、ArrayBuffer は transferable に
- 失敗時は `{ kind: "error", message }` を返す

## 10. インポートフロー

1. UI でファイル選択
2. SHA-256 で `sourceHash` を計算し、Dexie に同一 hash が無いか確認
3. `parserWorker` に投げて中間表現を得る
4. `segmenterWorker` に投げて `Chunk[]` を得る
5. Dexie に `Book` と `Chunk[]` を書き込む
6. ライブラリ画面に反映

## 11. 設定ストア

zustand store と Dexie の `settings` テーブルを双方向同期する。

- 初回ロード時: Dexie 読込 → store にハイドレート
- store 更新時: debounce 200ms で Dexie 書込
- store の値はリアクティブに各画面へ反映

## 12. アクセシビリティと操作

| 操作 | キーボード | タップ |
|---|---|---|
| 一時停止/再開 | Space | センター短タップ |
| 前へ | ←  | 左1/3タップ |
| 次へ | → | 右1/3タップ |
| 速度↑ | ↑ | 上スワイプ |
| 速度↓ | ↓ | 下スワイプ |
| 設定 | S | 長押し |
| ライブラリへ | ESC | (戻る) |

- `aria-live="polite"` で現在文節を通知
- `prefers-reduced-motion` でフェード時間を短縮（`fadeMs` を 0〜80ms に圧縮）

## 13. PWA / Offline

- `@ducanh2912/next-pwa` を使用
- ランタイムキャッシュ: アプリシェル + サンプル書籍
- IndexedDB データはオフラインでも利用可
- インストール可能な manifest と iOS 用 apple-touch-icon を整備

## 14. テスト方針

- ユニットテスト（Vitest）
  - segmenter / aozoraRuby / sleepRamp / parsers / repositories / readerEngine
  - IndexedDB は `fake-indexeddb` を使用
- 統合テスト（Vitest + RTL）
  - ライブラリ → リーダー遷移を最小限のシナリオで検証
- 手動 QA（後述の T-026）
  - スマホ実機での操作・PWA インストール・Offline 確認

## 15. 非機能ターゲット

| 指標 | 目標 |
|---|---|
| Lighthouse Performance (Mobile) | 90+ |
| Lighthouse PWA | pass |
| Lighthouse SEO | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse Accessibility | 95+ |
| 初回ロード（モバイル4G想定） | TBC（T-027 で測定） |

## 16. Out of scope

- アカウント機能 / クラウド同期
- 文字列の検索・栞・ハイライト
- 縦書き表示（将来検討）
- 音声読み上げ
- 商用本 DRM 対応
