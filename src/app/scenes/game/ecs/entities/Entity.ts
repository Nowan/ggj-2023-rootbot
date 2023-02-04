import {
    PixiComponent,
    PhysicsComponent,
    MoveOnKeysComponent,
    RobotComponent,
    BuildingComponent
} from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent &
    MoveOnKeysComponent &
    PhysicsComponent &
    RobotComponent &
    BuildingComponent
>;

export type PixiEntity = Required<Pick<Entity, keyof PixiComponent>>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity = PixiEntity & PhysicsEntity;

export type RobotEntity = PixiPhysicsEntity & MoveOnKeysComponent & RobotComponent;

export type BuildingEntity = PixiPhysicsEntity & BuildingComponent;

export default Entity;
