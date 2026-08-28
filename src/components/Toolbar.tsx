import { useRef, useState } from "react";
import {
  Shapes,
  Square,
  Circle,
  Triangle,
  Ellipse,
  Minus,
  Star,
  Image,
  Undo,
  Redo,
  Upload,
  Link,
} from "lucide-react";

interface ToolbarProps {
  onAddSquare: () => void;
  onAddCircle: () => void;
  onAddTriangle: () => void;
  onAddEllipse: () => void;
  onAddLine: () => void;
  onAddStar: () => void;
  onAddImageFromFile: (file: File) => void;
  onAddImageFromUrl: (url: string) => void;
}

const Toolbar = ({
  onAddSquare,
  onAddCircle,
  onAddTriangle,
  onAddEllipse,
  onAddLine,
  onAddStar,
  onAddImageFromFile,
  onAddImageFromUrl,
}: ToolbarProps) => {
  const [showShapes, setShowShapes] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowImageMenu(false);
  };

  const handleAddByUrl = () => {
    const url = window.prompt("لینک عکس رو وارد کن:");
    if (url) onAddImageFromUrl(url);
    setShowImageMenu(false);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddImageFromFile(file);
    e.target.value = "";
  };

  const toolButton =
    "group relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-all duration-200 hover:bg-zinc-800/80 hover:text-white active:scale-90";

  const shapeButton =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all duration-150 hover:bg-zinc-800/80 hover:text-white active:scale-[0.98]";

  return (
    <div className="fixed left-5 top-1/2 z-50 -translate-y-1/2">
      <div className="relative">
        <div
          className="
            flex w-[52px] flex-col items-center gap-1
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
            }}
            className={`${toolButton} ${
              showShapes
                ? "bg-zinc-800 text-white shadow-inner"
                : ""
            }`}
            aria-label="Shapes"
          >
            <Shapes size={21} strokeWidth={1.8} />

            {!showShapes && (
              <span
                className="
                  pointer-events-none absolute left-12
                  whitespace-nowrap rounded-lg
                  border border-zinc-800
                  bg-zinc-900 px-2.5 py-1.5
                  text-xs text-zinc-200
                  opacity-0 shadow-lg
                  transition-all duration-150
                  group-hover:translate-x-1 group-hover:opacity-100
                "
              >
                Shapes
              </span>
            )}
          </button>

          {/* Image */}
          <button
            type="button"
            onClick={() => {
              setShowImageMenu((prev) => !prev);
              setShowShapes(false);
            }}
            className={`${toolButton} ${
              showImageMenu
                ? "bg-zinc-800 text-white shadow-inner"
                : ""
            }`}
            aria-label="Add image"
          >
            <Image size={21} strokeWidth={1.8} />

            {!showImageMenu && (
              <span
                className="
                  pointer-events-none absolute left-12
                  whitespace-nowrap rounded-lg
                  border border-zinc-800
                  bg-zinc-900 px-2.5 py-1.5
                  text-xs text-zinc-200
                  opacity-0 shadow-lg
                  transition-all duration-150
                  group-hover:translate-x-1 group-hover:opacity-100
                "
              >
                Image
              </span>
            )}
          </button>

          <div className="my-1 h-px w-7 bg-zinc-800" />

          <button
            type="button"
            className={toolButton}
            aria-label="Undo"
          >
            <Undo size={21} strokeWidth={1.8} />

            <span
              className="
                pointer-events-none absolute left-12
                whitespace-nowrap rounded-lg
                border border-zinc-800
                bg-zinc-900 px-2.5 py-1.5
                text-xs text-zinc-200
                opacity-0 shadow-lg
                transition-all duration-150
                group-hover:translate-x-1 group-hover:opacity-100
              "
            >
              Undo
            </span>
          </button>

          <button
            type="button"
            className={toolButton}
            aria-label="Redo"
          >
            <Redo size={21} strokeWidth={1.8} />

            <span
              className="
                pointer-events-none absolute left-12
                whitespace-nowrap rounded-lg
                border border-zinc-800
                bg-zinc-900 px-2.5 py-1.5
                text-xs text-zinc-200
                opacity-0 shadow-lg
                transition-all duration-150
                group-hover:translate-x-1 group-hover:opacity-100
              "
            >
              Redo
            </span>
          </button>
        </div>

        {/* Shapes Panel */}
        <div
          className={`
            absolute left-[60px] top-0 w-44
            origin-left
            rounded-2xl border border-zinc-800/80
            bg-zinc-950/95 p-2
            shadow-[0_16px_50px_rgba(0,0,0,0.4)]
            backdrop-blur-xl
            transition-all duration-200 ease-out
            ${
              showShapes
                ? "translate-x-0 scale-100 opacity-100"
                : "pointer-events-none -translate-x-2 scale-95 opacity-0"
            }
          `}
        >
          {/* Header */}
          <div className="px-3 pb-2 pt-1">
            <p className="text-xs font-medium text-zinc-500">
              Add Shape
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onAddSquare();
              setShowShapes(false);
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
              setShowShapes(false);
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
              setShowShapes(false);
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
              setShowShapes(false);
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
              setShowShapes(false);
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
              setShowShapes(false);
            }}
            className={shapeButton}
          >
            <Minus size={19} strokeWidth={1.8} />
            <span>Line</span>
          </button>
        </div>

        <div
          className={`
            absolute left-[60px] top-[52px] w-60
            origin-left
            rounded-2xl border border-zinc-800/80
            bg-zinc-950/95 p-2
            shadow-[0_16px_50px_rgba(0,0,0,0.4)]
            backdrop-blur-xl
            transition-all duration-200 ease-out
            ${
              showImageMenu
                ? "translate-x-0 scale-100 opacity-100"
                : "pointer-events-none -translate-x-2 scale-95 opacity-0"
            }
          `}
        >
          <div className="px-3 pb-2 pt-1">
            <p className="text-xs font-medium text-zinc-500">
              Add Image
            </p>
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            className={shapeButton}
          >
            <Upload size={19} strokeWidth={1.8} />
            <span>Upload from your device</span>
          </button>

          <button
            type="button"
            onClick={handleAddByUrl}
            className={shapeButton}
          >
            <Link size={19} strokeWidth={1.8} />
            <span>Upload with link</span>
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
  );
};

export default Toolbar;