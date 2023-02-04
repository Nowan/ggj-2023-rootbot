import { Bodies } from "matter-js";
import { Sprite } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BuildingEntity } from "../../Entity";
import physicsConfig from "../../../../../../config/physics.config";

export function composeBuildingEntity(level: LevelContainer): BuildingEntity {
    const sprite = createBuildingSprite(level);

    return {
        id: "Building",
        building: true,
        pixi: sprite,
        physics: Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, physicsConfig.building)
    };
}

function createBuildingSprite(level: LevelContainer): Sprite {
    const sprite = Sprite.from("assets/textures/building/house_root_00.png");

    sprite.position.copyFrom(level.robotSpawnPoint);
    sprite.anchor.set(0.5);

    return level.addChild(sprite);
}

export default composeBuildingEntity;
