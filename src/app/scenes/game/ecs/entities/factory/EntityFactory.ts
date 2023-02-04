import { RegisteredEntity, World as EcsEngine } from "miniplex";
import { Sprite } from "pixi.js";
import { LevelContainer } from "../../../core/parseLevel";
import {
    BuildingEntity,
    CollisionEntity,
    Entity, RobotEntity, TerrainTileEntity,
} from "../Entity";
import {
    composeBuildingEntity,
    composeCollisionEntity,
    composeRobotEntity,
    composeTerrainTileEntity
} from "./composers";

export class EntityFactory {
    private _ecs: EcsEngine<Entity>;
    private _level: LevelContainer;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer) {
        this._ecs = ecs;
        this._level = level;
    }

    public createTerrainTile(terrainTile: Sprite): RegisteredEntity<TerrainTileEntity> {
        return this._register(composeTerrainTileEntity(terrainTile));
    }

    public createRobotEntity(): RegisteredEntity<RobotEntity> {
        return this._register(composeRobotEntity(this._level));
    }

    public createBuildingEntity(): RegisteredEntity<BuildingEntity> {
        return this._register(composeBuildingEntity(this._level));
    }

    public createCollisionEntity<ENTITY_A extends Entity, ENTITY_B extends Entity = ENTITY_A>(entityA: ENTITY_A, entityB: ENTITY_B): RegisteredEntity<CollisionEntity<ENTITY_A, ENTITY_B>> {
        return this._register(composeCollisionEntity(entityA, entityB));
    }

    private _register<ENTITY extends Entity>(entity: ENTITY): RegisteredEntity<ENTITY> {
        return this._ecs.createEntity(entity) as unknown as RegisteredEntity<ENTITY>;
    }
}

export default EntityFactory;
