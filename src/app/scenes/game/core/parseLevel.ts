import { Container, DisplayObject, Graphics, IPointData } from "pixi.js";
import { TiledMap } from "tiled-types";
import { TiledMapContainer } from "../../../core/tiled";
import parseTiledMap from "../../../core/tiled/parseMap";
import { selectDisplayObjectsOfName } from "../../../core/tiled/selectors";

export type LineData = [pointA: IPointData, pointB: IPointData];
export type LevelContainer = TiledMapContainer & {
    robotSpawnPoint: Container,
    terrainTiles: Array<DisplayObject>
};

export default function parseLevel(levelData: TiledMap): LevelContainer {
    const level = parseTiledMap(levelData) as LevelContainer;
    const background = level.addChildAt(new Graphics().beginFill(0xff0000).drawRect(0, 0, level.staticBounds.width, level.staticBounds.height).endFill(), 0);

    level.robotSpawnPoint = selectDisplayObjectsOfName<Container>(level, "SPAWN_POINT")[0];

    return level;
}
