import { LevelContainer } from "../../../../core/parseLevel";
import { RootsEntity } from "../../Entity";
import RootsContainer from "../../../../pixi/RootsContainer";

export function composeRootsEntity(level: LevelContainer): RootsEntity {
    const container = level.layers[1].addChild(new RootsContainer());

    return {
        id: "Roots",
        roots: {
            creationTimestamp: Date.now(),
            length: 0,
        },
        pixi: container,
    };
}

export default composeRootsEntity;
