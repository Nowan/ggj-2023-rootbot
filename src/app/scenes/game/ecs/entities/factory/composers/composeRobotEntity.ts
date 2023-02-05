import { Bodies } from "matter-js";
import { Sprite } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import { MoveKey } from "../../../components";
import { RobotEntity } from "../../Entity";
import RobotContainer from "../../../../pixi/RobotContainer";
import physicsConfig from "../../../../../../config/physics.config";

export function composeRobotEntity(level: LevelContainer): RobotEntity {
    const container = createRobotContainer(level);

    return {
        id: "Robot",
        robot: {
            collidesWith: [],
            carries: null,
        },
        pixi: container,
        physics: Bodies.rectangle(
            container.x,
            container.y,
            container.staticBounds.width,
            container.staticBounds.height,
            physicsConfig.robot,
        ),
        moveOnKeys: {
            states: {
                [MoveKey.A]: false,
                [MoveKey.D]: false,
                [MoveKey.ARROW_LEFT]: false,
                [MoveKey.ARROW_RIGHT]: false,
            },
        },
    };
}

function createRobotContainer(level: LevelContainer): RobotContainer {
    const sprite = new RobotContainer();
    sprite.position.copyFrom(level.robotSpawnPoint);
    return level.addChild(sprite);
}

export default composeRobotEntity;
