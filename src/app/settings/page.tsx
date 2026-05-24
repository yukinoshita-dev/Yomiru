"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
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
          <Slider
            label="速度"
            value={settings.displayDuration}
            min={0.5}
            max={10}
            step={0.1}
            displayValue={`${settings.displayDuration.toFixed(1)}秒/文節`}
            onChange={(v) => update({ displayDuration: v })}
          />
          <Slider
            label="フェード"
            value={settings.fadeMs}
            min={100}
            max={600}
            step={50}
            displayValue={`${settings.fadeMs}ms`}
            onChange={(v) => update({ fadeMs: v })}
          />
        </section>

        {/* Display */}
        <section className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">表示</h2>
          <Slider
            label="文字サイズ"
            value={settings.fontSize}
            min={24}
            max={80}
            step={1}
            displayValue={`${settings.fontSize}px`}
            onChange={(v) => update({ fontSize: v })}
          />
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
          <Switch
            label="有効にする"
            checked={settings.sleepMode}
            onChange={(v) => update({ sleepMode: v })}
          />
          {settings.sleepMode && (
            <Slider
              label="減速時間"
              value={settings.sleepRampMinutes}
              min={1}
              max={30}
              step={1}
              displayValue={`${settings.sleepRampMinutes}分`}
              onChange={(v) => update({ sleepRampMinutes: v })}
            />
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
