import { applyStatus, STATUS } from "../combat/data/statuses.js";

export const enemies = {

    // =====================================
    // Food Dept Enemies
    // =====================================
    cola: {
        id: "cola",
        name: "Can o' Coca Cola",
        portrait: "cola.png",
        hp: 3,
        initiative: 3,
        type: "basic"
    },

    doritos: {
        id: "doritos",
        name: "Doritos Bag",
        portrait: "doritos.png",
        hp: 2,
        initiative: 9,
        type: "basic"
    },

    oreo: {
        id: "oreo",
        name: "Oreo Cookie",
        portrait: "oreo.png",
        hp: 3,
        initiative: 5,
        type: "basic"
    },

    hot_pocket: {
        id: "hot_pocket",
        name: "Lava Hot Pocket",
        portrait: "hot pocket.png",
        hp: 5,
        initiative: 5,
        type: "elite",

        specialMove: {
            name: "Spray Lava",
            requiresRoll: true,
            threshold: 12,

            getDamage: (roll) => roll.isCrit ? 4 : 2,

            onHit: (target) => {
                applyStatus(target, {
                    type: STATUS.BURN,
                    duration: 2
                });
            }
        }
    }
};