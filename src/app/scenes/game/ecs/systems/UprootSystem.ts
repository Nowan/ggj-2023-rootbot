import { World as EcsEngine, Archetype } from "miniplex";
import { Entity, RobotEntity } from "../entities";
import System from "./System";
import { Listener as KeypressListener } from "keypress.js";
import { Engine as PhysicsEngine, Constraint, Composite, Body } from "matter-js";

export class UprootSystem extends System {
    private _physics: PhysicsEngine;
    private _archetype: Archetype<RobotEntity>;
    private _keypressListener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetype = ecs.archetype("robot") as Archetype<RobotEntity>;
        this._keypressListener = new KeypressListener();
    }

    public init(): void {
        this._keypressListener.register_many([
            {
                keys: "space",
                on_keydown: () => {
                    const [collidingRobotEntity] = this._archetype.entities.filter(({ robot }) => robot.collidesWith.length > 0);

                    if (collidingRobotEntity) {
                        const [buildingEntity] = collidingRobotEntity.robot.collidesWith;
                        const robotHeight = collidingRobotEntity.physics.bounds.max.y - collidingRobotEntity.physics.bounds.min.y;
                        const buildingHeight = buildingEntity.physics.bounds.max.y - buildingEntity.physics.bounds.min.y;
                        const constraintLength = (buildingHeight + robotHeight) * 0.5;

                        const constraint = Constraint.create({
                            bodyA: collidingRobotEntity.physics,
                            bodyB: buildingEntity.physics,
                            length: constraintLength
                        })

                        Body.setPosition(buildingEntity.physics, { x: buildingEntity.physics.position.x, y: collidingRobotEntity.physics.position.y - constraintLength });
                        Composite.add(this._physics.world, constraint);
                    }
                },
                prevent_repeat: true,
            },
        ]);
    }
}

export default UprootSystem;