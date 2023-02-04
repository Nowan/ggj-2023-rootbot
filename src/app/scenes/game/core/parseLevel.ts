import { Container, DisplayObject, IPointData } from "pixi.js";
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

    level.robotSpawnPoint = selectDisplayObjectsOfName<Container>(level, "SPAWN_POINT")[0];

    return level;
}
