import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';
import Toolbar from './Toolbar';
import Header from './Header';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const CanvasEditor = () => {
  const { editor, onReady } = useFabricJSEditor();

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

  return (
    <div className="flex flex-col items-center gap-6">
      <Header onDelete={deleteSelected} />

      <Toolbar
        onAddSquare={addSquare}
        onAddCircle={addCircle}
        onAddTriangle={addTriangle}
        onAddEllipse={addEllipse}
        onAddLine={addLine}
        onAddStar={addStar}
        onAddImageFromFile={addImageFromFile}
        onAddImageFromUrl={addImageFromUrl}
      />

      <FabricJSCanvas
        className="border-2 border-gray-800 shadow-xl bg-black"
        onReady={handleReady}
      />
    </div>
  );
};

export default CanvasEditor;
