import { Bodies } from "matter-js";
import { Sprite } from "pixi.js";
import physicsConfig from "../../../../../../config/physics.config";
import { TerrainTileEntity } from "../../Entity";

export function composeTerrainTileEntity(tileSprite: Sprite): TerrainTileEntity {
    return {
        id: "terrain",
        pixi: tileSprite,
        physics: Bodies.rectangle(tileSprite.x, tileSprite.y, tileSprite.width, tileSprite.height, physicsConfig.terrain)
    };
}

export default composeTerrainTileEntity;
