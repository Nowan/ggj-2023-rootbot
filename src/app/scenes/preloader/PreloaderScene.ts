import Scene, { FacadeRefs } from "../../core/sceneManagement/Scene";
import { Assets } from "@pixi/assets";
import { Sound } from "@pixi/sound";
import { Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";
import ProgressBar from "./ProgressBar";
import TitleScene from "../title/TitleScene";

const LEVEL_DATA_PATH = "assets/levels/main.tiled.json";

export default class PreloaderScene extends Scene {
    public static readonly NAME = "Preloader";

    private _viewport: Viewport;
    private _progressBar: ProgressBar;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._viewport = this._createViewport();
        this._progressBar = this._createProgressBar();
    }

    public async load(): Promise<void> {
        await Assets.load("assets/textures/thumbnail.png");
    }

    public async init(): Promise<void> {
        const sprite = this._createSprite();

        this._progressBar.position.set(sprite.x - sprite.width * 0.5, sprite.y + sprite.height * 0.5);
        this._progressBar.setProgress(1);

        await this._loadGameAssets();

        this.director.goTo(TitleScene.NAME);
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(0, 0);
    }

    private async _loadGameAssets() {
        const texturesAndDataAssetsPaths = [
            LEVEL_DATA_PATH,
            "assets/textures/menu.json",
            "assets/textures/terrain.json",
            "assets/textures/character.json",
            "assets/textures/building.json",
        ];

        const soundAssetsPaths = [
            "assets/sounds/music_titleScreen.ogg",
            "assets/sounds/music_main.ogg",
            "assets/sounds/music_liftup.ogg",
            "assets/sounds/sound_rooting.ogg",
            "assets/sounds/sound_uprooting.ogg",
            "assets/sounds/sound_steps.ogg",
            "assets/sounds/sound_lose.ogg",
        ];

        let totalProgress = 0;
        const assetsPaths = [...texturesAndDataAssetsPaths, ...soundAssetsPaths];
        const textureProgressMultiplier = texturesAndDataAssetsPaths.length / assetsPaths.length;

        texturesAndDataAssetsPaths.forEach((assetPath) => Assets.add(assetPath, assetPath));

        await Assets.load(assetsPaths, (progress) => {
            totalProgress = progress * textureProgressMultiplier;
            this._progressBar.setProgress(totalProgress);
        });

        const leftoverProgress = 1 - totalProgress;
        const soundProgressStep = leftoverProgress / soundAssetsPaths.length;

        for (let soundAssetPath of soundAssetsPaths) {
            await loadSoundAsset(soundAssetPath);

            totalProgress += soundProgressStep;
            this._progressBar.setProgress(totalProgress);
        }
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

    private _createProgressBar(): ProgressBar {
        return this._viewport.addChild(new ProgressBar(320));
    }

    private _createSprite(): Sprite {
        const sprite = Sprite.from("assets/textures/thumbnail.png");
        sprite.anchor.set(0.5);
        return this._viewport.addChild(sprite);
    }
}

async function loadSoundAsset(soundPath: string): Promise<Sound> {
    return new Promise((resolve, reject) => {
        return Sound.from({
            url: soundPath,
            preload: true,
            loaded: (error, sound) => {
                if (sound) {
                    Assets.cache.set(soundPath, sound);
                    resolve(sound);
                } else {
                    reject(error);
                }
            },
        });
    });
}
