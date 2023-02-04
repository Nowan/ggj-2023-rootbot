import { Container, Sprite } from "pixi.js"

const TILE_HEIGHT = 30;

export default class RootsContainer extends Container {
    private _length: number;

    constructor() {
        super();

        this._createTopmostSprite();

        this._length = -1;

        this.setLength(0);
    }

    public setLength(length: number): void {
        if (length === this._length) return;

        this.pivot.y = ((length - 0.5) * TILE_HEIGHT) * 0.5;
        this._length = length;
    }

    _createTopmostSprite() {
        const sprite = Sprite.from("assets/textures/building/root_underground_top.png");
        sprite.anchor.set(0.5);
        return this.addChild(sprite);
    }
}