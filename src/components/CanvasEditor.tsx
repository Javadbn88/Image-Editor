import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Group } from 'fabric';
import Toolbar from './Toolbar';
import type { ImageShape } from './Toolbar';
import Header from './Header';
import PropertiesPanel from './PropertiesPanel';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const STORAGE_KEY = 'image-editor-project-v1';
const HISTORY_LIMIT = 50;

const buildImageClipPath = (
  shape: ImageShape,
  obj: fabric.FabricImage
): fabric.Object | undefined => {
  const size = Math.min(obj.width, obj.height);

  switch (shape) {
    case 'rounded':
      return new fabric.Rect({
        width: obj.width,
        height: obj.height,
        rx: size * 0.15,
        ry: size * 0.15,
        originX: 'center',
        originY: 'center',
      });
    case 'circle':
      return new fabric.Circle({
        radius: size / 2,
        originX: 'center',
        originY: 'center',
      });
    default:
      return undefined;
  }
};

const CanvasEditor = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [displaySize, setDisplaySize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    offsetY: 0,
  });

  const [selected, setSelected] = useState<fabric.Object | null>(null);
  const [selectionTick, setSelectionTick] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [bgColor, setBgColor] = useState('#000000');

  const historyRef = useRef<{ stack: string[]; index: number }>({
    stack: [],
    index: -1,
  });
  const isRestoringRef = useRef(false);
  const clipboardRef = useRef<fabric.Object | null>(null);
  const nudgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReady = (canvas: fabric.Canvas) => {
    canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    onReady(canvas);
  };

  const pushHistory = () => {
    if (!editor || isRestoringRef.current) return;
    const json = JSON.stringify(editor.canvas.toJSON());
    const h = historyRef.current;
    const trimmed = h.stack.slice(0, h.index + 1);
    trimmed.push(json);
    h.stack = trimmed.slice(-HISTORY_LIMIT);
    h.index = h.stack.length - 1;
    setCanUndo(h.index > 0);
    setCanRedo(false);
    try {
      localStorage.setItem(STORAGE_KEY, json);
    } catch {}
  };

  const restoreFromHistory = (index: number) => {
    if (!editor) return;
    const json = historyRef.current.stack[index];
    if (json === undefined) return;

    isRestoringRef.current = true;
    editor.canvas.loadFromJSON(JSON.parse(json)).then(() => {
      editor.canvas.requestRenderAll();
      isRestoringRef.current = false;
      setCanUndo(historyRef.current.index > 0);
      setCanRedo(historyRef.current.index < historyRef.current.stack.length - 1);
      setSelected(editor.canvas.getActiveObject() ?? null);
      setSelectionTick((t) => t + 1);
      setBgColor((editor.canvas.backgroundColor as string) || '#000000');
      try {
        localStorage.setItem(STORAGE_KEY, json);
      } catch {}
    });
  };

  const undo = () => {
    const h = historyRef.current;
    if (h.index <= 0) return;
    h.index -= 1;
    restoreFromHistory(h.index);
  };

  const redo = () => {
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    restoreFromHistory(h.index);
  };

  const addSquare = () => {
    if (!editor) return;
    const square = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: 'white',
      transparentCorners: false,
    });
    editor.canvas.add(square);
    editor.canvas.setActiveObject(square);
    editor.canvas.renderAll();
  };

  const addCircle = () => {
    if (!editor) return;
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'white',
      originX: 'center',
      originY: 'center',
      transparentCorners: false,
    });
    editor.canvas.add(circle);
    editor.canvas.setActiveObject(circle);
    editor.canvas.renderAll();
  };

  const addTriangle = () => {
    if (!editor) return;
    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'white',
      originX: 'center',
      originY: 'center',
      transparentCorners: false,
    });
    editor.canvas.add(triangle);
    editor.canvas.setActiveObject(triangle);
    editor.canvas.renderAll();
  };

  const addEllipse = () => {
    if (!editor) return;
    const ellipse = new fabric.Ellipse({
      left: 100,
      top: 100,
      rx: 70,
      ry: 40,
      fill: 'white',
      originX: 'center',
      originY: 'center',
      transparentCorners: false,
    });
    editor.canvas.add(ellipse);
    editor.canvas.setActiveObject(ellipse);
    editor.canvas.renderAll();
  };

  const addLine = () => {
    if (!editor) return;
    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: 'white',
      strokeWidth: 3,
      transparentCorners: false,
    });
    editor.canvas.add(line);
    editor.canvas.setActiveObject(line);
    editor.canvas.renderAll();
  };

  const addStar = () => {
    if (!editor) return;
    const points = [];
    const outerRadius = 50;
    const innerRadius = 20;
    const numPoints = 5;
    for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / numPoints) * i - Math.PI / 2;
      points.push({
        x: outerRadius + radius * Math.cos(angle),
        y: outerRadius + radius * Math.sin(angle),
      });
    }
    const star = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: 'white',
      originX: 'center',
      originY: 'center',
      transparentCorners: false,
    });
    editor.canvas.add(star);
    editor.canvas.setActiveObject(star);
    editor.canvas.renderAll();
  };

  const addImageFromUrl = async (url: string) => {
    if (!editor) return;
    try {
      const image = await fabric.FabricImage.fromURL(url, {
        crossOrigin: 'anonymous',
      });
      image.scaleToWidth(200);
      image.set({ left: 100, top: 100 });
      editor.canvas.add(image);
      editor.canvas.setActiveObject(image);
      editor.canvas.renderAll();
    } catch (error) {
      console.error('Error', error);
    }
  };

  const addImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      addImageFromUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const setImageShape = (shape: ImageShape) => {
    if (!editor) return;
    const obj = editor.canvas.getActiveObject();
    if (!obj || obj.type !== 'image') return;
    obj.clipPath = buildImageClipPath(shape, obj as fabric.FabricImage);
    obj.dirty = true;
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const deleteSelected = () => {
    if (!editor) return;
    const activeObjects = editor.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    activeObjects.forEach((obj) => editor.canvas.remove(obj));
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!editor) return;
    const active = editor.canvas.getActiveObject();
    if (!active) return;
    active.clone().then((cloned: fabric.Object) => {
      cloned.set({
        left: (active.left ?? 0) + 24,
        top: (active.top ?? 0) + 24,
      });
      editor.canvas.add(cloned);
      editor.canvas.setActiveObject(cloned);
      editor.canvas.requestRenderAll();
    });
  };

  const copySelected = () => {
    const active = editor?.canvas.getActiveObject();
    if (!active) return;
    active.clone().then((cloned: fabric.Object) => {
      clipboardRef.current = cloned;
    });
  };

  const pasteFromClipboard = () => {
    if (!editor || !clipboardRef.current) return;
    clipboardRef.current.clone().then((cloned: fabric.Object) => {
      editor.canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left ?? 0) + 24,
        top: (cloned.top ?? 0) + 24,
      });
      editor.canvas.add(cloned);
      editor.canvas.setActiveObject(cloned);
      editor.canvas.requestRenderAll();
    });
  };

  const reorderSelected = (action: 'front' | 'back' | 'forward' | 'backward') => {
    if (!editor) return;
    const active = editor.canvas.getActiveObject();
    if (!active) return;
    const canvas = editor.canvas;
    if (action === 'front') canvas.bringObjectToFront(active);
    if (action === 'back') canvas.sendObjectToBack(active);
    if (action === 'forward') canvas.bringObjectForward(active);
    if (action === 'backward') canvas.sendObjectBackwards(active);
    canvas.requestRenderAll();
    pushHistory();
  };

  const alignSelected = (
    direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => {
    if (!editor) return;
    const active = editor.canvas.getActiveObject();
    if (!active) return;

    const bound = active.getBoundingRect();
    const canvasW = CANVAS_WIDTH;
    const canvasH = CANVAS_HEIGHT;

    switch (direction) {
      case 'left':
        active.set({ left: (active.left ?? 0) - bound.left });
        break;
      case 'center':
        active.set({
          left: (active.left ?? 0) + (canvasW / 2 - (bound.left + bound.width / 2)),
        });
        break;
      case 'right':
        active.set({
          left: (active.left ?? 0) + (canvasW - (bound.left + bound.width)),
        });
        break;
      case 'top':
        active.set({ top: (active.top ?? 0) - bound.top });
        break;
      case 'middle':
        active.set({
          top: (active.top ?? 0) + (canvasH / 2 - (bound.top + bound.height / 2)),
        });
        break;
      case 'bottom':
        active.set({
          top: (active.top ?? 0) + (canvasH - (bound.top + bound.height)),
        });
        break;
    }

    active.setCoords();
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const flipSelected = (axis: 'x' | 'y') => {
    if (!editor) return;
    const active = editor.canvas.getActiveObject();
    if (!active) return;

    if (axis === 'x') {
      active.set('flipX', !active.flipX);
    } else {
      active.set('flipY', !active.flipY);
    }

    active.setCoords();
    editor.canvas.requestRenderAll();
    pushHistory();
  };

const groupSelected = () => {
    if (!editor) return;
    
    const canvas = editor.canvas;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'activeselection') return;

    const selection = active as fabric.ActiveSelection;
    const objects = selection.getObjects();

    canvas.discardActiveObject();
    canvas.remove(...objects);

    const group = new Group(objects);
    canvas.add(group);

    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    pushHistory();
    setSelected(group);
    setSelectionTick((t) => t + 1);
  };

  const ungroupSelected = () => {
    if (!editor) return;
    const canvas = editor.canvas;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'group') return;

    const group = active as fabric.Group;
    const items = group.removeAll();
    canvas.remove(group);
    items.forEach((item) => canvas.add(item));

    const sel = new fabric.ActiveSelection(items, { canvas });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
    pushHistory();
    setSelected(sel);
    setSelectionTick((t) => t + 1);
  };

  const setBackgroundColor = (color: string) => {
    if (!editor) return;
    setBgColor(color);
    editor.canvas.backgroundColor = color;
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const clearCanvas = () => {
    if (!editor) return;
    if (!window.confirm('یک کانواس جدید شروع بشه؟ همه چیز پاک می‌شه.')) return;
    editor.canvas.clear();
    editor.canvas.backgroundColor = bgColor;
    editor.canvas.requestRenderAll();
    historyRef.current = { stack: [], index: -1 };
    pushHistory();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = editor?.canvas.getActiveObject();
      const isTyping = (activeObject as any)?.isEditing;

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        deleteSelected();
        return;
      }

      if (isTyping) return;

      const meta = e.ctrlKey || e.metaKey;

      if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }

      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      if (meta && e.key.toLowerCase() === 'c') {
        copySelected();
        return;
      }

      if (meta && e.key.toLowerCase() === 'v') {
        pasteFromClipboard();
        return;
      }

      if (meta && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) ungroupSelected();
        else groupSelected();
        return;
      }

      if (e.key === 'Escape') {
        editor?.canvas.discardActiveObject();
        editor?.canvas.requestRenderAll();
        return;
      }

      if (
        activeObject &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowUp') activeObject.set({ top: (activeObject.top ?? 0) - step });
        if (e.key === 'ArrowDown') activeObject.set({ top: (activeObject.top ?? 0) + step });
        if (e.key === 'ArrowLeft') activeObject.set({ left: (activeObject.left ?? 0) - step });
        if (e.key === 'ArrowRight') activeObject.set({ left: (activeObject.left ?? 0) + step });
        activeObject.setCoords();
        editor?.canvas.requestRenderAll();
        if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
        nudgeTimeoutRef.current = setTimeout(() => pushHistory(), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const updateSelection = () => {
      setSelected(canvas.getActiveObject() ?? null);
      setSelectionTick((t) => t + 1);
    };
    const clearSelection = () => setSelected(null);
    const handleChange = () => pushHistory();

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', clearSelection);
    canvas.on('object:added', handleChange);
    canvas.on('object:modified', handleChange);
    canvas.on('object:removed', handleChange);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      isRestoringRef.current = true;
      canvas
        .loadFromJSON(JSON.parse(saved))
        .then(() => {
          canvas.requestRenderAll();
          isRestoringRef.current = false;
          setBgColor((canvas.backgroundColor as string) || '#000000');
          pushHistory();
        })
        .catch(() => {
          isRestoringRef.current = false;
          pushHistory();
        });
    } else {
      pushHistory();
    }

    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared', clearSelection);
      canvas.off('object:added', handleChange);
      canvas.off('object:modified', handleChange);
      canvas.off('object:removed', handleChange);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const recalc = () => {
      const isMobile = window.innerWidth < 640;
      const headerSpace = isMobile ? 76 : 96;
      const dockSpace = isMobile ? 96 : 32;
      const sideSpace = isMobile ? 24 : 220;
      const availableWidth = Math.max(240, window.innerWidth - sideSpace);
      const availableHeight = Math.max(180, window.innerHeight - headerSpace - dockSpace);
      const scale = Math.min(1, availableWidth / CANVAS_WIDTH, availableHeight / CANVAS_HEIGHT);
      const width = Math.round(CANVAS_WIDTH * scale);
      const height = Math.round(CANVAS_HEIGHT * scale);
      const offsetY = Math.round((headerSpace - dockSpace) / 2);
      canvas.setDimensions({ width, height }, { cssOnly: true });
      canvas.calcOffset();
      canvas.requestRenderAll();
      setDisplaySize({ width, height, offsetY });
    };

    recalc();
    window.addEventListener('resize', recalc);
    window.addEventListener('orientationchange', recalc);
    return () => {
      window.removeEventListener('resize', recalc);
      window.removeEventListener('orientationchange', recalc);
    };
  }, [editor]);

  const exportImage = () => {
    if (!editor) return;
    const dataUrl = editor.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image-editor-export.png';
    link.click();
  };

  const addText = () => {
    if (!editor) return;
    const text = new fabric.IText('New text...', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 24,
      fill: '#ffffff',
      editable: true,
    });
    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
    text.enterEditing();
    text.selectAll();
  };

  const addTextBox = () => {
    if (!editor) return;
    const text = new fabric.Textbox('New text...', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 24,
      fill: '#ffffff',
      editable: true,
    });
    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
    text.enterEditing();
    text.selectAll();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <Header
        onDelete={deleteSelected}
        onExport={exportImage}
        onNewCanvas={clearCanvas}
        bgColor={bgColor}
        onBgColorChange={setBackgroundColor}
      />

      <Toolbar
        onAddSquare={addSquare}
        onAddCircle={addCircle}
        onAddTriangle={addTriangle}
        onAddEllipse={addEllipse}
        onAddLine={addLine}
        onAddStar={addStar}
        onAddImageFromFile={addImageFromFile}
        onAddImageFromUrl={addImageFromUrl}
        onAddText={addText}
        onAddTextBox={addTextBox}
        onSetImageShape={setImageShape}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {selected && (
        <PropertiesPanel
          key={selectionTick}
          object={selected}
          onChange={() => editor?.canvas.requestRenderAll()}
          onCommit={pushHistory}
          onDuplicate={duplicateSelected}
          onDelete={deleteSelected}
          onReorder={reorderSelected}
          onAlign={alignSelected}
          onFlip={flipSelected}
          onGroup={groupSelected}
          onUngroup={ungroupSelected}
        />
      )}

      <div
        style={{
          width: displaySize.width,
          height: displaySize.height,
          marginTop: displaySize.offsetY,
        }}
      >
        <FabricJSCanvas
          className="border-2 border-gray-800 shadow-xl bg-black touch-none"
          onReady={handleReady}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;