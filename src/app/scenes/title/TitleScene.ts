import Scene from "../../core/sceneManagement/Scene";
import GraphicsButton from "../../core/gui/GraphicsButton";
import GameScene from "../game/GameScene";
import { Sound } from "@pixi/sound";
import { Viewport } from "pixi-viewport";
import { Sprite } from "pixi.js";
import anime, { AnimeInstance } from "animejs";
import { Assets } from "@pixi/assets";

export default class TitleScene extends Scene {
    public static readonly NAME = "Title";

    private _viewport: Viewport = this._createViewport();
    private _animation: AnimeInstance | null = null;
    private _music: Sound | null = null;

    public init(): void {
        this._createBackground();
        this._createLogo();
        const thumbnail = this._createThumbnail();
        this._createStartButton();

        this._animation = anime({
            targets: thumbnail.scale,
            x: 1.2,
            y: 1.2,
            direction: "alternate",
            loop: true,
            easing: "easeInBack",
            duration: 500,
            delay: 100,
        });

        this._music = Assets.cache.get("assets/sounds/music_titleScreen.ogg") as Sound;
        this._music.loop = true;
        this._music.play();
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(0, 0);
    }

    public destroy(): void {
        if (this._animation) anime.remove(this._animation);
        if (this._music) this._music.stop();
    }

    private _createStartButton(): GraphicsButton {
        const button = new GraphicsButton("START", 200, 50);
        button.position.set(0, 100);
        button.on("pointerdown", () => this.director.goTo(GameScene.NAME));
        return this._viewport.addChild(button);
    }

    private _createViewport(): Viewport {
        return this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: 600,
                worldHeight: 420,
            }),
        );
    }

    private _createBackground(): Sprite {
        const sprite = Sprite.from("assets/textures/menu/background.png");
        sprite.anchor.set(0.5);
        sprite.width = this._viewport.worldWidth;
        sprite.height = this._viewport.worldHeight;
        return this._viewport.addChild(sprite);
    }

    private _createLogo(): Sprite {
        const sprite = Sprite.from("assets/textures/menu/logo.png");
        sprite.position.set(0, -200);
        sprite.anchor.set(0.5);
        return this._viewport.addChild(sprite);
    }

    private _createThumbnail(): Sprite {
        const sprite = Sprite.from("assets/textures/menu/thumbnail.png");
        sprite.position.set(-this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
        sprite.anchor.set(0, 1);
        return this._viewport.addChild(sprite);
    }
}
