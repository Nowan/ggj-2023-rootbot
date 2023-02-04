import { RegisteredEntity, World as EcsEngine } from "miniplex";
import { LevelContainer } from "../../../core/parseLevel";
import {
    BuildingEntity,
    Entity, RobotEntity,
} from "../Entity";
import {
    composeBuildingEntity,
    composeRobotEntity
} from "./composers";

export class EntityFactory {
    private _ecs: EcsEngine<Entity>;
    private _level: LevelContainer;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer) {
        this._ecs = ecs;
        this._level = level;
    }

    public createRobotEntity(): RegisteredEntity<RobotEntity> {
        return this._register(composeRobotEntity(this._level));
    }

    public createBuildingEntity(): RegisteredEntity<BuildingEntity> {
        return this._register(composeBuildingEntity(this._level));
    }

    private _register<ENTITY extends Entity>(entity: ENTITY): RegisteredEntity<ENTITY> {
        return this._ecs.createEntity(entity) as unknown as RegisteredEntity<ENTITY>;
    }
}

export default EntityFactory;
