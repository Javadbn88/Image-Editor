import * as fabric from 'fabric';
import type { ImageShape } from '../components/Toolbar';

export const buildImageClipPath = (
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
