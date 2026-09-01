import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import * as fabric from 'fabric';
import {
  IMAGE_FILTERS,
  getImageFilterValue,
  isImageFilterActive,
  resetImageFilters,
  setImageFilterValue,
  toggleImageFilter,
} from '../lib/image-filters';
import type { ImageFilterConfig } from '../lib/image-filters';
import {
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  Copy,
  Trash2,
  Bold,
  Italic,
  Check,
  ChevronDown,
  Contrast,
  Droplet,
  Focus,
  Settings2,
  Sun,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  FlipHorizontal,
  FlipVertical,
  Group,
  Ungroup,
} from 'lucide-react';

const FILTER_ICONS: Record<string, typeof Sun> = {
  brightness: Sun,
  contrast: Contrast,
  saturation: Droplet,
  blur: Focus,
};

const formatFilterAmount = (filter: ImageFilterConfig, value: number) => {
  const percent = Math.round(value * 100);
  if (filter.kind === 'range' && filter.min < 0 && percent > 0) return `+${percent}%`;
  return `${percent}%`;
};

interface PropertiesPanelProps {
  object: fabric.Object;
  onChange: () => void;
  onCommit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onReorder: (action: 'front' | 'back' | 'forward' | 'backward') => void;
  onAlign: (direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onFlip: (axis: 'x' | 'y') => void;
  onGroup: () => void;
  onUngroup: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  desktopTop?: number;
}

const FONT_OPTIONS = ['Arial', 'Georgia', 'Courier New', 'Times New Roman', 'Verdana'];

const DEFAULT_DESKTOP_TOP = 96; 

const PropertiesPanel = ({
  object,
  onChange,
  onCommit,
  onDuplicate,
  onDelete,
  onReorder,
  onAlign,
  onFlip,
  onGroup,
  onUngroup,
  mobileOpen,
  onMobileOpenChange,
  desktopTop,
}: PropertiesPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const type = object.type;
  const isText = type === 'text' || type === 'i-text' || type === 'textbox';
  const isImage = type === 'image';
  const isLine = type === 'line';
  const isActiveSelection = type === 'activeselection';
  const isGroup = type === 'group';

  const anyObj = object as any;

  const fill = typeof anyObj.fill === 'string' ? anyObj.fill : '#ffffff';
  const stroke = typeof anyObj.stroke === 'string' ? anyObj.stroke : '#ffffff';
  const strokeWidth = anyObj.strokeWidth ?? 0;
  const opacity = object.opacity ?? 1;
  const fontSize = anyObj.fontSize ?? 24;
  const fontFamily = anyObj.fontFamily ?? 'Arial';
  const fontWeight = anyObj.fontWeight ?? 'normal';
  const fontStyle = anyObj.fontStyle ?? 'normal';

  const labelClass = 'text-xs font-medium text-zinc-400';
  const rowClass = 'flex items-center justify-between gap-3 py-2';
  const iconButton = 'flex h-9 w-9 items-center justify-center rounded-2xl text-zinc-400 transition-all duration-200 hover:bg-zinc-900 hover:text-white active:scale-95 active:bg-zinc-800 touch-manipulation';

  const commit = (mutate: () => void) => {
    mutate();
    onChange();
    onCommit();
  };

  const [filterValues, setFilterValues] = useState<Record<string, number>>(() => {
    if (type !== 'image') return {};
    const image = object as fabric.FabricImage;
    const values: Record<string, number> = {};
    IMAGE_FILTERS.forEach((filter) => {
      values[filter.id] =
        filter.kind === 'range'
          ? getImageFilterValue(image, filter.id)
          : isImageFilterActive(image, filter.id)
            ? 1
            : 0;
    });
    return values;
  });

  const hasActiveFilters = Object.values(filterValues).some((value) => value !== 0);

  const setRangeFilter = (filter: ImageFilterConfig, value: number) => {
    setFilterValues((prev) => ({ ...prev, [filter.id]: value }));
    setImageFilterValue(object as fabric.FabricImage, filter.id, value);
    onChange();
  };

  const toggleFilter = (filter: ImageFilterConfig) => {
    const active = !filterValues[filter.id];
    setFilterValues((prev) => ({ ...prev, [filter.id]: active ? 1 : 0 }));
    commit(() => toggleImageFilter(object as fabric.FabricImage, filter.id));
  };

  const resetFilters = () => {
    const cleared: Record<string, number> = {};
    IMAGE_FILTERS.forEach((filter) => {
      cleared[filter.id] = 0;
    });
    setFilterValues(cleared);
    commit(() => resetImageFilters(object as fabric.FabricImage));
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMobileOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, onMobileOpenChange]);

  const closeMobile = () => onMobileOpenChange(false);

