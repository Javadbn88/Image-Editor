import { Trash2, Download, FilePlus2, PaintBucket } from "lucide-react";
 
interface HeaderProps {
  onDelete: () => void;
  onExport: () => void;
  onNewCanvas: () => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

const Header = ({ onDelete, onExport, onNewCanvas, bgColor, onBgColorChange }: HeaderProps) => {
  return (
    <header
      className="
        fixed left-3 right-3 top-3 z-50
        flex h-11 items-center justify-between
        rounded-2xl border border-zinc-800/80
        bg-zinc-950/95 px-2.5
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        sm:left-5 sm:right-5 sm:top-5 sm:h-12 sm:px-3
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-zinc-500 shrink-0" />

        <span className="text-xs font-medium tracking-wide text-zinc-300 sm:text-sm">
          Image Editor
        </span>
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
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </button>

        <label
          className="
            group relative flex h-9 w-9 cursor-pointer items-center justify-center
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
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </button>

        <button
          type="button"
          onClick={onExport}
          aria-label="Export image"
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
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;