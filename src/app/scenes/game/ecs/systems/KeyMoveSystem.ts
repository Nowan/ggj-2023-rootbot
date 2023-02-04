import System from "./System";
import { Entity, RobotEntity } from "../entities";
import { Listener as KeypressListener } from "keypress.js";
import { Body } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";
import { MoveKey } from "../components";

enum MoveDirection {
    LEFT = -1,
    RIGHT = 1
};

const directionToKeysMap = {
    [MoveDirection.LEFT]: [MoveKey.A, MoveKey.ARROW_LEFT],
    [MoveDirection.RIGHT]: [MoveKey.D, MoveKey.ARROW_RIGHT]
}

export class KeyMoveSystem extends System {
    private _archetype: Archetype<RobotEntity>;
    private _keypressListener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

        this._archetype = ecs.archetype("robot") as Archetype<RobotEntity>;
        this._keypressListener = new KeypressListener();
    }

    public init(): void {
        this._archetype.onEntityAdded.add((entity) => {
            for (let moveKey of Object.keys(entity.moveOnKeys.states)) {
                this._keypressListener.register_many([
                    {
                        keys: moveKey,
                        on_keydown: () => {
                            entity.moveOnKeys.states[moveKey as MoveKey] = true;
                            updateVelocity(entity);
                        },
                        on_keyup: () => {
                            entity.moveOnKeys.states[moveKey as MoveKey] = false;
                            updateVelocity(entity);
                        },
                        prevent_repeat: true,
                    },
                ]);
            }
        });
    }

    public update(dt: number) {
        for (let { physics: body } of this._archetype.entities) {
            Body.setPosition(body, {
                x: body.position.x + body.velocity.x,
                y: body.position.y + body.velocity.y,
            });
        }
    }
}

function updateVelocity(entity: RobotEntity): void {
    const { states } = entity.moveOnKeys;
    const leftDirection = getDirectionState(MoveDirection.LEFT, states);
    const rightDirection = getDirectionState(MoveDirection.RIGHT, states);

    if (leftDirection && rightDirection || (!leftDirection && !rightDirection)) {
        Body.setVelocity(entity.physics, { x: 0, y: 0 });
    }
    else {
        let velocity = 1;

        if (leftDirection) velocity *= -1;
        if (rightDirection) velocity *= 1;

        Body.setVelocity(entity.physics, { x: velocity, y: 0 });
        entity.pixi.scale.x = Math.sign(velocity);
    }
}

function getDirectionState(direction: MoveDirection, keyStates: RobotEntity["moveOnKeys"]["states"]): boolean {
    return !!Math.max(...directionToKeysMap[direction].map(moveKey => Number(keyStates[moveKey as MoveKey])));
}

export default KeyMoveSystem;
