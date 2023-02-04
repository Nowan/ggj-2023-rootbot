import {
    PixiComponent,
    PhysicsComponent,
    MoveOnKeysComponent,
    RobotComponent,
    BuildingComponent,
    CollisionComponent
} from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent &
    MoveOnKeysComponent &
    PhysicsComponent &
    RobotComponent &
    BuildingComponent &
    CollisionComponent<any>
>;

export type PixiEntity = Required<Pick<Entity, keyof PixiComponent>>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity = PixiEntity & PhysicsEntity;

export type RobotEntity = PixiPhysicsEntity & MoveOnKeysComponent & RobotComponent;

export type BuildingEntity = PixiPhysicsEntity & BuildingComponent;

export type CollisionEntity<ENTITY_A extends Entity, ENTITY_B extends Entity = ENTITY_A> = Entity & CollisionComponent<ENTITY_A, ENTITY_B>;

export type TerrainTileEntity = PixiPhysicsEntity;

export default Entity;
