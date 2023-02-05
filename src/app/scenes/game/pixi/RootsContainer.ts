import { Container, Sprite, TilingSprite } from "pixi.js"

const TILE_HEIGHT = 30;

export default class RootsContainer extends Container {
    private _length: number;
    // private _topSprite: Sprite;
    private _middleSprite: Sprite;
    // private _bottomSprite: Sprite;

    constructor() {
        super();

        this._middleSprite = this._createMiddleSprite();
        // this._bottomSprite = this._createEdgeSprite();

        this._length = -1;

        this.setLength(0);
    }

    public setLength(length: number): void {
        if (length === this._length) return;

        this._middleSprite.height = length * TILE_HEIGHT;
        // this._bottomSprite.y = length * TILE_HEIGHT;

        this._length = length;
    }

    _createEdgeSprite() {
        const sprite = Sprite.from("assets/textures/building/root_underground_edge.png");
        sprite.anchor.set(0.5, 0);
        return this.addChild(sprite);
    }

    _createMiddleSprite() {
        const sprite = TilingSprite.from("assets/textures/building/root_underground_through.png", { width: 60, height: 30 });
        sprite.clampMargin = -0.5;
        sprite.anchor.set(0.5, 0);
        sprite.height = 0;
        return this.addChild(sprite);
    }
}