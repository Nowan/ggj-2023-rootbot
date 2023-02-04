import { IBodyDefinition } from "matter-js";

export default {
    robot: {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        inertia: Infinity,
    }
} as Record<"robot", IBodyDefinition>;
