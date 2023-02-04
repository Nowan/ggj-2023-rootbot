import { Bodies } from "matter-js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BuildingEntity } from "../../Entity";
import physicsConfig from "../../../../../../config/physics.config";
import Building from "../../../../pixi/Building";

export function composeBuildingEntity(level: LevelContainer): BuildingEntity {
    const sprite = level.layers[1].addChild(new Building());

    return {
        id: "Building",
        building: true,
        pixi: sprite,
        physics: Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, physicsConfig.building)
    };
}

export default composeBuildingEntity;
