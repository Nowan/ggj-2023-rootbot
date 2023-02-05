import { Container, Graphics } from "pixi.js";

export default class ProgressBar extends Container {
    private _maxWidth: number;
    private _barGraphics: Graphics;

    constructor(maxWidth: number) {
        super();

        this._maxWidth = maxWidth;
        this._barGraphics = this._createBarGraphics(maxWidth);

        this._barGraphics.width = 0;
    }

    setProgress(progress: number) {
        this._barGraphics.width = progress * this._maxWidth;
    }

    _createBarGraphics(maxWidth: number) {
        const graphics = new Graphics().beginFill(0xffffff).drawRect(0, 0, maxWidth, 20).endFill();
        return this.addChild(graphics);
    }
}
