import anime, { AnimeInstance } from "animejs";
import { Sound } from "@pixi/sound";
import { Container, Sprite, AnimatedSprite, Texture, Rectangle } from "pixi.js";
import { Assets } from "@pixi/assets";

const walkFrames = [
    "assets/textures/character/robot_walk_00.png",
    "assets/textures/character/robot_walk_01.png",
    "assets/textures/character/robot_walk_02.png",
    "assets/textures/character/robot_walk_03.png",
];

export default class RobotContainer extends Container {
    private _idleSprite: Sprite;
    private _idleAnimation: AnimeInstance | null;
    private _walkSprite: AnimatedSprite;
    private _isWalking: boolean;
    private _walkingSound: Sound;

    public staticBounds: Rectangle;

    constructor() {
        super();

        this._idleSprite = this._createIdleSprite();
        this._idleAnimation = null;
        this._walkSprite = this._createWalkSprite();
        this._isWalking = true;
        this._walkingSound = Assets.cache.get("assets/sounds/sound_steps.ogg") as Sound;
        this._walkingSound.loop = true;

        this.staticBounds = new Rectangle(0, 0, this._idleSprite.width, this._idleSprite.height);

        this.setWalking(false);
    }

    public setWalking(flag: boolean): void {
        if (flag === this._isWalking) return;

        this._walkSprite.visible = flag;
        this._idleSprite.visible = !flag;

        if (flag) {
            this._walkingSound.play();
            anime.remove(this._idleAnimation);
        } else {
            this._walkingSound.stop();
            this._idleSprite.scale.set(1);
            this._idleAnimation = anime({
                targets: this._idleSprite.scale,
                y: 0.96,
                x: 1,
                direction: "alternate",
                easing: "steps(2)",
                duration: 100,
                loop: true,
            });
        }

        this._isWalking = flag;
    }

    private _createIdleSprite(): Sprite {
        const sprite = Sprite.from("assets/textures/character/robot_idle_00.png");
        sprite.anchor.set(0.5, 1);
        sprite.position.y += sprite.height * 0.5;
        return this.addChild(sprite);
    }

    private _createWalkSprite(): AnimatedSprite {
        const sprite = new AnimatedSprite(walkFrames.map((framePath) => Texture.from(framePath)));
        sprite.anchor.set(0.5);
        sprite.animationSpeed = 0.25;
        sprite.play();
        return this.addChild(sprite);
    }
}
