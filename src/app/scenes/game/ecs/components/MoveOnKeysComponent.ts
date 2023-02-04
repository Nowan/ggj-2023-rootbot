export enum MoveKey {
    A = "a",
    D = "d",
    ARROW_LEFT = "left",
    ARROW_RIGHT = "right",
}

export enum MoveDirection {
    LEFT = -1,
    RIGHT = 1,
}

export type MoveOnKeysComponentDataObject = Partial<Record<MoveKey, MoveDirection>>;

export interface MoveOnKeysComponent {
    moveOnKeys: MoveOnKeysComponentDataObject;
}

export default MoveOnKeysComponent;
