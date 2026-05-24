"use client";

import type { AppSettings } from "@/types";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";

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

        <Slider
          label="速度"
          value={settings.displayDuration}
          min={0.5}
          max={10}
          step={0.1}
          displayValue={`${settings.displayDuration.toFixed(1)}秒/文節`}
          onChange={(v) => onUpdate({ displayDuration: v })}
        />

        <Slider
          label="文字サイズ"
          value={settings.fontSize}
          min={24}
          max={80}
          step={1}
          displayValue={`${settings.fontSize}px`}
          onChange={(v) => onUpdate({ fontSize: v })}
        />

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

        <Switch
          label="睡眠モード"
          checked={settings.sleepMode}
          onChange={(v) => onUpdate({ sleepMode: v })}
        />

        {settings.sleepMode && (
          <Slider
            label="減速時間"
            value={settings.sleepRampMinutes}
            min={1}
            max={30}
            step={1}
            displayValue={`${settings.sleepRampMinutes}分`}
            onChange={(v) => onUpdate({ sleepRampMinutes: v })}
          />
        )}

        <button onClick={onClose} className="mt-2 text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
          閉じる
        </button>
      </div>
    </div>
  );
}
