// PropertiesPanel.tsx
import { useState } from 'react';
import * as fabric from 'fabric';
import {
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  Copy,
  Trash2,
  Bold,
  Italic,
  ChevronUp,
  ChevronDown,
  Settings2,
} from 'lucide-react';

interface PropertiesPanelProps {
  object: fabric.Object;
  onChange: () => void;
  onCommit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onReorder: (action: 'front' | 'back' | 'forward' | 'backward') => void;
}

const FONT_OPTIONS = ['Arial', 'Georgia', 'Courier New', 'Times New Roman', 'Verdana'];

const PropertiesPanel = ({
  object,
  onChange,
  onCommit,
  onDuplicate,
  onDelete,
  onReorder,
}: PropertiesPanelProps) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const type = object.type;
  const isText = type === 'text' || type === 'i-text' || type === 'textbox';
  const isImage = type === 'image';
  const isLine = type === 'line';

  const anyObj = object as any;

  const fill = typeof anyObj.fill === 'string' ? anyObj.fill : '#ffffff';
  const stroke = typeof anyObj.stroke === 'string' ? anyObj.stroke : '#ffffff';
  const strokeWidth = anyObj.strokeWidth ?? 0;
  const opacity = object.opacity ?? 1;
  const fontSize = anyObj.fontSize ?? 24;
  const fontFamily = anyObj.fontFamily ?? 'Arial';
  const fontWeight = anyObj.fontWeight ?? 'normal';
  const fontStyle = anyObj.fontStyle ?? 'normal';

  const labelClass = 'text-xs font-medium text-zinc-500';
  const rowClass = 'flex items-center justify-between gap-3 py-1.5';
  const iconButton =
    'flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-white active:scale-90 touch-manipulation';

  const commit = (mutate: () => void) => {
    mutate();
    onChange();
    onCommit();
  };

  return (
    <>
      {mobileExpanded && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setMobileExpanded(false)}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => setMobileExpanded((prev) => !prev)}
        className="
          sm:hidden fixed z-50 left-1/2 -translate-x-1/2 bottom-[108px]
          flex items-center gap-1.5 rounded-full
          border border-zinc-800/80 bg-zinc-950/95 px-3.5 py-2
          text-xs font-medium text-zinc-300
          shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl
          active:scale-95 touch-manipulation
        "
      >
        <Settings2 size={14} strokeWidth={1.8} />
        <span>Style</span>
        {mobileExpanded ? (
          <ChevronDown size={14} strokeWidth={1.8} />
        ) : (
          <ChevronUp size={14} strokeWidth={1.8} />
        )}
      </button>

      <div
        className={`
          fixed z-50 left-3 right-3 bottom-[76px] max-h-[50vh]
          rounded-2xl border border-zinc-800/80 bg-zinc-950/95 p-3
          shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl
          overflow-y-auto overscroll-contain
          transition-all duration-200 ease-out
          ${
            mobileExpanded
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-3 opacity-0 pointer-events-none'
          }
          sm:left-auto sm:right-5 sm:top-24 sm:bottom-auto sm:w-64 sm:max-h-[70vh]
          sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto
        `}
      >
        <p className={`${labelClass} pb-2`}>Style</p>

        {!isImage && !isLine && (
          <div className={rowClass}>
            <span className="text-sm text-zinc-300">Fill</span>
            <input
              type="color"
              defaultValue={fill}
              onChange={(e) => commit(() => object.set({ fill: e.target.value }))}
              className="h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
            />
          </div>
        )}

        {!isImage && (
          <div className={rowClass}>
            <span className="text-sm text-zinc-300">Stroke</span>
            <input
              type="color"
              defaultValue={stroke}
              onChange={(e) => commit(() => object.set({ stroke: e.target.value }))}
              className="h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent"
            />
          </div>
        )}

        {!isImage && (
          <div className={rowClass}>
            <span className="text-sm text-zinc-300">Stroke width</span>
            <input
              type="range"
              min={0}
              max={20}
              defaultValue={strokeWidth}
              onChange={(e) => {
                object.set({ strokeWidth: Number(e.target.value) });
                onChange();
              }}
              onMouseUp={onCommit}
              onTouchEnd={onCommit}
              className="w-28 accent-zinc-300"
            />
          </div>
        )}

        <div className={rowClass}>
          <span className="text-sm text-zinc-300">Opacity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            defaultValue={opacity}
            onChange={(e) => {
              object.set({ opacity: Number(e.target.value) });
              onChange();
            }}
            onMouseUp={onCommit}
            onTouchEnd={onCommit}
            className="w-28 accent-zinc-300"
          />
        </div>

        {isText && (
          <>
            <p className={`${labelClass} pb-2 pt-3`}>Text</p>

            <div className={rowClass}>
              <span className="text-sm text-zinc-300">Font</span>
              <select
                defaultValue={fontFamily}
                onChange={(e) => commit(() => object.set({ fontFamily: e.target.value } as any))}
                className="w-28 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className={rowClass}>
              <span className="text-sm text-zinc-300">Size</span>
              <input
                type="number"
                min={6}
                max={200}
                defaultValue={fontSize}
                onChange={(e) => commit(() => object.set({ fontSize: Number(e.target.value) } as any))}
                className="w-20 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
              />
            </div>

            <div className="flex items-center gap-2 py-1.5">
              <button
                type="button"
                onClick={() =>
                  commit(() =>
                    object.set({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' } as any)
                  )
                }
                className={`${iconButton} ${fontWeight === 'bold' ? 'bg-zinc-800 text-white' : ''}`}
                aria-label="Bold"
              >
                <Bold size={16} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() =>
                  commit(() =>
                    object.set({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' } as any)
                  )
                }
                className={`${iconButton} ${fontStyle === 'italic' ? 'bg-zinc-800 text-white' : ''}`}
                aria-label="Italic"
              >
                <Italic size={16} strokeWidth={1.8} />
              </button>
            </div>
          </>
        )}

        <p className={`${labelClass} pb-2 pt-3`}>Layer</p>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onReorder('front')} className={iconButton} aria-label="Bring to front">
            <ArrowUpToLine size={16} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={() => onReorder('forward')} className={iconButton} aria-label="Bring forward">
            <ArrowUp size={16} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={() => onReorder('backward')} className={iconButton} aria-label="Send backward">
            <ArrowDown size={16} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={() => onReorder('back')} className={iconButton} aria-label="Send to back">
            <ArrowDownToLine size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-zinc-800 pt-3">
          <button type="button" onClick={onDuplicate} className={iconButton} aria-label="Duplicate">
            <Copy size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`${iconButton} hover:bg-red-500/10 hover:text-red-400`}
            aria-label="Delete"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertiesPanel;