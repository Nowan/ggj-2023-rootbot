import { RegisteredEntity } from "miniplex";
import { RootsEntity } from "../entities";

export interface BuildingComponent {
    building: {
        groundedTimestamp: number,
        roots: RegisteredEntity<RootsEntity> | null,
        isCarried: boolean
    };
}

export default BuildingComponent;
