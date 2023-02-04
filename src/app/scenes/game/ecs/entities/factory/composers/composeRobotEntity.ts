
import { Bodies } from "matter-js";
import { Container } from "pixi.js";
import { MoveDirection, MoveKey } from "../../../components";
import { RobotEntity } from "../../Entity";

export function composeRobotEntity(): RobotEntity {
    return {
        id: "Robot",
        robot: true,
        pixi: new Container(),
        physics: Bodies.rectangle(0, 0, 30, 30),
        moveOnKeys: {
            [MoveKey.A]: MoveDirection.LEFT,
            [MoveKey.D]: MoveDirection.RIGHT,
            [MoveKey.ARROW_LEFT]: MoveDirection.LEFT,
            [MoveKey.ARROW_RIGHT]: MoveDirection.RIGHT
        }
    };
}

export default composeRobotEntity;
