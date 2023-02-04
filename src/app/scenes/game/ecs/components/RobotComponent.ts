import { PhysicsEntity } from "../entities";

export interface RobotComponent {
    robot: {
        collidesWith: Array<PhysicsEntity>
    };
}

export default RobotComponent;
