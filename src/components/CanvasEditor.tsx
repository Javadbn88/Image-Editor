import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useEffect, useState } from 'react';
import * as fabric from 'fabric';
import Toolbar from './Toolbar';
import Header from './Header';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const CanvasEditor = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [displaySize, setDisplaySize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    offsetY: 0,
  });

  const handleReady = (canvas: fabric.Canvas) => {
    canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    onReady(canvas);
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

  const deleteSelected = () => {
    if (!editor) return;

    const activeObjects = editor.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    activeObjects.forEach((obj) => editor.canvas.remove(obj));
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = editor?.canvas.getActiveObject();
        if ((activeObject as any)?.isEditing) return;

        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  // Keep the canvas' on-screen size in sync with the viewport, without ever
  // touching its internal 800x500 working resolution. We resize the CSS
  // box only ("cssOnly"), which fabric.js automatically accounts for when
  // translating pointer/touch coordinates — so drawing, dragging and
  // resizing stay perfectly accurate at any screen size.
  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas;

    const recalc = () => {
      const isMobile = window.innerWidth < 640;

      // Reserve space so the canvas never sits under the fixed header
      // or the fixed toolbar.
      const headerSpace = isMobile ? 76 : 96; // top header + margin
      const dockSpace = isMobile ? 96 : 32; // bottom mobile dock / bottom margin
      const sideSpace = isMobile ? 24 : 220; // side padding / desktop left sidebar

      const availableWidth = Math.max(240, window.innerWidth - sideSpace);
      const availableHeight = Math.max(
        180,
        window.innerHeight - headerSpace - dockSpace
      );

      const scale = Math.min(
        1,
        availableWidth / CANVAS_WIDTH,
        availableHeight / CANVAS_HEIGHT
      );

      const width = Math.round(CANVAS_WIDTH * scale);
      const height = Math.round(CANVAS_HEIGHT * scale);

      // Nudge the canvas toward the middle of the free space between the
      // header and the dock/bottom edge, so it's not thrown off-center by
      // the two reserved areas being different sizes.
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
      <Header onDelete={deleteSelected} onExport={exportImage} />

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
      />

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