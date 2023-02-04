import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import Scene, { FacadeRefs } from "../../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import Game from "./Game";

const LEVEL_DATA_PATH = "assets/levels/main.tiled.json";

export default class GameScene extends Scene {
    public static readonly NAME = "Game";

    private _game: Game | null;
    private _viewport: Viewport;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._game = null;
        this._viewport = this._createViewport();
    }

    public async load(): Promise<void> {
        await Assets.load(LEVEL_DATA_PATH);
        await Assets.load("assets/textures/terrain.json");
        await Assets.load("assets/textures/character.json");
    }

    public init(): void {
        this._game = this._createGame(Assets.cache.get(LEVEL_DATA_PATH));

        this._initLayout(this._game, this._viewport);

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
        // TODO: attach events
        return game;
    }

    private _initLayout({ level }: Game, viewport: Viewport): void {
        const { width: worldWidth, height: worldHeight } = level.staticBounds;

        viewport.resize(undefined, undefined, worldWidth, worldHeight);
        viewport.addChild(level);
    }
}
