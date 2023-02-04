import { Entity } from "../entities";

export interface CollisionComponent<ENTITY_A extends Entity, ENTITY_B extends Entity = ENTITY_A> {
    collision: [ENTITY_A, ENTITY_B]
}

export default CollisionComponent;
