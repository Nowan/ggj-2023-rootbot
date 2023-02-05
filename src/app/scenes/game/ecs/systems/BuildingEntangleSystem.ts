import { World as EcsEngine, Archetype } from "miniplex";
import { LevelContainer } from "../../core/parseLevel";
import RootsContainer from "../../pixi/RootsContainer";
import BuildingContainer from "../../pixi/BuildingContainer";
import { BuildingEntity, Entity, EntityFactory, PhysicsEntity, RobotEntity, RootsEntity } from "../entities";
import System from "./System";
import gameConfig from "../../../../config/game.config";

export class BuildingEntangleSystem extends System {
    private _level: LevelContainer;
    private _entityFactory: EntityFactory;
    private _archetypes: {
        building: Archetype<BuildingEntity>;
        roots: Archetype<RootsEntity>;
    };

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer, entityFactory: EntityFactory) {
        super(ecs);

        this._level = level;
        this._entityFactory = entityFactory;
        this._archetypes = {
            building: ecs.archetype("building") as Archetype<BuildingEntity>,
            roots: ecs.archetype("roots") as Archetype<RootsEntity>,
        };
    }

    public init(): void {
        this._archetypes.roots.onEntityAdded.add((entity) => {
            // entity.pixi.position.set()
            // building.roots.pixi.position.set(buildingBody.position.x, buildingBody.position.y + buildingContainer.staticBounds.height * 0.5)
        });

        this._archetypes.roots.onEntityRemoved.add((entity) => {
            if (entity.pixi.parent) entity.pixi.parent.removeChild(entity.pixi);
        });
    }

    public update(): void {
        for (let { building, pixi, physics: buildingBody } of this._archetypes.building.entities) {
            if (building.isCarried) continue;
            const groundedTime = (Date.now() - building.groundedTimestamp) / 1000;

            if (groundedTime >= gameConfig.roots.appearAfterTime) {
                if (!building.roots) {
                    const buildingContainer = pixi as BuildingContainer;
                    building.roots = this._entityFactory.createRootsEntity();

                    building.roots.pixi.position.set(
                        buildingBody.position.x,
                        buildingBody.position.y + buildingContainer.staticBounds.height * 0.5 + 15,
                    );
                }

                const entity = building.roots;
                const container = entity.pixi as RootsContainer;
                const lifeTimeInS = (Date.now() - entity.roots.creationTimestamp) / 1000;
                const rootsLength = lifeTimeInS * 0.5;

                entity.roots.length = rootsLength;
                container.setLength(rootsLength);
            }
        }
    }
}

export default BuildingEntangleSystem;
