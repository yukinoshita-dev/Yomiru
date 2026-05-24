"use client";

import { Button } from "@/components/ui/Button";

interface DeleteDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDialog({ title, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl p-6 max-w-sm w-full flex flex-col gap-4">
        <p className="text-zinc-100">「{title}」を削除しますか？この操作は取り消せません。</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>キャンセル</Button>
          <Button variant="danger" onClick={onConfirm}>削除</Button>
        </div>
      </div>
    </div>
  );
}