  const handleDuplicate = () => {
    onDuplicate();
    if (window.innerWidth < 640) closeMobile();
  };

  const handleDelete = () => {
    onDelete();
    closeMobile();
  };

  const panelStyle: CSSProperties = {
    maxHeight: 'min(58vh, 420px)',
    ['--pp-top' as any]: `${desktopTop ?? DEFAULT_DESKTOP_TOP}px`,
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 sm:hidden animate-in fade-in duration-200"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={() => onMobileOpenChange(!mobileOpen)}
        className={`
          sm:hidden fixed z-[20] 
          flex gap-2.5 rounded-full
          border border-zinc-700/80 bg-zinc-950/95 px-5 py-2.5
          text-xs font-medium text-zinc-200
          shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl
          active:scale-95 touch-manipulation
          transition-all duration-200
          ${mobileOpen ? 'bottom-[min(58vh,420px)] opacity-0 pointer-events-none' : 'bottom-[108px] opacity-100'}
        `}
        aria-expanded={mobileOpen}
        aria-controls="properties-panel"
      >
        <Settings2 size={15} strokeWidth={1.9} />
        <span>Style</span>
        <ChevronDown
          size={14}
          strokeWidth={1.9}
          className={`transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id="properties-panel"
        ref={panelRef}
        className={`
          fixed z-[60]
          left-0 right-0 bottom-0
          sm:left-auto sm:right-5 sm:top-[var(--pp-top)] sm:bottom-auto sm:w-72
          flex flex-col
          rounded-t-3xl sm:rounded-3xl
          border border-zinc-800/80 border-b-0 sm:border-b
          bg-zinc-950/98 sm:bg-zinc-950/95
          shadow-[0_-12px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_16px_50px_rgba(0,0,0,0.4)]
          backdrop-blur-xl
          transition-all duration-250 ease-out
          ${
            mobileOpen
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto'
          }
        `}
        style={panelStyle}
      >
        <div className="sm:hidden flex flex-col items-center pt-2.5 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-zinc-700/80 mb-2" />
          <div className="flex w-full items-center justify-between px-4 pb-1">
            <p className="text-sm font-medium text-zinc-200">Style</p>
            <button
              type="button"
              onClick={closeMobile}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-90 touch-manipulation"
              aria-label="Close style panel"
            >
              <X size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        <p className={`${labelClass} hidden sm:block px-4 pt-4 pb-1`}>Style</p>

        <div
          ref={scrollRef}
          className="
            flex-1 overflow-y-auto overscroll-contain
            px-4 pb-5 sm:pb-4
            scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
            [-webkit-overflow-scrolling:touch]
          "
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {!isActiveSelection && !isImage && !isLine && (
            <div className={rowClass}>
              <span className="text-sm text-zinc-300">Fill</span>
              <input
                type="color"
                defaultValue={fill}
                onChange={(e) => commit(() => object.set({ fill: e.target.value }))}
                className="h-8 w-11 cursor-pointer rounded-2xl border border-zinc-700 bg-transparent"
                title="Fill color"
              />
            </div>
          )}

          {!isActiveSelection && !isImage && (
            <div className={rowClass}>
              <span className="text-sm text-zinc-300">Stroke</span>
              <input
                type="color"
                defaultValue={stroke}
                onChange={(e) => commit(() => object.set({ stroke: e.target.value }))}
                className="h-8 w-11 cursor-pointer rounded-2xl border border-zinc-700 bg-transparent"
                title="Stroke color"
              />
            </div>
          )}

          {!isActiveSelection && !isImage && (
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
                title={`Stroke width: ${strokeWidth}`}
              />
            </div>
          )}

          {!isActiveSelection && (
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
                title={`Opacity: ${Math.round(opacity * 100)}%`}
              />
            </div>
          )}

          {isImage && (
            <div className="mt-1 rounded-3xl border border-zinc-800/70 bg-zinc-900/40 p-3">
              <div className="flex items-center justify-between pb-3">
                <p className={labelClass}>Filters</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {IMAGE_FILTERS.filter((filter) => filter.kind === 'range').map((filter) => {
                  const Icon = FILTER_ICONS[filter.id];
                  const value = filterValues[filter.id] ?? 0;
                  return (
                    <div key={filter.id}>
                      <div className="flex items-center justify-between pb-1.5">
                        <span className="flex items-center gap-2 text-sm text-zinc-300">
                          <Icon size={15} strokeWidth={1.8} className="text-zinc-500" />
                          {filter.label}
                        </span>
                        <span className="text-xs font-medium tabular-nums text-zinc-500">
                          {formatFilterAmount(filter, value)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        value={value}
                        onChange={(e) => setRangeFilter(filter, Number(e.target.value))}
                        onMouseUp={onCommit}
                        onTouchEnd={onCommit}
                        className="w-full accent-zinc-300"
                        aria-label={filter.label}
                        title={`${filter.label}: ${formatFilterAmount(filter, value)}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-zinc-800/70 pt-3">
                {IMAGE_FILTERS.filter((filter) => filter.kind === 'toggle').map((filter) => {
                  const active = Boolean(filterValues[filter.id]);
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => toggleFilter(filter)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 touch-manipulation ${
                        active
                          ? 'border-transparent bg-white text-zinc-900'
                          : 'border-zinc-700/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                    >
                      {active && <Check size={13} strokeWidth={2.5} />}
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isText && (
            <>
              <p className={`${labelClass} pb-3 pt-4`}>Text</p>
              <div className={rowClass}>
                <span className="text-sm text-zinc-300">Font</span>
                <select
                  defaultValue={fontFamily}
                  onChange={(e) => commit(() => object.set({ fontFamily: e.target.value } as any))}
                  className="w-28 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200"
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
                  onChange={(e) =>
                    commit(() => object.set({ fontSize: Number(e.target.value) } as any))
                  }
                  className="w-20 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200"
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <button
                  type="button"
                  onClick={() =>
                    commit(() =>
                      object.set({
                        fontWeight: fontWeight === 'bold' ? 'normal' : 'bold',
                      } as any)
                    )
                  }
                  className={`${iconButton} ${fontWeight === 'bold' ? 'bg-zinc-800 text-white' : ''}`}
                  aria-label="Bold"
                  title="Bold"
                >
                  <Bold size={17} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    commit(() =>
                      object.set({
                        fontStyle: fontStyle === 'italic' ? 'normal' : 'italic',
                      } as any)
                    )
                  }
                  className={`${iconButton} ${fontStyle === 'italic' ? 'bg-zinc-800 text-white' : ''}`}
                  aria-label="Italic"
                  title="Italic"
                >
                  <Italic size={17} strokeWidth={1.8} />
                </button>
              </div>
            </>
          )}

          <p className={`${labelClass} pb-3 pt-4`}>Align</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => onAlign('left')} className={iconButton} aria-label="Align left" title="Align left">
              <AlignLeft size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onAlign('center')} className={iconButton} aria-label="Align center" title="Align center">
              <AlignCenter size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onAlign('right')} className={iconButton} aria-label="Align right" title="Align right">
              <AlignRight size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onAlign('top')} className={iconButton} aria-label="Align top" title="Align top">
              <AlignStartVertical size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onAlign('middle')} className={iconButton} aria-label="Align middle" title="Align middle">
              <AlignCenterVertical size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onAlign('bottom')} className={iconButton} aria-label="Align bottom" title="Align bottom">
              <AlignEndVertical size={16} strokeWidth={1.8} />
            </button>
          </div>

          <p className={`${labelClass} pb-3 pt-4`}>Flip</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onFlip('x')} className={iconButton} aria-label="Flip horizontal" title="Flip horizontal">
              <FlipHorizontal size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onFlip('y')} className={iconButton} aria-label="Flip vertical" title="Flip vertical">
              <FlipVertical size={16} strokeWidth={1.8} />
            </button>
          </div>

          {(isActiveSelection || isGroup) && (
            <>
              <p className={`${labelClass} pb-3 pt-4`}>Group</p>
              <div className="flex items-center gap-2">
                {isActiveSelection && (
                  <button type="button" onClick={onGroup} className={iconButton} aria-label="Group" title="Group (Ctrl+G)">
                    <Group size={16} strokeWidth={1.8} />
                  </button>
                )}
                {isGroup && (
                  <button type="button" onClick={onUngroup} className={iconButton} aria-label="Ungroup" title="Ungroup (Ctrl+Shift+G)">
                    <Ungroup size={16} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            </>
          )}

          <p className={`${labelClass} pb-3 pt-4`}>Layer</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onReorder('front')} className={iconButton} aria-label="Bring to front" title="Bring to front">
              <ArrowUpToLine size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onReorder('forward')} className={iconButton} aria-label="Bring forward" title="Bring forward">
              <ArrowUp size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onReorder('backward')} className={iconButton} aria-label="Send backward" title="Send backward">
              <ArrowDown size={16} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onReorder('back')} className={iconButton} aria-label="Send to back" title="Send to back">
              <ArrowDownToLine size={16} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-4">
            <button type="button" onClick={handleDuplicate} className={iconButton} aria-label="Duplicate" title="Duplicate (Ctrl+D)">
              <Copy size={16} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={`${iconButton} hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/20`}
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesPanel;
