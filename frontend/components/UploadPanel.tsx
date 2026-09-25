"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadPanelProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  fileName: string | null;
}

const ACCEPTED = [".dwg", ".dxf", ".dwt", ".dws"];

export default function UploadPanel({ onFileSelected, isLoading, error, fileName }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200
        ${isDragging ? "border-draft-cyan bg-draft-cyan/5" : "border-blueprint-700 hover:border-blueprint-600"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-2"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-draft-cyan border-t-transparent" />
            <p className="text-sm text-ink-300">Parsing drawing…</p>
          </motion.div>
        ) : fileName ? (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-draft-cyan">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-mono text-xs text-ink-100">{fileName}</p>
            <p className="text-xs text-ink-500">Click to upload a different file</p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ink-500">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-ink-300">Drop a site plan, or click to browse</p>
            <p className="font-mono text-xs text-ink-500">.dwg · .dxf · .dwt · .dws</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded border border-draft-coral/30 bg-draft-coral/10 px-3 py-2 text-xs text-draft-coral"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
