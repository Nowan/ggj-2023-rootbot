import { Bodies } from "matter-js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BuildingEntity } from "../../Entity";
import physicsConfig from "../../../../../../config/physics.config";
import BuildingContainer from "../../../../pixi/BuildingContainer";

export function composeBuildingEntity(level: LevelContainer): BuildingEntity {
    const container = level.layers[1].addChild(new BuildingContainer());

    return {
        id: "Building",
        building: {
            groundedTimestamp: Date.now(),
            roots: null,
            isCarried: false
        },
        pixi: container,
        physics: Bodies.rectangle(container.x, container.y, container.staticBounds.width, container.staticBounds.height, physicsConfig.building)
    };
}

export default composeBuildingEntity;
