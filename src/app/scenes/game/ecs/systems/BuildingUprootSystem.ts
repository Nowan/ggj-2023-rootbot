import { World as EcsEngine, Archetype } from "miniplex";
import { BuildingEntity, Entity, RobotEntity } from "../entities";
import System from "./System";
import { Collision, Detector } from "matter-js";

export class BuildingUprootSystem extends System {
    private _archetypes: {
        building: Archetype<BuildingEntity>,
        robot: Archetype<RobotEntity>
    };
    private _detectors: Array<Detector>;

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

        this._archetypes = {
            building: ecs.archetype("building") as Archetype<BuildingEntity>,
            robot: ecs.archetype("robot") as Archetype<RobotEntity>
        };
        this._detectors = [];
    }

    public init(): void {
        this._archetypes.building.onEntityAdded.add((building) => {
            console.log(building);
            for (let robot of this._archetypes.robot.entities) {
                this._detectors.push(Detector.create({ bodies: [robot.physics, building.physics] }));
            }
        });

        this._archetypes.building.onEntityRemoved.add((building) => {
            const detectorsToRemove = this._detectors.filter(
                (detector) => building.physics && detector.bodies.includes(building.physics),
            );

            for (let detector of detectorsToRemove) {
                Detector.clear(detector);
                this._detectors.splice(this._detectors.indexOf(detector), 1);
            }
        });
    }

    public update(): void {
        for (let detector of this._detectors) {
            const [collision] = Detector.collisions(detector);

            if (collision) {
                const buildingEntity = lookupCollidingEntity(this._archetypes.building.entities, collision);
                const robotEntity = lookupCollidingEntity(this._archetypes.robot.entities, collision);

                // TODO: Resolve collision
            }
        }
    }
}

function lookupCollidingEntity<ENTITY extends BuildingEntity | RobotEntity>(
    entities: Array<ENTITY>,
    collision: Collision,
): ENTITY | undefined {
    return entities.find(({ physics: entityBody }) =>
        [collision.bodyA, collision.bodyB].some((collisionBody) => collisionBody === entityBody),
    );
}


export default BuildingUprootSystem;