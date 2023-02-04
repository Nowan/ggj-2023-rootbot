import { World as EcsEngine, Archetype } from "miniplex";
import { BuildingEntity, Entity, RobotEntity } from "../entities";
import System from "./System";
import { Listener as KeypressListener } from "keypress.js";
import { Engine as PhysicsEngine, Constraint, Composite, Body } from "matter-js";
import { LevelContainer } from "../../core/parseLevel";

export class UprootSystem extends System {
    private _physics: PhysicsEngine;
    private _level: LevelContainer;
    private _archetype: Archetype<RobotEntity>;
    private _keypressListener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine, level: LevelContainer) {
        super(ecs);

        this._physics = physics;
        this._level = level;
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
                        const buildingEntity = carrierRobotEntity.robot.carries!;
                        const robotHeight = carrierRobotEntity.physics.bounds.max.y - carrierRobotEntity.physics.bounds.min.y;
                        const columnStartX = Math.floor(carrierRobotEntity.physics.position.x / this._level.tiled.tilewidth) * this._level.tiled.tilewidth;

                        Body.setPosition(buildingEntity.physics, { x: columnStartX, y: carrierRobotEntity.physics.position.y - robotHeight * 0.5 });

                        carrierRobotEntity.robot.carries = null;
                    }
                    else {
                        const [collidingRobotEntity] = this._archetype.entities.filter(({ robot }) => robot.collidesWith.length > 0);

                        if (collidingRobotEntity && collidingRobotEntity.robot.collidesWith.length > 0) {
                            collidingRobotEntity.robot.carries = collidingRobotEntity.robot.collidesWith[0] as BuildingEntity;
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

            Body.setPosition(buildingEntity.physics, { x: entity.physics.position.x, y: entity.physics.position.y - constraintLength })
        }
    }
}

export default UprootSystem;