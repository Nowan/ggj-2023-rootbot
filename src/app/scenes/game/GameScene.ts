import { Assets } from "@pixi/assets";
import { Sound } from "@pixi/sound";
import { Viewport } from "pixi-viewport";
import Scene, { FacadeRefs } from "../../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import Game, { GameEvent } from "./Game";
import TitleScene from "../title/TitleScene";
import anime from "animejs";

const LEVEL_DATA_PATH = "assets/levels/main.tiled.json";

export default class GameScene extends Scene {
    public static readonly NAME = "Game";

    private _game: Game | null;
    private _viewport: Viewport;
    private _music: Sound | null;
    private _liftupMusic: Sound | null;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._game = null;
        this._music = null;
        this._liftupMusic = null;
        this._viewport = this._createViewport();
    }

    public async load(): Promise<void> {
        await Assets.load(LEVEL_DATA_PATH);
        await Assets.load("assets/textures/terrain.json");
        await Assets.load("assets/textures/character.json");
        await Assets.load("assets/textures/building.json");
        await loadSoundAsset("assets/sounds/music_main.ogg");
        await loadSoundAsset("assets/sounds/music_liftup.ogg");
        await loadSoundAsset("assets/sounds/sound_rooting.ogg");
        await loadSoundAsset("assets/sounds/sound_uprooting.ogg");
        await loadSoundAsset("assets/sounds/sound_steps.ogg");
        await loadSoundAsset("assets/sounds/sound_lose.ogg");
    }

    public init(): void {
        this._game = this._createGame(Assets.cache.get(LEVEL_DATA_PATH));

        this._initLayout(this._game, this._viewport);
        this._initMusic();

        this._game.start();
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }

    public update(timeSinceLastFrameInS: number): void {
        this._game?.update(timeSinceLastFrameInS);
    }

    public destroy() {
        this._game?.stop();
        this._music?.stop();
        this._liftupMusic?.stop();
    }

    private _createViewport(): Viewport {
        return this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: this.renderer.width,
                worldHeight: this.renderer.height,
            }),
        );
    }

    private _createGame(levelData: TiledMap): Game {
        const game = new Game(levelData);

        game.events.on(GameEvent.PLANET_CORE_REACHED, () => {
            const soundDuckTime = 500;
            const duckVolume = 0.2;
            const sound = Assets.cache.get("assets/sounds/sound_lose.ogg") as Sound;
            sound.play();
            game.pause();

            if (this._music) {
                anime({
                    targets: this._music,
                    volume: duckVolume,
                    duration: soundDuckTime,
                    easing: "linear",
                });
            }

            if (this._liftupMusic) {
                anime({
                    targets: this._liftupMusic,
                    volume: duckVolume,
                    duration: soundDuckTime,
                    easing: "linear",
                });
            }

            setTimeout(() => this.director.goTo(TitleScene.NAME), 3000);
        });
        game.events.on(GameEvent.HOUSE_LIFTED, () => {
            if (this._music && this._liftupMusic) {
                const mainMusic = this._music?.instances[0]!;
                this._liftupMusic?.play({
                    start: this._music.duration * mainMusic.progress,
                });
            }
        });

        game.events.on(GameEvent.HOUSE_GROUNDED, () => {
            if (this._music && this._liftupMusic) {
                this._liftupMusic.stop();
            }
        });

        return game;
    }

    private _initLayout({ level }: Game, viewport: Viewport): void {
        const { width: worldWidth, height: worldHeight } = level.staticBounds;

        viewport.resize(undefined, undefined, worldWidth, worldHeight);
        viewport.addChild(level);
    }

    private _initMusic(): void {
        this._music = Assets.cache.get("assets/sounds/music_main.ogg") as Sound;
        this._music.loop = true;
        this._music.play();

        this._liftupMusic = Assets.cache.get("assets/sounds/music_liftup.ogg") as Sound;
        this._liftupMusic.loop = true;
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
