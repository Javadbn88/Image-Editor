import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';

import Toolbar from './Toolbar';
import Header from './Header';
import PropertiesPanel from './PropertiesPanel';

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

  const { selected, selectionTick, bumpSelection } = useCanvasSelection(editor);
  const { canUndo, canRedo, bgColor, pushHistory, undo, redo, setBackgroundColor, clearCanvas } =
    useCanvasHistory({ editor, onRestoreSelection: bumpSelection });
  const displaySize = useResponsiveCanvas(editor);

  const shapeTools = useShapeTools(editor);
  const { addImageFromUrl, addImageFromFile, setImageShape } = useImageTools(editor, pushHistory);
  const objectActions = useObjectActions(editor, pushHistory, bumpSelection);

  useKeyboardShortcuts({
    editor,
    deleteSelected: objectActions.deleteSelected,
    undo,
    redo,
    duplicateSelected: objectActions.duplicateSelected,
    copySelected: objectActions.copySelected,
    pasteFromClipboard: objectActions.pasteFromClipboard,
    groupSelected: objectActions.groupSelected,
    ungroupSelected: objectActions.ungroupSelected,
    pushHistory,
  });

  const handleReady = (canvas: fabric.Canvas) => {
    canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
    onReady(canvas);
  };

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

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <Header
        onDelete={objectActions.deleteSelected}
        onExport={exportImage}
        onNewCanvas={clearCanvas}
        bgColor={bgColor}
        onBgColorChange={setBackgroundColor}
      />

      <Toolbar
        onAddSquare={shapeTools.addSquare}
        onAddCircle={shapeTools.addCircle}
        onAddTriangle={shapeTools.addTriangle}
        onAddEllipse={shapeTools.addEllipse}
        onAddLine={shapeTools.addLine}
        onAddStar={shapeTools.addStar}
        onAddImageFromFile={addImageFromFile}
        onAddImageFromUrl={addImageFromUrl}
        onAddText={shapeTools.addText}
        onAddTextBox={shapeTools.addTextBox}
        onSetImageShape={setImageShape}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {selected && (
        <PropertiesPanel
          key={selectionTick}
          object={selected}
          onChange={() => editor?.canvas.requestRenderAll()}
          onCommit={pushHistory}
          onDuplicate={objectActions.duplicateSelected}
          onDelete={objectActions.deleteSelected}
          onReorder={objectActions.reorderSelected}
          onAlign={objectActions.alignSelected}
          onFlip={objectActions.flipSelected}
          onGroup={objectActions.groupSelected}
          onUngroup={objectActions.ungroupSelected}
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
          className="border-2 border-gray-800 shadow-xl bg-black touch-none"
          onReady={handleReady}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
