"use client";

import { useRef, useState } from "react";

interface ImportDropzoneProps {
  importing: boolean;
  onFile: (file: File) => void;
}

export function ImportDropzone({ importing, onFile }: ImportDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file) onFile(file);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        dragging ? "border-indigo-400 bg-indigo-950/30" : "border-zinc-600 hover:border-zinc-400"
      } ${importing ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.epub"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-zinc-400 text-sm">
        {importing ? "インポート中..." : ".txt / .epub をドロップ、またはクリックして選択"}
      </p>
    </div>
  );
}
