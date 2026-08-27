import { Trash2 } from "lucide-react";

interface HeaderProps {
  onDelete: () => void;
}

const Header = ({ onDelete }: HeaderProps) => {
  return (
    <header
      className="
        fixed left-5 right-5 top-5 z-50
        flex h-12 items-center justify-between
        rounded-2xl border border-zinc-800/80
        bg-zinc-950/95 px-3
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-zinc-500" />

        <span className="text-sm font-medium tracking-wide text-zinc-300">
          Image Editor
        </span>
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete all objects"
        className="
          group flex h-9 w-9 items-center justify-center
          rounded-xl
          text-zinc-500
          transition-all duration-200
          hover:bg-red-500/10
          hover:text-red-400
          active:scale-90
        "
      >
        <Trash2
          size={18}
          strokeWidth={1.8}
          className="transition-transform duration-200 group-hover:scale-105"
        />
      </button>
    </header>
  );
};

export default Header;