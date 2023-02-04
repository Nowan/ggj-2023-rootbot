export enum MoveKey {
    A = "a",
    D = "d",
    ARROW_LEFT = "left",
    ARROW_RIGHT = "right",
}

export type MoveOnKeysComponentDataObject = {
    states: Partial<Record<MoveKey, boolean>>
};

export interface MoveOnKeysComponent {
    moveOnKeys: MoveOnKeysComponentDataObject;
}

export default MoveOnKeysComponent;
