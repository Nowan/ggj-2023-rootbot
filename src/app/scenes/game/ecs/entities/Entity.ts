import {
    PixiComponent,
    PhysicsComponent,
    MoveOnKeysComponent,
    RobotComponent
} from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent &
    MoveOnKeysComponent &
    PhysicsComponent
>;

export type PixiEntity = Required<Pick<Entity, keyof PixiComponent>>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity = PixiEntity & PhysicsEntity;

export type RobotEntity = PixiPhysicsEntity & MoveOnKeysComponent & RobotComponent;

export default Entity;
