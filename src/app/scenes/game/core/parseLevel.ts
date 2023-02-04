import { Container, Sprite, Graphics, IPointData } from "pixi.js";
import { TiledMap, TiledObject } from "tiled-types";
import { TiledMapContainer } from "../../../core/tiled";
import parseTiledMap from "../../../core/tiled/parseMap";
import { selectDisplayObjectsOfName, selectObjectsOfName } from "../../../core/tiled/selectors";
import { PartiallyRequired } from "../../../core/utils/utilityTypes";

export type LineData = [pointA: IPointData, pointB: IPointData];
export type LevelContainer = TiledMapContainer & {
    robotSpawnPoint: Container,
    horizonLine: LineData,
    terrainTiles: Array<Sprite>
};

export default function parseLevel(levelData: TiledMap): LevelContainer {
    const level = parseTiledMap(levelData) as LevelContainer;
    const background = level.addChildAt(new Graphics().beginFill(0xff0000).drawRect(0, 0, level.staticBounds.width, level.staticBounds.height).endFill(), 0);

    level.robotSpawnPoint = selectDisplayObjectsOfName<Container>(level, "SPAWN_POINT")[0];
    level.terrainTiles = parseTerrainTiles(level);
    level.horizonLine = parseHorizonLine(levelData);

    return level;
}

function parseTerrainTiles(level: LevelContainer): Array<Sprite> {
    return level.layerNameToContainerMap.get("Terrain")?.children as Array<Sprite>;
}

function parseHorizonLine(levelData: TiledMap): LineData {
    return parsePolyline(levelData, "HORIZON");
}

function parsePolyline(levelData: TiledMap, objectName: string): LineData {
    const [tiledObject] = selectObjectsOfName<PartiallyRequired<TiledObject, "polyline">>(levelData, objectName);

    return tiledObject.polyline.map((point) => ({
        x: point.x + tiledObject.x,
        y: point.y + tiledObject.y,
    })) as LineData;
}