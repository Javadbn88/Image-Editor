import { useRef, useState } from "react";
import {
  Shapes,
  Square,
  Squircle,
  Circle,
  Triangle,
  Ellipse,
  Minus,
  Star,
  Image,
  Text,
  TextCursorInput,
  Undo,
  Redo,
  Upload,
  Link,
} from "lucide-react";

export type ImageShape = "square" | "rounded" | "circle";

interface ToolbarProps {
  onAddSquare: () => void;
  onAddCircle: () => void;
  onAddTriangle: () => void;
  onAddEllipse: () => void;
  onAddLine: () => void;
  onAddStar: () => void;
  onAddText: () => void;
  onAddTextBox: () => void;
  onAddImageFromFile: (file: File) => void;
  onAddImageFromUrl: (url: string) => void;
  onSetImageShape: (shape: ImageShape) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const IMAGE_SHAPE_OPTIONS: { id: ImageShape; label: string; icon: typeof Square }[] = [
  { id: "square", label: "Sharp corners", icon: Square },
  { id: "rounded", label: "Rounded corners", icon: Squircle },
  { id: "circle", label: "Circle mask", icon: Circle },
];

const Toolbar = ({
  onAddSquare,
  onAddCircle,
  onAddTriangle,
  onAddEllipse,
  onAddLine,
  onAddStar,
  onAddText,
  onAddImageFromFile,
  onAddImageFromUrl,
  onSetImageShape,
  onAddTextBox,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  const [showShapes, setShowShapes] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeAllMenus = () => {
    setShowShapes(false);
    setShowImageMenu(false);
    setShowTextMenu(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowImageMenu(false);
  };

  const handleAddByUrl = () => {
    const url = window.prompt("Enter image link:");

    if (url) {
      onAddImageFromUrl(url);
    }

    setShowImageMenu(false);
  };

  const handleFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      onAddImageFromFile(file);
    }

    e.target.value = "";
  };

  const toolButton =
    "group relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-zinc-400 transition-all duration-200 hover:bg-zinc-800/80 hover:text-white active:scale-90 active:bg-zinc-800/80 active:text-white touch-manipulation disabled:opacity-30 disabled:pointer-events-none";

  const shapeButton =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all duration-150 hover:bg-zinc-800/80 hover:text-white active:scale-[0.98] touch-manipulation";

  const tooltipClass =
    "pointer-events-none absolute hidden sm:block left-12 whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100";

  const menuBase =
    "absolute w-56 max-w-[88vw] origin-bottom sm:origin-left rounded-2xl border border-zinc-800/80 bg-zinc-950/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-200 ease-out left-1/2 -translate-x-1/2 bottom-[64px] sm:bottom-auto sm:left-[60px] sm:translate-x-0";

  const menuOpen = "translate-y-0 sm:translate-x-0 scale-100 opacity-100";
  const menuClosed =
    "pointer-events-none translate-y-2 sm:translate-y-0 sm:-translate-x-2 scale-95 opacity-0";

  const anyMenuOpen = showShapes || showImageMenu || showTextMenu;

  return (
    <>
      {anyMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeAllMenus}
          aria-hidden="true"
        />
      )}

      <div
        className="
          fixed z-50
          bottom-4 left-1/2 -translate-x-1/2
          sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2
        "
      >
        <div className="relative">
          <div
            className="
              flex flex-row sm:flex-col items-center gap-1
              rounded-2xl border border-zinc-800/80
              bg-zinc-950/95 p-1.5
              shadow-[0_12px_40px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
            "
          >
            <button
              type="button"
              onClick={() => {
                setShowShapes((prev) => !prev);
                setShowImageMenu(false);
                setShowTextMenu(false);
              }}
              className={`${toolButton} ${
                showShapes ? "bg-zinc-800 text-white shadow-inner" : ""
              }`}
              aria-label="Shapes"
            >
              <Shapes size={21} strokeWidth={1.8} />
              {!showShapes && <span className={tooltipClass}>Shapes</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowImageMenu((prev) => !prev);
                setShowShapes(false);
                setShowTextMenu(false);
              }}
              className={`${toolButton} ${
                showImageMenu ? "bg-zinc-800 text-white shadow-inner" : ""
              }`}
              aria-label="Add image"
            >
              <Image size={21} strokeWidth={1.8} />
              {!showImageMenu && <span className={tooltipClass}>Image</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowTextMenu((prev) => !prev);
                setShowShapes(false);
                setShowImageMenu(false);
              }}
              className={`${toolButton} ${
                showTextMenu ? "bg-zinc-800 text-white shadow-inner" : ""
              }`}
              aria-label="Add text"
            >
              <Text size={21} strokeWidth={1.8} />
              {!showTextMenu && <span className={tooltipClass}>Text</span>}
            </button>

            <div className="mx-1 sm:mx-0 sm:my-1 h-7 w-px sm:h-px sm:w-7 bg-zinc-800" />

            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={toolButton}
              aria-label="Undo"
            >
              <Undo size={21} strokeWidth={1.8} />
              <span className={tooltipClass}>Undo</span>
            </button>

            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={toolButton}
              aria-label="Redo"
            >
              <Redo size={21} strokeWidth={1.8} />
              <span className={tooltipClass}>Redo</span>
            </button>
          </div>

          <div className={`${menuBase} sm:top-0 ${showShapes ? menuOpen : menuClosed}`}>
            <div className="px-3 pb-2 pt-1">
              <p className="text-xs font-medium text-zinc-500">Add Shape</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddSquare();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Square size={19} strokeWidth={1.8} />
              <span>Square</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddCircle();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Circle size={19} strokeWidth={1.8} />
              <span>Circle</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddTriangle();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Triangle size={19} strokeWidth={1.8} />
              <span>Triangle</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddEllipse();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Ellipse size={19} strokeWidth={1.8} />
              <span>Ellipse</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddStar();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Star size={19} strokeWidth={1.8} />
              <span>Star</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddLine();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Minus size={19} strokeWidth={1.8} />
              <span>Line</span>
            </button>
          </div>

          <div
            className={`${menuBase} sm:top-[52px] w-60 ${
              showImageMenu ? menuOpen : menuClosed
            }`}
          >
            <div className="px-3 pb-2 pt-1">
              <p className="text-xs font-medium text-zinc-500">Add Image</p>
            </div>

            <button type="button" onClick={handleUploadClick} className={shapeButton}>
              <Upload size={19} strokeWidth={1.8} />
              <span>Upload from your device</span>
            </button>

            <button type="button" onClick={handleAddByUrl} className={shapeButton}>
              <Link size={19} strokeWidth={1.8} />
              <span>Upload with link</span>
            </button>

            <div className="my-2 h-px w-full bg-zinc-800" />

            <div className="px-3 pb-1">
              <p className="text-xs font-medium text-zinc-500">Shape</p>
            </div>

            {IMAGE_SHAPE_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSetImageShape(id);
                  closeAllMenus();
                }}
                className={shapeButton}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div
            className={`${menuBase} sm:top-[104px] ${
              showTextMenu ? menuOpen : menuClosed
            }`}
          >
            <div className="px-3 pb-2 pt-1">
              <p className="text-xs font-medium text-zinc-500">Add Text</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddText();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <Text size={19} strokeWidth={1.8} />
              <span>Simple text</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddTextBox();
                closeAllMenus();
              }}
              className={shapeButton}
            >
              <TextCursorInput size={19} strokeWidth={1.8} />
              <span>Text box (wraps)</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            className="hidden"
          />
        </div>
      </div>
    </>
  );
};

export default Toolbar;
