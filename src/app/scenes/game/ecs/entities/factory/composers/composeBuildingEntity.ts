import { Bodies } from "matter-js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BuildingEntity } from "../../Entity";
import physicsConfig from "../../../../../../config/physics.config";
import BuildingContainer from "../../../../pixi/BuildingContainer";

export function composeBuildingEntity(level: LevelContainer): BuildingEntity {
    const sprite = level.layers[1].addChild(new BuildingContainer());

    return {
        id: "Building",
        building: {
            roots: null
        },
        pixi: sprite,
        physics: Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, physicsConfig.building)
    };
}

export default composeBuildingEntity;
