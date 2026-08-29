import { useEffect, useRef, useState } from 'react';
import { useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';
import { HISTORY_LIMIT, STORAGE_KEY } from '../lib/canvas-constants';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

interface UseCanvasHistoryParams {
  editor: FabricEditor;
  onRestoreSelection: (object: fabric.Object | null) => void;
}

export const useCanvasHistory = ({ editor, onRestoreSelection }: UseCanvasHistoryParams) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [bgColor, setBgColor] = useState('#000000');

  const historyRef = useRef<{ stack: string[]; index: number }>({
    stack: [],
    index: -1,
  });
  const isRestoringRef = useRef(false);

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
      onRestoreSelection(editor.canvas.getActiveObject() ?? null);
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

  const setBackgroundColor = (color: string) => {
    if (!editor) return;
    setBgColor(color);
    editor.canvas.backgroundColor = color;
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const clearCanvas = () => {
    if (!editor) return;
    if (!window.confirm('Do want to clear canvas?')) return;
    editor.canvas.clear();
    editor.canvas.backgroundColor = bgColor;
    editor.canvas.requestRenderAll();
    historyRef.current = { stack: [], index: -1 };
    pushHistory();
  };

  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const handleChange = () => pushHistory();

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
      canvas.off('object:added', handleChange);
      canvas.off('object:modified', handleChange);
      canvas.off('object:removed', handleChange);
    };
  }, [editor]);

  return {
    canUndo,
    canRedo,
    bgColor,
    pushHistory,
    undo,
    redo,
    setBackgroundColor,
    clearCanvas,
  };
};
