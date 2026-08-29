import { useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

const addShapeToCanvas = (canvas: fabric.Canvas, obj: fabric.Object) => {
  canvas.add(obj);
  canvas.setActiveObject(obj);
  canvas.renderAll();
};

export const useShapeTools = (editor: FabricEditor) => {
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
    addShapeToCanvas(editor.canvas, square);
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
    addShapeToCanvas(editor.canvas, circle);
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
    addShapeToCanvas(editor.canvas, triangle);
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
    addShapeToCanvas(editor.canvas, ellipse);
  };

  const addLine = () => {
    if (!editor) return;
    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: 'white',
      strokeWidth: 3,
      transparentCorners: false,
    });
    addShapeToCanvas(editor.canvas, line);
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
    addShapeToCanvas(editor.canvas, star);
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
    addShapeToCanvas(editor.canvas, text);
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
    addShapeToCanvas(editor.canvas, text);
    text.enterEditing();
    text.selectAll();
  };

  return {
    addSquare,
    addCircle,
    addTriangle,
    addEllipse,
    addLine,
    addStar,
    addText,
    addTextBox,
  };
};