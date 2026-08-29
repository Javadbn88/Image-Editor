import { useEffect, useState } from 'react';
import { useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

export const useCanvasSelection = (editor: FabricEditor) => {
  const [selected, setSelected] = useState<fabric.Object | null>(null);
  const [selectionTick, setSelectionTick] = useState(0);

  const bumpSelection = (object: fabric.Object | null) => {
    setSelected(object);
    setSelectionTick((t) => t + 1);
  };

  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const updateSelection = () => {
      bumpSelection(canvas.getActiveObject() ?? null);
    };
    const clearSelection = () => setSelected(null);

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', clearSelection);

    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared', clearSelection);
    };
  }, [editor]);

  return { selected, selectionTick, bumpSelection };
};