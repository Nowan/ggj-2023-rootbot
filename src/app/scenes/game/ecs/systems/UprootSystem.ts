import { World as EcsEngine, Archetype, RegisteredEntity } from "miniplex";
import { BuildingEntity, Entity, RobotEntity } from "../entities";
import System from "./System";
import { Listener as KeypressListener } from "keypress.js";
import { Body } from "matter-js";
import { LevelContainer } from "../../core/parseLevel";
import { utils } from "pixi.js";
import Building from "../../pixi/BuildingContainer";
import { GameEvent } from "../../Game";

export class UprootSystem extends System {
    private _eventBus: utils.EventEmitter;
    private _level: LevelContainer;
    private _archetype: Archetype<RobotEntity>;
    private _keypressListener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer, eventBus: utils.EventEmitter) {
        super(ecs);

        this._level = level;
        this._eventBus = eventBus;
        this._archetype = ecs.archetype("robot") as Archetype<RobotEntity>;
        this._keypressListener = new KeypressListener();
    }

    public init(): void {
        this._keypressListener.register_many([
            {
                keys: "space",
                on_keydown: () => {
                    const [carrierRobotEntity] = this._archetype.entities.filter(({ robot }) => robot.carries);

                    if (carrierRobotEntity) {
                        if (carrierRobotEntity.robot.collidesWith.length > 0) return;

                        const buildingEntity = carrierRobotEntity.robot.carries!;
                        const buildingGraphics = buildingEntity.pixi as Building;
                        const robotHeight =
                            carrierRobotEntity.physics.bounds.max.y - carrierRobotEntity.physics.bounds.min.y;
                        const columnStartX =
                            Math.floor(carrierRobotEntity.physics.position.x / this._level.tiled.tilewidth) *
                            this._level.tiled.tilewidth;

                        Body.setPosition(buildingEntity.physics, {
                            x: Math.max(columnStartX, buildingGraphics.staticBounds.width * 0.5),
                            y: carrierRobotEntity.physics.position.y - robotHeight * 0.5,
                        });

                        buildingEntity.building.isCarried = false;
                        buildingEntity.building.groundedTimestamp = Date.now();
                        buildingGraphics.setGrounded(true);
                        carrierRobotEntity.robot.carries = null;

                        this._eventBus.emit(GameEvent.HOUSE_GROUNDED);
                    } else {
                        const [collidingRobotEntity] = this._archetype.entities.filter(
                            ({ robot }) => robot.collidesWith.length > 0,
                        );

                        if (collidingRobotEntity && collidingRobotEntity.robot.collidesWith.length > 0) {
                            const buildingEntity = collidingRobotEntity.robot.collidesWith[0] as BuildingEntity;
                            const buildingGraphics = buildingEntity.pixi as Building;

                            collidingRobotEntity.robot.carries = buildingEntity;
                            buildingEntity.building.isCarried = true;
                            buildingGraphics.setGrounded(false);

                            this.ecs.destroyEntity(buildingEntity.building.roots as RegisteredEntity<Entity>);
                            buildingEntity.building.roots = null;

                            this._eventBus.emit(GameEvent.HOUSE_LIFTED);
                        }
                    }
                },
                prevent_repeat: true,
            },
        ]);
    }

    public update(timeSinceLastFrameInS: number): void {
        const carrierRobotEntities = this._archetype.entities.filter(({ robot }) => robot.carries);

        for (let entity of carrierRobotEntities) {
            const buildingEntity = entity.robot.carries!;
            const robotHeight = entity.physics.bounds.max.y - entity.physics.bounds.min.y;
            const buildingHeight = buildingEntity.physics.bounds.max.y - buildingEntity.physics.bounds.min.y;
            const constraintLength = (buildingHeight + robotHeight) * 0.5;

            Body.setPosition(buildingEntity.physics, {
                x: entity.physics.position.x,
                y: entity.physics.position.y - constraintLength,
            });
        }
    }
}

export default UprootSystem;
