import System from "./System";
import { BuildingEntity, Entity, PhysicsEntity } from "../entities";
import { World as EcsEngine, Archetype } from "miniplex";
import { Body, Composite, Engine as PhysicsEngine, World } from "matter-js";

export class PhysicsSystem extends System {
    private _physics: PhysicsEngine;
    private _archetypes: {
        physics: Archetype<PhysicsEntity>,
        building: Archetype<BuildingEntity>
    };

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetypes = {
            physics: ecs.archetype("physics") as Archetype<PhysicsEntity>,
            building: ecs.archetype("building") as Archetype<BuildingEntity>
        }

    }

    init() {
        this._physics.gravity.y = 0;

        this._archetypes.physics.onEntityAdded.add((entity) => World.addBody(this._physics.world, entity.physics));
        this._archetypes.physics.onEntityRemoved.add((entity) => World.remove(this._physics.world, entity.physics));
    }
}

export default PhysicsSystem;
