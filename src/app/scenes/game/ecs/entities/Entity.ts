import { DisplayObject } from "pixi.js";
import Building from "../../pixi/Building";
import {
    PixiComponent,
    PhysicsComponent,
    MoveOnKeysComponent,
    RobotComponent,
    BuildingComponent,
    CollisionComponent
} from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent<DisplayObject> &
    MoveOnKeysComponent &
    PhysicsComponent &
    RobotComponent &
    BuildingComponent &
    CollisionComponent<any>
>;

export type PixiEntity<DISPLAY_OBJECT extends DisplayObject> = Required<Pick<Entity, keyof PixiComponent<DISPLAY_OBJECT>>>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity<PIXI extends DisplayObject> = PixiEntity<PIXI> & PhysicsEntity;

export type RobotEntity = PixiPhysicsEntity<DisplayObject> & MoveOnKeysComponent & RobotComponent;

export type BuildingEntity = PixiPhysicsEntity<Building> & BuildingComponent;

export type CollisionEntity<ENTITY_A extends Entity, ENTITY_B extends Entity = ENTITY_A> = Entity & CollisionComponent<ENTITY_A, ENTITY_B>;

export type TerrainTileEntity = PixiPhysicsEntity<DisplayObject>;

export default Entity;
