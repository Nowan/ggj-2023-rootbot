import { Assets } from "@pixi/assets";
import { Sound } from "@pixi/sound";
import anime, { AnimeInstance } from "animejs";
import { Container, Graphics, Rectangle, Sprite } from "pixi.js";

import gameConfig from "../../../config/game.config";

export default class BuildingContainer extends Container {
    private _buildingSprite: Sprite;
    private _rootSprite: Sprite;
    private _domeSprite: Sprite;
    private _isGrounded: boolean;
    private _groundedAnimation: AnimeInstance | null;
    public staticBounds: Rectangle;

    constructor() {
        super();

        this._rootSprite = this._createRootSprite();
        this._buildingSprite = this._createBuildingSprite();
        this._domeSprite = this._createDomeSprite();
        this._isGrounded = false;
        this._groundedAnimation = null;

        this.staticBounds = new Rectangle(0, 0, this._buildingSprite.width, this._buildingSprite.height);
        this.pivot.y -= this._buildingSprite.height * 0.5;

        this.setGrounded(true);
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
                duration: gameConfig.roots.appearAfterTime * 1000,
            });

            const sound = Assets.cache.get("assets/sounds/sound_rooting.ogg") as Sound;
            sound.play();
        } else {
            this._rootSprite.visible = false;
            if (this._groundedAnimation) anime.remove(this._groundedAnimation);

            const sound = Assets.cache.get("assets/sounds/sound_uprooting.ogg") as Sound;
            sound.play();
        }

        this._isGrounded = flag;
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
        sprite.mask = this.addChild(
            new Graphics()
                .beginFill(0x000000)
                .drawRect(-sprite.width * 0.5, -sprite.height, sprite.width, sprite.height)
                .endFill(),
        );
        sprite.anchor.set(0.5, 1);
        return this.addChild(sprite);
    }
}
