import { useState, useEffect } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';

import Toolbar from './Toolbar';
import Header from './Header';
import PropertiesPanel from './PropertiesPanel';
import LayerPanel from "./LayerPanel";

import { useCanvasSelection } from '../hooks/useCanvasSelection';
import { useCanvasHistory } from '../hooks/useCanvasHistory';
import { useResponsiveCanvas } from '../hooks/useResponsiveCanvas';
import { useShapeTools } from '../hooks/useShapeTools';
import { useImageTools } from '../hooks/useImageTools';
import { useObjectActions } from '../hooks/useObjectActions';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../lib/canvas-constants';

const CanvasEditor = () => {
  const { editor, onReady } = useFabricJSEditor();

  const [layerObjects, setLayerObjects] =
    useState<fabric.Object[]>([]);

  const {
    selected,
    selectionTick,
    bumpSelection,
  } = useCanvasSelection(editor);

  const {
    canUndo,
    canRedo,
    bgColor,
    pushHistory,
    undo,
    redo,
    setBackgroundColor,
    clearCanvas,
  } = useCanvasHistory({
    editor,
    onRestoreSelection: bumpSelection,
  });

  const displaySize =
    useResponsiveCanvas(editor);

  const shapeTools =
    useShapeTools(editor);

  const {
    addImageFromUrl,
    addImageFromFile,
    setImageShape,
  } = useImageTools(
    editor,
    pushHistory
  );

  const objectActions =
    useObjectActions(
      editor,
      pushHistory,
      bumpSelection
    );

  const refreshLayers = () => {
    if (!editor) return;

    setLayerObjects(
      editor.canvas.getObjects().slice()
    );
  };

  useEffect(() => {
    if (!editor) return;

    const canvas = editor.canvas;

    const updateLayers = () => {
      setLayerObjects(
        canvas.getObjects().slice()
      );
    };

    updateLayers();

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [editor]);

  useKeyboardShortcuts({
    editor,
    deleteSelected:
      objectActions.deleteSelected,
    undo,
    redo,
    duplicateSelected:
      objectActions.duplicateSelected,
    copySelected:
      objectActions.copySelected,
    pasteFromClipboard:
      objectActions.pasteFromClipboard,
    groupSelected:
      objectActions.groupSelected,
    ungroupSelected:
      objectActions.ungroupSelected,
    pushHistory,
  });

  const handleReady = (
    canvas: fabric.Canvas
  ) => {
    canvas.setDimensions({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    onReady(canvas);
  };

  const handleLayerSelect = (
    object: fabric.Object
  ) => {
    objectActions.selectObject(object);
  };

  const handleBringToFront = (
    object: fabric.Object
  ) => {
    objectActions.reorderObject(
      object,
      "front"
    );

    refreshLayers();
  };

  const handleSendToBack = (
    object: fabric.Object
  ) => {
    objectActions.reorderObject(
      object,
      "back"
    );

    refreshLayers();
  };

  const handleToggleLock = (
    object: fabric.Object
  ) => {
    objectActions.toggleLock(object);
    refreshLayers();
  };

  const handleLayerDelete = (
    object: fabric.Object
  ) => {
    objectActions.deleteObject(object);
    refreshLayers();
  };

  const exportImage = (
    fileName: string
  ) => {
    if (!editor) return;

    const trimmedFileName =
      fileName.trim();

    if (!trimmedFileName) return;

    try {
      const canvas = editor.canvas;

      canvas.requestRenderAll();

      const dataUrl =
        canvas.toDataURL({
          format: "png",
          multiplier: 1,
        });

      const link =
        document.createElement("a");

      link.href = dataUrl;

      link.download =
        `${trimmedFileName.replace(
          /\.png$/i,
          ""
        )}.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error(
        "Failed to export canvas as PNG:",
        error
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4">
      <Header
        onDelete={
          objectActions.deleteSelected
        }
        onExport={exportImage}
        onNewCanvas={clearCanvas}
        bgColor={bgColor}
        onBgColorChange={
          setBackgroundColor
        }
      />

      <LayerPanel
        objects={layerObjects}
        selected={selected}
        onSelect={handleLayerSelect}
        onBringToFront={
          handleBringToFront
        }
        onSendToBack={
          handleSendToBack
        }
        onToggleLock={
          handleToggleLock
        }
        onDelete={
          handleLayerDelete
        }
      />

      <Toolbar
        onAddSquare={
          shapeTools.addSquare
        }
        onAddCircle={
          shapeTools.addCircle
        }
        onAddTriangle={
          shapeTools.addTriangle
        }
        onAddEllipse={
          shapeTools.addEllipse
        }
        onAddLine={
          shapeTools.addLine
        }
        onAddStar={
          shapeTools.addStar
        }
        onAddImageFromFile={
          addImageFromFile
        }
        onAddImageFromUrl={
          addImageFromUrl
        }
        onAddText={
          shapeTools.addText
        }
        onAddTextBox={
          shapeTools.addTextBox
        }
        onSetImageShape={
          setImageShape
        }
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {selected && (
        <PropertiesPanel
          key={selectionTick}
          object={selected}
          onChange={() =>
            editor?.canvas.requestRenderAll()
          }
          onCommit={pushHistory}
          onDuplicate={
            objectActions.duplicateSelected
          }
          onDelete={
            objectActions.deleteSelected
          }
          onReorder={
            objectActions.reorderSelected
          }
          onAlign={
            objectActions.alignSelected
          }
          onFlip={
            objectActions.flipSelected
          }
          onGroup={
            objectActions.groupSelected
          }
          onUngroup={
            objectActions.ungroupSelected
          }
        />
      )}

      <div
        style={{
          width: displaySize.width,
          height: displaySize.height,
          marginTop: displaySize.offsetY,
        }}
      >
        <FabricJSCanvas
          className="
            touch-none
            border-2
            border-gray-800
            bg-black
            shadow-xl
          "
          onReady={handleReady}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
