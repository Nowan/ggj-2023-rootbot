import { World as EcsEngine, Archetype } from "miniplex";
import { Entity, RobotEntity } from "../entities";
import System from "./System";
import { Listener as KeypressListener } from "keypress.js";
import { Body } from "matter-js";

export class UprootSystem extends System {
    private _archetype: Archetype<RobotEntity>;
    private _keypressListener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

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

                        Body.setPosition(buildingEntity.physics, { x: buildingEntity.physics.position.x, y: buildingEntity.physics.position.y - 5 });
                    }
                },
                prevent_repeat: true,
            },
        ]);
    }
}

export default UprootSystem;