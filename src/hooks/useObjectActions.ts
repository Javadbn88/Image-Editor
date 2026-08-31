import { useRef } from "react";
import { useFabricJSEditor } from "fabricjs-react";
import * as fabric from "fabric";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../lib/canvas-constants";

type FabricEditor =
  ReturnType<typeof useFabricJSEditor>["editor"];

export const useObjectActions = (
  editor: FabricEditor,
  pushHistory: () => void,
  bumpSelection: (
    object: fabric.Object | null
  ) => void
) => {
  const clipboardRef =
    useRef<fabric.Object | null>(null);

  const selectObject = (object: fabric.Object) => {
    if (!editor) return;
    if (object.selectable === false) return;

    editor.canvas.discardActiveObject();
    editor.canvas.setActiveObject(object);
    editor.canvas.requestRenderAll();

    bumpSelection(object);
  };

  const deleteObject = (object: fabric.Object) => {
    if (!editor) return;
    if (object.selectable === false) return;

    const canvas = editor.canvas;
    const activeObject = canvas.getActiveObject();

    canvas.remove(object);

    if (activeObject === object) {
      canvas.discardActiveObject();
      bumpSelection(null);
    }

    canvas.requestRenderAll();
    pushHistory();
  };

  const deleteSelected = () => {
    if (!editor) return;

    const canvas = editor.canvas;
    const activeObjects = canvas.getActiveObjects();

    if (activeObjects.length === 0) return;

    const unlockedObjects = activeObjects.filter(
      (object) => object.selectable !== false
    );

    if (unlockedObjects.length === 0) return;

    unlockedObjects.forEach((object) => {
      canvas.remove(object);
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    bumpSelection(null);
    pushHistory();
  };

  const toggleLock = (object: fabric.Object) => {
    if (!editor) return;

    const canvas = editor.canvas;
    const shouldLock = object.selectable !== false;

    object.set({
      selectable: !shouldLock,
      evented: !shouldLock,
    });

    if (shouldLock && canvas.getActiveObject() === object) {
      canvas.discardActiveObject();
      bumpSelection(null);
    }

    object.setCoords();
    canvas.requestRenderAll();
    pushHistory();
  };

  const duplicateSelected = () => {
    if (!editor) return;

    const active = editor.canvas.getActiveObject();

    if (!active) return;
    if (active.selectable === false) return;

    active.clone().then((cloned: fabric.Object) => {
      cloned.set({
        left: (active.left ?? 0) + 24,
        top: (active.top ?? 0) + 24,
      });

      editor.canvas.add(cloned);
      editor.canvas.setActiveObject(cloned);
      editor.canvas.requestRenderAll();

      bumpSelection(cloned);
      pushHistory();
    });
  };

  const copySelected = () => {
    const active = editor?.canvas.getActiveObject();

    if (!active) return;
    if (active.selectable === false) return;

    active.clone().then((cloned: fabric.Object) => {
      clipboardRef.current = cloned;
    });
  };

  const pasteFromClipboard = () => {
    if (!editor || !clipboardRef.current) return;

    clipboardRef.current.clone().then((cloned: fabric.Object) => {
      editor.canvas.discardActiveObject();

      cloned.set({
        left: (cloned.left ?? 0) + 24,
        top: (cloned.top ?? 0) + 24,
      });

      editor.canvas.add(cloned);
      editor.canvas.setActiveObject(cloned);
      editor.canvas.requestRenderAll();

      bumpSelection(cloned);
      pushHistory();
    });
  };

  const reorderObject = (
    object: fabric.Object,
    action:
      | "front"
      | "back"
      | "forward"
      | "backward"
  ) => {
    if (!editor) return;
    if (object.selectable === false) return;

    const canvas = editor.canvas;

    if (action === "front") {
      canvas.bringObjectToFront(object);
    }

    if (action === "back") {
      canvas.sendObjectToBack(object);
    }

    if (action === "forward") {
      canvas.bringObjectForward(object);
    }

    if (action === "backward") {
      canvas.sendObjectBackwards(object);
    }

    canvas.requestRenderAll();
    pushHistory();
  };

  const reorderSelected = (
    action:
      | "front"
      | "back"
      | "forward"
      | "backward"
  ) => {
    if (!editor) return;

    const active = editor.canvas.getActiveObject();

    if (!active) return;

    reorderObject(active, action);
  };

  const alignSelected = (
    direction:
      | "left"
      | "center"
      | "right"
      | "top"
      | "middle"
      | "bottom"
  ) => {
    if (!editor) return;

    const active = editor.canvas.getActiveObject();

    if (!active) return;
    if (active.selectable === false) return;

    const bound = active.getBoundingRect();
    const canvasW = CANVAS_WIDTH;
    const canvasH = CANVAS_HEIGHT;

    switch (direction) {
      case "left":
        active.set({
          left: (active.left ?? 0) - bound.left,
        });
        break;

      case "center":
        active.set({
          left:
            (active.left ?? 0) +
            (canvasW / 2 -
              (bound.left + bound.width / 2)),
        });
        break;

      case "right":
        active.set({
          left:
            (active.left ?? 0) +
            (canvasW -
              (bound.left + bound.width)),
        });
        break;

      case "top":
        active.set({
          top: (active.top ?? 0) - bound.top,
        });
        break;

      case "middle":
        active.set({
          top:
            (active.top ?? 0) +
            (canvasH / 2 -
              (bound.top + bound.height / 2)),
        });
        break;

      case "bottom":
        active.set({
          top:
            (active.top ?? 0) +
            (canvasH -
              (bound.top + bound.height)),
        });
        break;
    }

    active.setCoords();
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const flipSelected = (axis: "x" | "y") => {
    if (!editor) return;

    const active = editor.canvas.getActiveObject();

    if (!active) return;
    if (active.selectable === false) return;

    if (axis === "x") {
      active.set("flipX", !active.flipX);
    } else {
      active.set("flipY", !active.flipY);
    }

    active.setCoords();
    editor.canvas.requestRenderAll();
    pushHistory();
  };

  const groupSelected = () => {
    if (!editor) return;

    const canvas = editor.canvas;
    const active = canvas.getActiveObject();

    if (!active || active.type !== "activeselection") {
      return;
    }

    const selection =
      active as fabric.ActiveSelection;

    const objects = selection.getObjects();

    if (
      objects.some(
        (object) => object.selectable === false
      )
    ) {
      return;
    }

    canvas.discardActiveObject();
    canvas.remove(...objects);

    const group = new fabric.Group(objects);

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();

    pushHistory();
    bumpSelection(group);
  };

  const ungroupSelected = () => {
    if (!editor) return;

    const canvas = editor.canvas;
    const active = canvas.getActiveObject();

    if (!active || active.type !== "group") {
      return;
    }

    if (active.selectable === false) return;

    const group = active as fabric.Group;
    const items = group.removeAll();

    canvas.remove(group);

    items.forEach((item) => {
      item.set({
        selectable: true,
        evented: true,
      });

      canvas.add(item);
    });

    const selection =
      new fabric.ActiveSelection(items, {
        canvas,
      });

    canvas.setActiveObject(selection);
    canvas.requestRenderAll();

    pushHistory();
    bumpSelection(selection);
  };

  return {
    selectObject,
    deleteObject,
    deleteSelected,
    toggleLock,
    duplicateSelected,
    copySelected,
    pasteFromClipboard,
    reorderObject,
    reorderSelected,
    alignSelected,
    flipSelected,
    groupSelected,
    ungroupSelected,
  };
};
