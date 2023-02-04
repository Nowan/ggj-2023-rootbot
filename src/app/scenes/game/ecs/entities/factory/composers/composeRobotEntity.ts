import { Bodies, Body } from "matter-js";
import { Sprite } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import { MoveKey } from "../../../components";
import { RobotEntity } from "../../Entity";
import physicsConfig from "../../../../../../config/physics.config";

export function composeRobotEntity(level: LevelContainer): RobotEntity {
    const sprite = createRobotSprite(level);

    // console.log(sprite.x, sprite.y)
    return {
        id: "Robot",
        robot: true,
        pixi: sprite,
        physics: Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, physicsConfig.robot),
        moveOnKeys: {
            states: {
                [MoveKey.A]: false,
                [MoveKey.D]: false,
                [MoveKey.ARROW_LEFT]: false,
                [MoveKey.ARROW_RIGHT]: false
            }
        }
    };
}

function createRobotSprite(level: LevelContainer): Sprite {
    const sprite = Sprite.from("assets/textures/character/robot_idle_00.png");

    sprite.position.copyFrom(level.robotSpawnPoint);
    sprite.anchor.set(0.5);

    return level.addChild(sprite);
}

export default composeRobotEntity;
