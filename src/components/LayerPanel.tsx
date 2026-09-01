import { useEffect, useMemo, useRef } from "react";
import * as fabric from "fabric";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronDown,
  ChevronUp,
  Layers,
  Lock,
  Trash2,
  Unlock,
  X,
} from "lucide-react";

interface LayerPanelProps {
  objects: fabric.Object[];
  selected: fabric.Object | null;
  onSelect: (object: fabric.Object) => void;
  onBringToFront: (object: fabric.Object) => void;
  onSendToBack: (object: fabric.Object) => void;
  onToggleLock: (object: fabric.Object) => void;
  onDelete: (object: fabric.Object) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  onDesktopHeightChange?: (height: number) => void;
}

const MAX_VISIBLE_LAYERS = 5;
const LAYER_ROW_HEIGHT = 44; 
const LAYER_ROW_GAP = 4; 
const LAYER_LIST_PADDING = 16;

const LAYER_LIST_MAX_HEIGHT =
  MAX_VISIBLE_LAYERS * LAYER_ROW_HEIGHT +
  (MAX_VISIBLE_LAYERS - 1) * LAYER_ROW_GAP +
  LAYER_LIST_PADDING;

const getLayerName = (object: fabric.Object, index: number) => {
  const names: Record<string, string> = {
    image: "Image",
    rect: "Rectangle",
    circle: "Circle",
    triangle: "Triangle",
    ellipse: "Ellipse",
    line: "Line",
    star: "Star",
    text: "Text",
    "i-text": "Text",
    textbox: "Text Box",
    group: "Group",
  };

  return `${names[object.type ?? ""] ?? "Object"} ${index + 1}`;
};

