import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Trash2,
  Download,
  FilePlus2,
  PaintBucket,
  BookDown,
  X,
} from "lucide-react";

interface HeaderProps {
  onDelete: () => void;
  onExport: (fileName: string) => void;
  onNewCanvas: () => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

const DEFAULT_EXPORT_NAME = "image";

const Header = ({
  onDelete,
  onExport,
  onNewCanvas,
  bgColor,
  onBgColorChange,
}: HeaderProps) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [fileName, setFileName] = useState(DEFAULT_EXPORT_NAME);
  const inputRef = useRef<HTMLInputElement>(null);

  const openExport = () => {
    setFileName(DEFAULT_EXPORT_NAME);
    setIsExportOpen(true);
  };

  const closeExport = () => setIsExportOpen(false);

  // Lock page scroll and focus the field while the export dialog is open.
  useEffect(() => {
    if (!isExportOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
    };
  }, [isExportOpen]);

  useEffect(() => {
    if (!isExportOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExport();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExportOpen]);

  const handleExportSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = fileName.trim();
    onExport(trimmed || DEFAULT_EXPORT_NAME);
    closeExport();
  };

  return (
    <>
      <header
        className="
          fixed left-3 right-3 top-3 z-50
          flex h-13 items-center justify-between
          rounded-2xl border border-zinc-800/80
          bg-zinc-950/95 px-2.5
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
          sm:left-5 sm:right-5 sm:top-5 sm:h-12 sm:px-3
        "
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-full bg-zinc-500" />

            <span className="text-xs font-medium tracking-wide text-zinc-300 sm:text-sm">
              Image Editor
            </span>
          </div>

          <a
            href="https://github.com/Javadbn88/Image-Editor.git"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View project on GitHub"
            className="
              group relative
              flex h-8 items-center gap-2
              rounded-lg
              border border-zinc-700/50
              bg-zinc-600/20
              px-1.5
              text-zinc-300
              transition-all duration-300 ease-out

              hover:border-violet-500/40
              hover:bg-violet-500/10
              hover:text-violet-300
              hover:shadow-[0_0_100px_rgba(139,92,246,0.18)]

              active:translate-y-0
              active:scale-95
            "
          >
            <BookDown
              size={16}
              strokeWidth={1.8}
              className="
                transition-all duration-300
                group-hover:rotate-[-8deg]
                group-hover:scale-100
              "
            />

            <span
              className="
                text-[11px] font-medium
                transition-colors 
                sm:block
              "
            >
              GitHub
            </span>

            <span
              className="
                pointer-events-none absolute inset-0
                rounded-lg
                opacity-0
                shadow-[inset_0_0_12px_rgba(139,92,246,0.08)]
                transition-opacity 
                group-hover:opacity-100
              "
            />
          </a>
        </div>

        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={onNewCanvas}
            aria-label="New canvas"
            className="
              group flex h-9 w-9 items-center justify-center
              rounded-xl
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-500/10
              hover:text-zinc-300
              active:scale-90
              touch-manipulation
            "
          >
            <FilePlus2
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:scale-105
              "
            />
          </button>

          <label
            className="
              group relative flex h-9 w-9
              cursor-pointer items-center justify-center
              rounded-xl
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-500/10
              hover:text-zinc-300
              active:scale-90
              touch-manipulation
            "
            aria-label="Canvas background color"
          >
            <PaintBucket
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:scale-105
              "
            />

            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="
                absolute inset-0
                h-full w-full
                cursor-pointer
                opacity-0
              "
            />
          </label>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete selected"
            className="
              group flex h-9 w-9 items-center justify-center
              rounded-xl
              text-zinc-500
              transition-all duration-200
              hover:bg-red-500/10
              hover:text-red-400
              active:scale-90
              active:bg-red-500/10
              active:text-red-400
              touch-manipulation
            "
          >
            <Trash2
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:scale-105
              "
            />
          </button>

          <button
            type="button"
            onClick={openExport}
            aria-label="Export image"
            aria-haspopup="dialog"
            aria-expanded={isExportOpen}
            className="
              group flex h-9 w-9 items-center justify-center
              rounded-xl
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-500/10
              hover:text-zinc-400
              active:scale-90
              active:bg-zinc-500/10
              active:text-zinc-400
              touch-manipulation
            "
          >
            <Download
              size={18}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover:scale-105
              "
            />
          </button>
        </div>
      </header>

      {isExportOpen && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeExport}
            aria-hidden="true"
          />

          <div
            className="
              fixed inset-0 z-[70]
              flex items-center justify-center
              px-4
              pointer-events-none
            "
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="export-dialog-title"
              className="
                w-full max-w-sm
                pointer-events-auto
                rounded-3xl border border-zinc-800/80
                bg-zinc-950/98
                p-5
                shadow-[0_24px_70px_rgba(0,0,0,0.55)]
                backdrop-blur-xl
                animate-in fade-in zoom-in-95 duration-200
              "
            >
              <div className="flex items-center justify-between pb-4">
                <h2
                  id="export-dialog-title"
                  className="text-sm font-medium text-zinc-200"
                >
                  Export Image
                </h2>

                <button
                  type="button"
                  onClick={closeExport}
                  aria-label="Close"
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg
                    text-zinc-500
                    transition-colors
                    hover:bg-zinc-800
                    hover:text-zinc-200
                    active:scale-90
                  "
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              <form
                onSubmit={handleExportSubmit}
                className="flex flex-col gap-4"
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-400">
                    File name
                  </span>

                  <div
                    className="
                      flex items-center overflow-hidden
                      rounded-2xl border border-zinc-700
                      bg-zinc-900
                      focus-within:border-zinc-500
                    "
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder={DEFAULT_EXPORT_NAME}
                      className="
                        w-full bg-transparent
                        px-3 py-2.5
                        text-sm text-zinc-200
                        outline-none
                        placeholder:text-zinc-600
                      "
                    />

                    <span className="shrink-0 pr-3 text-xs text-zinc-500">
                      .png
                    </span>
                  </div>
                </label>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeExport}
                    className="
                      rounded-xl px-4 py-2
                      text-xs font-medium text-zinc-400
                      transition-colors
                      hover:bg-zinc-800
                      hover:text-zinc-200
                      active:scale-95
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex items-center gap-1.5
                      rounded-xl bg-white px-4 py-2
                      text-xs font-medium text-zinc-900
                      transition-transform
                      hover:bg-zinc-200
                      active:scale-95
                    "
                  >
                    <Download size={14} strokeWidth={2} />
                    Export
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
