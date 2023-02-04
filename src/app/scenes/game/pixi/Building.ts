import { Container, Rectangle, Sprite } from "pixi.js"
import { Assets } from "@pixi/assets";

const ROOTED_ASSET_PATH = "assets/textures/building/house_root_00.png";
const UNROOTED_ASSET_PATH = "assets/textures/building/house_noroot_00.png"

export default class Building extends Container {
    private _rootedSprite: Sprite;
    private _unrootedSprite: Sprite;
    private _isRooted: boolean;
    public staticBounds: Rectangle;

    constructor() {
        super();

        this._rootedSprite = this._createSprite(ROOTED_ASSET_PATH);
        this._unrootedSprite = this._createSprite(UNROOTED_ASSET_PATH);
        this._isRooted = false;

        this.staticBounds = new Rectangle(0, 0, this._rootedSprite.width, this._rootedSprite.height);

        this.setRooted(true);
    }

    public setRooted(flag: boolean) {
        if (flag === this._isRooted) return;
        this._rootedSprite.visible = flag;
        this._unrootedSprite.visible = !flag;
        this._isRooted = flag;
    }

    private _createSprite(assetPath: string): Sprite {
        const sprite = Sprite.from(assetPath);
        sprite.anchor.set(0.5);
        return this.addChild(sprite);
    }
}