import { PhysicsEntity, BuildingEntity } from "../entities";

export interface RobotComponent {
    robot: {
        collidesWith: Array<PhysicsEntity>,
        carries: BuildingEntity | null
    };
}

export default RobotComponent;
