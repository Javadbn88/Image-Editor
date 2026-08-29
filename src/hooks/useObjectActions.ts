import { useRef } from 'react';
import { useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../lib/canvas-constants';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

export const useObjectActions = (
  editor: FabricEditor,
  pushHistory: () => void,
  bumpSelection: (object: fabric.Object | null) => void
) => {
  const clipboardRef = useRef<fabric.Object | null>(null);

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

    const group = new fabric.Group(objects);
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    pushHistory();
    bumpSelection(group);
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
    bumpSelection(sel);
  };

  return {
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteFromClipboard,
    reorderSelected,
    alignSelected,
    flipSelected,
    groupSelected,
    ungroupSelected,
  };
};