"use client";

import type { AppSettings } from "@/types";

interface SettingsDrawerProps {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onClose: () => void;
}

export function SettingsDrawer({ settings, onUpdate, onClose }: SettingsDrawerProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full bg-zinc-900 rounded-t-2xl p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-zinc-100">表示設定</h2>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-400 text-sm">速度: {settings.displayDuration.toFixed(1)}秒/文節</span>
          <input
            type="range" min={0.5} max={10} step={0.1}
            value={settings.displayDuration}
            onChange={(e) => onUpdate({ displayDuration: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-400 text-sm">文字サイズ: {settings.fontSize}px</span>
          <input
            type="range" min={24} max={80} step={1}
            value={settings.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-zinc-400 text-sm">テーマ</span>
          <div className="flex gap-2">
            {(["light", "dark", "lamp"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onUpdate({ theme: t })}
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

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.sleepMode}
            onChange={(e) => onUpdate({ sleepMode: e.target.checked })}
            className="accent-indigo-500 w-4 h-4"
          />
          <span className="text-zinc-300 text-sm">睡眠モード</span>
        </label>

        {settings.sleepMode && (
          <label className="flex flex-col gap-1">
            <span className="text-zinc-400 text-sm">減速時間: {settings.sleepRampMinutes}分</span>
            <input
              type="range" min={1} max={30} step={1}
              value={settings.sleepRampMinutes}
              onChange={(e) => onUpdate({ sleepRampMinutes: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </label>
        )}

        <button onClick={onClose} className="mt-2 text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
          閉じる
        </button>
      </div>
    </div>
  );
}
