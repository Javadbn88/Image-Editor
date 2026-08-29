import { useEffect, useState } from 'react';
import { useFabricJSEditor } from 'fabricjs-react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../lib/canvas-constants';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

export const useResponsiveCanvas = (editor: FabricEditor) => {
  const [displaySize, setDisplaySize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    offsetY: 0,
  });

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

  return displaySize;
};