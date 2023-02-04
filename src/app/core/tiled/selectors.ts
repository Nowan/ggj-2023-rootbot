import { DisplayObject } from "pixi.js";
import TiledMap, { TiledObject } from "tiled-types/types";
import { TiledMapContainer } from "./TiledMapContainer";

export function selectObjectsOfName<OBJECT extends TiledObject>(tiledMap: TiledMap, name: string): Array<OBJECT> {
    return selectObjectsMatchingPredicate(tiledMap, (object) => object.name === name);
}

export function selectObjectsMatchingPredicate<OBJECT extends TiledObject>(
    tiledMap: TiledMap,
    predicate: (object: TiledObject) => boolean,
): Array<OBJECT> {
    return tiledMap.layers.flatMap((layer) => {
        if ("objects" in layer) {
            return layer.objects.filter(predicate) as OBJECT[];
        } else {
            return [];
        }
    });
}

export function selectDisplayObjectsOfName<T extends DisplayObject>(
    tiledMapContainer: TiledMapContainer,
    name: string,
): Array<T> {
    return tiledMapContainer.layers.flatMap(layer => layer.children.filter((child) => child.name === name) as Array<T>);
}
