import {
  Trash2,
  Download,
  FilePlus2,
  PaintBucket,
  BookDown,
} from "lucide-react";

interface HeaderProps {
  onDelete: () => void;
  onExport: () => void;
  onNewCanvas: () => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

const Header = ({
  onDelete,
  onExport,
  onNewCanvas,
  bgColor,
  onBgColorChange,
}: HeaderProps) => {
  return (
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
      {/* Logo + GitHub */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 shrink-0 rounded-full bg-zinc-500" />

          <span className="text-xs font-medium tracking-wide text-zinc-300 sm:text-sm">
            Image Editor
          </span>
        </div>

        {/* GitHub */}
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

          {/* Inner glow */}
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

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-0.5">
        {/* New Canvas */}
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

        {/* Background Color */}
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

        {/* Delete */}
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

        {/* Export */}
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
            className="
              transition-transform duration-200
              group-hover:scale-105
            "
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
