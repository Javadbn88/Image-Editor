import { useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';
import type { ImageShape } from '../components/Toolbar';
import { buildImageClipPath } from '../lib/image-clip-paths';

type FabricEditor = ReturnType<typeof useFabricJSEditor>['editor'];

export const useImageTools = (editor: FabricEditor, pushHistory: () => void) => {
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

  return { addImageFromUrl, addImageFromFile, setImageShape };
};
