import { World as EcsEngine, Archetype } from "miniplex";
import { LevelContainer } from "../../core/parseLevel";
import { Entity, RootsEntity } from "../entities";
import { utils } from "pixi.js";
import System from "./System";
import { GameEvent } from "../../Game";

export class DeadzoneCollisionSystem extends System {
    private _maxLength: number;
    private _level: LevelContainer;
    private _eventBus: utils.EventEmitter;
    private _archetype: Archetype<RootsEntity>;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer, eventBus: utils.EventEmitter) {
        super(ecs);

        this._level = level;
        this._maxLength = level.deadLine[0].y - level.horizonLine[0].y;
        this._eventBus = eventBus;
        this._archetype = ecs.archetype("roots") as Archetype<RootsEntity>;
    }

    public update(timeSinceLastFrameInS: number): void {
        for (let entity of this._archetype.entities) {
            if ((entity.roots.length + 0.5) * this._level.tiled.tileheight >= this._maxLength) {
                this._eventBus.emit(GameEvent.PLANET_CORE_REACHED);
            }
        }
    }
}

export default DeadzoneCollisionSystem;
