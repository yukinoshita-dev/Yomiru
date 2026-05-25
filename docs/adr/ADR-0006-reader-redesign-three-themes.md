# ADR-0006: リーダー画面の3テーマデザイン刷新

**日付**: 2026-05-26  
**ステータス**: 承認済み  
**担当**: T-037

---

## コンテキスト

現在のリーダー画面（`src/app/reader/[bookId]/page.tsx`）は機能的だが視覚的に最小限：
- 中央に文節1つだけ表示
- 半透明オーバーレイで進捗バーのみ
- 設定ドロワーで全操作を集約

`F:\Hobby\Yomiru (1)\readers` および `tsx/src/components/Reader{Lamp,Dark,Light}.tsx` に、
3つのリーダーデザインバリアントが用意されている。これを既存テーマ設定（`settings.theme: 'light' | 'dark' | 'lamp'`）と連動させ、フルリデザインする。

## 各テーマの設計意図

| テーマ | 用途 | 視覚特徴 |
|---|---|---|
| **Lamp（行燈）** | 就寝前・暗所 | 漆黒＋暖色グロー、文節がろうそく色で輝く |
| **Dark（墨）** | 深夜・集中 | 冷色無彩色・letterbox感・微細十字線で視点固定 |
| **Light（紙と墨）** | 昼・座読 | 和紙テクスチャ＋墨＋朱、ルビ表示前提 |

## 決定

3テーマすべてを実装し、`settings.theme` で切り替える。
共通レイアウト（ヘッダー・進捗バー・サイドレール・ステージ・コントロールバー）はテーマで色だけ差し替える戦略。

### コンポーネント構成

| コンポーネント | 役割 | 新規/既存 |
|---|---|---|
| `GestureLayer` | タップ/スワイプ/長押し（不可視オーバーレイ） | 既存 `ReaderControls.tsx` をリネーム |
| `ReaderHeader` | 書籍タイトル・章・☆/⚙/✕アイコン | 新規 |
| `ReaderProgressBar` | スリム進捗バー（ヘッダー直下） | 既存 `ProgressBar.tsx` を刷新 |
| `ReaderStage` | 5行縦読みステージ（前2/前1/現在/次1/次2） | 既存 `ChunkStage.tsx` を刷新 |
| `ReaderSideRails` | 左:章番号・右:ETA・進捗％ | 新規 |
| `ReaderControlBar` | 底部コントロール（再生/速度/睡眠カウントダウン） | 新規 |
| `SettingsDrawer` | 設定ドロワー（テーマ・速度・文字・睡眠） | 既存維持 |

### テーマパレット定義

`src/lib/reader/themePalette.ts` に集約：

```ts
export const THEME_PALETTE = {
  lamp:  { bg: '#0a0807', fg: '#e8d9c0', accent: '#e8a96a', bright: '#fbe7c2', ghost: '#e8d9c0' },
  dark:  { bg: '#08080a', fg: '#d4d6db', accent: '#e8eaef', bright: '#f2f4f8', ghost: '#d4d6db' },
  light: { bg: '#f4ecd8', fg: '#1a1614', accent: '#a8453a', bright: '#1a1614', ghost: '#1a1614' },
};
```

実際のスタイリングは Tailwind v4 `@theme` トークンで実現。`globals.css` に追加で
`coal/fog/snow/frost`（Dark用）、`washi/washi-soft/sumi/vermillion`（Light用）、
`dark-reveal/light-reveal` の keyframe を定義する。

### 実データ連携

| 表示要素 | データソース |
|---|---|
| 書籍タイトル・著者 | `Book` メタを Dexie からロード |
| 章番号 | `chunk.chapterIndex` を漢数字（一/二/三）に変換 |
| 進捗 % | `(idx + 1) / totalChunks * 100` |
| ETA | `(totalChunks - idx - 1) * displayDuration` → mm:ss |
| WPM (文節/分) | `Math.round(60 / displayDuration)` |
| 睡眠カウントダウン | `sleepRampMinutes * 60 - elapsedSec` → mm:ss |
| 経過時間（ヘッダー） | 読書開始からの累計（簡易実装：mount時刻基準） |

### ジェスチャーと操作の維持

既存のキーボードショートカット・タップ・スワイプ・長押し→設定ドロワーは維持。
新しい底部コントロールバーは可視化された操作で、これらと併用可能。

## 検討した代替案

| 案 | 評価 |
|---|---|
| **全テーマ共通レイアウト＋色だけ差替** | ✅ コード重複なし・メンテ容易 |
| 3つのまるごと別ファイルReaderコンポーネント | コード3重・修正がDRYでない |
| Lampのみ実装、Dark/Lightは後回し | 設定UIの3択と整合しない |

## 非影響

- データモデル変更なし（Book/Chunk/ReadingState/AppSettings は不変）
- リーダーエンジン（`useReaderEngine`）の挙動は変わらない
- 設定の保存形式・同期方式は変わらない

## 検証

`bun run build` がエラーゼロで完了すること。
`bun run test` の 87 テストがすべて緑のままであること。  
ローカル `bun run dev` で `/reader/[bookId]` を 3 テーマすべてで表示確認。
