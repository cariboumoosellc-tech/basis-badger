"use client";

import { useCallback, useRef, useState } from "react";

type UploadZoneProps = {
  onFileSelected: (file: File) => void;
  isBusy?: boolean;
};

const formatBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[index]}`;
};

export default function UploadZone({ onFileSelected, isBusy = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      setFileName(file.name);
      setFileSize(file.size);
      // Set guest_audit cookie and redirect to /dashboard after upload
      if (typeof window !== 'undefined') {
          document.cookie = 'guest_audit=true; path=/; max-age=3600; SameSite=Lax';
        window.location.href = '/dashboard';
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  return (
    <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-8 transition ${
          isDragging
            ? "border-slate-500 bg-white"
            : "border-slate-200 bg-white"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          PDF Intake
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Drop your Merchant Processing Statement here
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Drag and drop, or browse to upload a single PDF.
        </p>
        <button
          type="button"
          onClick={handleBrowse}
          disabled={isBusy}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isBusy ? "Scanning..." : "Browse Files"}
        </button>
        {fileName ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
            <p className="text-sm font-semibold text-slate-900">{fileName}</p>
            {fileSize ? (
              <p className="text-xs text-slate-500">{formatBytes(fileSize)}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
