import { DisplayObject } from "pixi.js";

export interface PixiComponent<DISPLAY_OBJECT extends DisplayObject> {
    pixi: DISPLAY_OBJECT;
}

export default PixiComponent;
