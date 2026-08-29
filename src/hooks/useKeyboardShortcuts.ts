import { useEffect, useRef } from 'react';
import { useFabricJSEditor } from 'fabricjs-react';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

interface UseKeyboardShortcutsParams {
  editor: FabricEditor;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  pasteFromClipboard: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  pushHistory: () => void;
}

export const useKeyboardShortcuts = ({
  editor,
  deleteSelected,
  undo,
  redo,
  duplicateSelected,
  copySelected,
  pasteFromClipboard,
  groupSelected,
  ungroupSelected,
  pushHistory,
}: UseKeyboardShortcutsParams) => {
  const nudgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
};