const LayerPanel = ({
  objects,
  selected,
  onSelect,
  onBringToFront,
  onSendToBack,
  onToggleLock,
  onDelete,
  mobileOpen,
  onMobileOpenChange,
  onDesktopHeightChange,
}: LayerPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, onMobileOpenChange]);

  const layers = useMemo(() => [...objects].reverse(), [objects]);

  useEffect(() => {
    const node = panelRef.current;
    if (!node || !onDesktopHeightChange) return;

    const reportHeight = () => onDesktopHeightChange(node.offsetHeight);
    reportHeight();

    const observer = new ResizeObserver(() => reportHeight());
    observer.observe(node);

    return () => observer.disconnect();
  }, [onDesktopHeightChange, layers.length]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 sm:hidden"
          onClick={() => onMobileOpenChange(false)}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => onMobileOpenChange(!mobileOpen)}
        className="
          fixed bottom-[108px] left-4 z-[60]
          flex h-10 items-center gap-2
          rounded-full
          border border-zinc-700/80
          bg-zinc-950/95
          px-3.5
          text-xs font-medium text-zinc-200
          shadow-[0_8px_28px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
          transition-all duration-200
          active:scale-95
          touch-manipulation
          sm:hidden
        "
        aria-expanded={mobileOpen}
        aria-controls="layer-panel"
      >
        <Layers size={15} strokeWidth={1.9} />

        <span>Layers</span>

        {mobileOpen ? (
          <ChevronDown size={14} strokeWidth={1.9} />
        ) : (
          <ChevronUp size={14} strokeWidth={1.9} />
        )}
      </button>

      <aside
        id="layer-panel"
        ref={panelRef}
        className={`
          fixed z-[60]
          bottom-0 left-0 right-0
          sm:bottom-auto
          sm:left-auto
          sm:right-5
          sm:top-24
          sm:w-80
          rounded-t-2xl
          sm:rounded-2xl
          border border-zinc-800/80
          bg-zinc-950/98
          sm:bg-zinc-950/95
          shadow-[0_-12px_40px_rgba(0,0,0,0.5)]
          sm:shadow-[0_16px_50px_rgba(0,0,0,0.4)]
          backdrop-blur-xl
          ${
            mobileOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto"
          }
          transition-all duration-200 ease-out
        `}
        style={{
          maxHeight: "min(58vh, 460px)",
        }}
      >
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-3">
          <div className="flex items-center gap-2">
            <Layers
              size={16}
              strokeWidth={1.8}
              className="text-zinc-400"
            />

            <h2 className="text-sm font-medium text-zinc-200">
              Layers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onMobileOpenChange(false)}
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-zinc-500
              transition-colors
              hover:bg-zinc-800
              hover:text-zinc-200
              active:scale-90
              sm:hidden
            "
            aria-label="Close layers"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div
          className="
            overflow-y-auto overscroll-contain p-2
            scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
            scrollbar-thumb-rounded-full
            hover:scrollbar-thumb-zinc-600
            [-webkit-overflow-scrolling:touch]
          "
          style={{
            maxHeight: `${LAYER_LIST_MAX_HEIGHT}px`,
            paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
          }}
        >
          {layers.length === 0 ? (
            <div
              className="
                flex min-h-24
                items-center justify-center
                rounded-xl
                border border-dashed border-zinc-800
                px-4
                text-center
                text-xs text-zinc-600
              "
            >
              Add an object to create a layer.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {layers.map((object, index) => {
                const originalIndex = objects.indexOf(object);
                const name = getLayerName(object, originalIndex);
                const isSelected = selected === object;
                const isLocked = object.selectable === false;

                return (
                  <div
                    key={`${name}-${originalIndex}`}
                    className={`
                      group
                      flex h-11 shrink-0 items-center gap-1
                      rounded-xl
                      border
                      px-1.5
                      transition-colors
                      ${
                        isSelected
                          ? "border-zinc-700 bg-zinc-800/80"
                          : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/70"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLocked) {
                          onSelect(object);
                        }
                      }}
                      disabled={isLocked}
                      className="
                        flex min-w-0 flex-1
                        items-center gap-2
                        rounded-lg
                        px-1.5 py-1
                        text-left
                        disabled:cursor-default
                      "
                      aria-label={`Select ${name}`}
                    >
                      <span
                        className="
                          flex h-7 w-7 shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-zinc-900
                          text-[9px]
                          font-medium
                          uppercase
                          text-zinc-500
                        "
                      >
                        {object.type?.slice(0, 2) ?? "OB"}
                      </span>

                      <span
                        className="
                          min-w-0
                          truncate
                          text-xs
                          font-medium
                          text-zinc-300
                        "
                      >
                        {name}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleLock(object)}
                      className="
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-zinc-500
                        transition-colors
                        hover:bg-zinc-800
                        hover:text-zinc-200
                        active:scale-90
                      "
                      aria-label={
                        isLocked
                          ? `Unlock ${name}`
                          : `Lock ${name}`
                      }
                      title={isLocked ? "Unlock" : "Lock"}
                    >
                      {isLocked ? (
                        <Lock size={14} strokeWidth={1.8} />
                      ) : (
                        <Unlock size={14} strokeWidth={1.8} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onBringToFront(object)}
                      disabled={isLocked || index === 0}
                      className="
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-zinc-500
                        transition-colors
                        hover:bg-zinc-800
                        hover:text-zinc-200
                        active:scale-90
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                      aria-label={`Bring ${name} to front`}
                      title="Bring to front"
                    >
                      <ArrowUpToLine
                        size={14}
                        strokeWidth={1.8}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToBack(object)}
                      disabled={
                        isLocked ||
                        index === layers.length - 1
                      }
                      className="
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-zinc-500
                        transition-colors
                        hover:bg-zinc-800
                        hover:text-zinc-200
                        active:scale-90
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                      aria-label={`Send ${name} to back`}
                      title="Send to back"
                    >
                      <ArrowDownToLine
                        size={14}
                        strokeWidth={1.8}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(object)}
                      disabled={isLocked}
                      className="
                        flex h-7 w-7 shrink-0
                        items-center justify-center
                        rounded-lg
                        text-zinc-500
                        transition-colors
                        hover:bg-red-500/10
                        hover:text-red-400
                        active:scale-90
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                      aria-label={`Delete ${name}`}
                      title="Delete"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default LayerPanel;
