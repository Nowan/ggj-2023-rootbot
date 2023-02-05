import anime, { AnimeInstance } from "animejs";
import { Container, Graphics, Rectangle, Sprite } from "pixi.js"
import gameConfig from "../../../config/game.config";

const ROOTED_ASSET_PATH = "assets/textures/building/house_root_00.png";
const UNROOTED_ASSET_PATH = "assets/textures/building/house_noroot_00.png"

export default class BuildingContainer extends Container {
    private _buildingSprite: Sprite;
    private _rootSprite: Sprite;
    private _domeSprite: Sprite;
    private _isRooted: boolean;
    private _isGrounded: boolean;
    private _groundedAnimation: AnimeInstance | null;
    public staticBounds: Rectangle;

    constructor() {
        super();

        this._rootSprite = this._createRootSprite();
        this._buildingSprite = this._createBuildingSprite();
        this._domeSprite = this._createDomeSprite();
        this._isGrounded = false;
        this._isRooted = true;
        this._groundedAnimation = null;

        this.staticBounds = new Rectangle(0, 0, this._buildingSprite.width, this._buildingSprite.height);
        this.pivot.y -= this._buildingSprite.height * 0.5;

        this.setGrounded(true);
        this.setRooted(false);
    }

    public setGrounded(flag: boolean) {
        if (flag === this._isGrounded) return;

        this._rootSprite.visible = this._domeSprite.visible = flag;

        if (flag) {
            this._rootSprite.y = -this._rootSprite.height;
            this._domeSprite.y = this._domeSprite.height;

            this._groundedAnimation = anime({
                targets: [this._rootSprite, this._domeSprite],
                y: 0,
                easing: "easeOutSine",
                duration: gameConfig.roots.appearAfterTime * 1000
            })
        }
        else {
            this._rootSprite.visible = false;
            if (this._groundedAnimation) anime.remove(this._groundedAnimation);
        }

        this._isGrounded = flag;
    }

    public setRooted(flag: boolean) {
        if (flag === this._isRooted) return;

        this._isRooted = flag;
    }

    private _createBuildingSprite(): Sprite {
        const sprite = Sprite.from("assets/textures/building/house_noroot_00.png");
        sprite.anchor.set(0.5, 1);
        return this.addChild(sprite);
    }

    private _createRootSprite() {
        const sprite = Sprite.from("assets/textures/building/root_underground_edge.png");
        // sprite.mask = this.addChild(new Graphics().beginFill(0x000000).drawRect(-sprite.width * 0.5, 0, sprite.width, sprite.height).endFill());
        sprite.anchor.set(0.5, 0);
        return this.addChild(sprite);
    }

    private _createDomeSprite() {
        const sprite = Sprite.from("assets/textures/building/root_surface_dome.png");
        sprite.mask = this.addChild(new Graphics().beginFill(0x000000).drawRect(-sprite.width * 0.5, -sprite.height, sprite.width, sprite.height).endFill());
        sprite.anchor.set(0.5, 1);
        return this.addChild(sprite);
    }
}