import * as fabric from 'fabric';
import { useFabricJSEditor, FabricJSEditor, FabricJSEditorHook } from './editor';
export interface Props {
    className?: string;
    onReady?: (canvas: fabric.Canvas) => void;
}
/**
 * Fabric canvas as component
 */
declare const FabricJSCanvas: ({ className, onReady }: Props) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export { FabricJSCanvas, useFabricJSEditor };
export type { FabricJSEditor, FabricJSEditorHook };
