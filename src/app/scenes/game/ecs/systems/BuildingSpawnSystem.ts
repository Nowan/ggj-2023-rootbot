import { World as EcsEngine, Archetype } from "miniplex";
import { BuildingEntity, Entity, EntityFactory } from "../entities";
import System from "./System";
import gameConfig from "../../../../config/game.config";
import { LevelContainer } from "../../core/parseLevel";
import { Body } from "matter-js";
import { Sprite } from "pixi.js";

const BUILDING_WIDTH = 2;

export class BuildingSpawnSystem extends System {
    private _level: LevelContainer;
    private _entityFactory: EntityFactory;
    private _archetype: Archetype<BuildingEntity>;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer, entityFactory: EntityFactory) {
        super(ecs);

        this._level = level;
        this._entityFactory = entityFactory;
        this._archetype = ecs.archetype("building") as Archetype<BuildingEntity>;
    }

    public update(): void {
        if (this._archetype.entities.length <= 0) {
            const diffNumberOfBuildings = gameConfig.initialNumberOfBuildings - this._archetype.entities.length;

            this._spawnBuildings(diffNumberOfBuildings);
        }
    }

    private _spawnBuildings(numberOfBuildings: number) {
        const validColumns = Array(this._level.tiled.width - 1).fill(null).map((_, i) => i);
        const [horizonPoint] = this._level.horizonLine;
        const robotSpawnColumn = Math.floor(this._level.robotSpawnPoint.x / this._level.tiled.tilewidth);

        validColumns.splice(validColumns.indexOf(robotSpawnColumn) - Math.floor(BUILDING_WIDTH * 0.5), BUILDING_WIDTH);

        for (let i = 0; i < gameConfig.initialNumberOfBuildings; i++) {
            const entity = this._entityFactory.createBuildingEntity();
            const sprite = entity.pixi as Sprite;
            const drawnIndex = Math.floor(Math.random() * (validColumns.length - 1)) + 1;
            const [_, drawnColumn] = validColumns.splice(drawnIndex - 1, 3);
            const columnStartX = drawnColumn * this._level.tiled.tilewidth;

            Body.setPosition(entity.physics, { x: columnStartX + sprite.width * 0.5, y: horizonPoint.y - sprite.height * 0.5 });
        }
    }
}

export default BuildingSpawnSystem;