import { IBodyDefinition } from "matter-js";

export default {
    robot: {
        restitution: 0,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        inertia: Infinity,
        mass: 10,
        // collisionFilter: {
        //     group: 1,
        //     mask: 2
        // }
    },
    building: {
        restitution: 0,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        inertia: Infinity,
        isSensor: true,
        isStatic: true
        // collisionFilter: {
        //     group: 2
        // }
    },
    buildingSensor: {
        isSensor: true,
        // collisionFilter: {
        //     group: 1
        // }
    },
    terrain: {
        isStatic: true,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        // collisionFilter: {
        //     group: 1
        // }
    }
} as Record<"robot" | "building" | "buildingSensor" | "terrain", IBodyDefinition>;
