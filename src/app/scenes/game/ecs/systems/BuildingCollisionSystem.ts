import { World as EcsEngine, Archetype } from "miniplex";
import { BuildingEntity, Entity, EntityFactory, RobotEntity } from "../entities";
import System from "./System";
import { Collision, Detector } from "matter-js";

export class BuildingCollisionSystem extends System {
    private _entityFactory: EntityFactory;
    private _archetypes: {
        building: Archetype<BuildingEntity>,
        robot: Archetype<RobotEntity>
    };
    private _detectors: Array<Detector>;

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory) {
        super(ecs);

        this._entityFactory = entityFactory;
        this._archetypes = {
            building: ecs.archetype("building") as Archetype<BuildingEntity>,
            robot: ecs.archetype("robot") as Archetype<RobotEntity>
        };
        this._detectors = [];
    }

    public init(): void {
        this._archetypes.building.onEntityAdded.add((building) => {
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
        this._archetypes.robot.entities.forEach(({ robot }) => (robot.collidesWith.length = 0));

        for (let detector of this._detectors) {
            const [collision] = Detector.collisions(detector);

            if (collision) {
                const buildingEntity = lookupCollidingEntity(this._archetypes.building.entities, collision) as BuildingEntity;
                const robotEntity = lookupCollidingEntity(this._archetypes.robot.entities, collision) as RobotEntity;

                robotEntity.robot.collidesWith.push(buildingEntity);
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


export default BuildingCollisionSystem;