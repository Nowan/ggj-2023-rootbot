import { RegisteredEntity } from "miniplex";
import { RootsEntity } from "../entities";

export interface BuildingComponent {
    building: {
        roots: RegisteredEntity<RootsEntity> | null,
        isCarried: boolean
    };
}

export default BuildingComponent;
