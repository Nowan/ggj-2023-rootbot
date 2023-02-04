import Entity, { CollisionEntity } from "../../Entity";

export function composeCollisionEntity<ENTITY_A extends Entity, ENTITY_B extends Entity = ENTITY_A>(entityA: ENTITY_A, entityB: ENTITY_B): CollisionEntity<ENTITY_A, ENTITY_B> {
    return {
        id: "Collision",
        collision: [entityA, entityB]
    };
}

export default composeCollisionEntity;
