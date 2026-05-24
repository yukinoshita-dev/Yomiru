# Yomiru - デプロイ手順

## Vercel デプロイ（推奨）

### 初回デプロイ
1. Vercel アカウントを作成 (vercel.com)
2. 「New Project」→ Git リポジトリを接続
3. Framework Preset: Next.js（自動検出）
4. Build Command: bun run build（または空白でデフォルト）
5. Install Command: bun install
6. Output Directory: .next（デフォルト）
7. 「Deploy」をクリック

### 環境変数
特に設定は不要（認証なし・外部APIなし・全てローカル完結）

### 再デプロイ
git push するたびに自動デプロイされる（push 禁止ルールに注意）

## ローカルビルド確認

bun run build
bun run start

## Docker（スタンドアロン）
VERCEL 環境変数を設定しない場合、output: standalone でビルドされる。
Docker イメージを使う場合: .next/standalone をコピーして node server.js で起動。
