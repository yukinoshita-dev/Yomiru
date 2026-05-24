"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/Button";
import { useSettingsStore } from "@/features/settings/store";
import { useHydrateSettings } from "@/features/settings/useSettings";
import { db } from "@/lib/db/database";

export default function SettingsPage() {
  useHydrateSettings();
  const { settings, update, reset } = useSettingsStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDeleteAll() {
    await db.transaction("rw", db.books, db.chunks, db.readingState, async () => {
      await db.books.clear();
      await db.chunks.clear();
      await db.readingState.clear();
    });
    // Reset seededSamples so samples seed again on next library visit
    update({ seededSamples: false });
    toast.success("データを削除しました");
    setConfirmDelete(false);
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 p-4 max-w-2xl mx-auto">
      <Toaster position="top-center" theme="dark" richColors />
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">設定</h1>
        <nav className="flex gap-4 text-sm text-zinc-400">
          <Link href="/library" className="hover:text-zinc-100 transition-colors">ライブラリ</Link>
        </nav>
      </header>

      <div className="flex flex-col gap-6">
        {/* Speed */}
        <section className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">再生</h2>
          <label className="flex flex-col gap-1">
            <span className="text-zinc-300 text-sm">速度: {settings.displayDuration.toFixed(1)} 秒/文節</span>
            <input
              type="range" min={0.5} max={10} step={0.1}
              value={settings.displayDuration}
              onChange={(e) => update({ displayDuration: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-zinc-300 text-sm">フェード: {settings.fadeMs} ms</span>
            <input
              type="range" min={100} max={600} step={50}
              value={settings.fadeMs}
              onChange={(e) => update({ fadeMs: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </label>
        </section>

        {/* Display */}
        <section className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">表示</h2>
          <label className="flex flex-col gap-1">
            <span className="text-zinc-300 text-sm">文字サイズ: {settings.fontSize} px</span>
            <input
              type="range" min={24} max={80} step={1}
              value={settings.fontSize}
              onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-300 text-sm">テーマ</span>
            <div className="flex gap-2">
              {(["light", "dark", "lamp"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                    settings.theme === t
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sleep mode */}
        <section className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">睡眠モード</h2>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.sleepMode}
              onChange={(e) => update({ sleepMode: e.target.checked })}
              className="accent-indigo-500 w-4 h-4"
            />
            <span className="text-zinc-300 text-sm">有効にする</span>
          </label>
          {settings.sleepMode && (
            <label className="flex flex-col gap-1">
              <span className="text-zinc-300 text-sm">減速時間: {settings.sleepRampMinutes} 分</span>
              <input
                type="range" min={1} max={30} step={1}
                value={settings.sleepRampMinutes}
                onChange={(e) => update({ sleepRampMinutes: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </label>
          )}
        </section>

        {/* Danger zone */}
        <section className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide">データ管理</h2>
          {!confirmDelete ? (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              データを全削除
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-zinc-300 text-sm">書籍・チャンク・進捗を全て削除します。設定は保持されます。本当に削除しますか？</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setConfirmDelete(false)}>キャンセル</Button>
                <Button variant="danger" onClick={handleDeleteAll}>削除する</Button>
              </div>
            </div>
          )}
          <Button variant="secondary" onClick={reset}>設定をリセット</Button>
        </section>
      </div>
    </main>
  );
}
