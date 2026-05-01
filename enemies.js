import { applyStatus, STATUS } from "statuses.js";

export const enemies = {

    cola: {
        id: "cola",
        name: "Can o' Coca Cola",
        portrait: "cola.png",
        hp: 1,
        initiative: 3,
        type: "basic"
    },

    doritos: {
        id: "doritos",
        name: "Doritos Bag",
        portrait: "doritos.png",
        hp: 1,
        initiative: 9,
        type: "basic"
    },

    oreo: {
        id: "oreo",
        name: "Oreo Cookie",
        portrait: "oreo.png",
        hp: 1,
        initiative: 5,
        type: "basic"
    },

    pizza_roll: {
        id: "pizza_roll",
        name: "Pizza Roll",
        portrait: "pizzaroll.png",
        hp: 1,
        initiative: 5,
        type: "elite",

        specialMove: {
            name: "Spray Lava",
            requiresRoll: true,
            threshold: 12,

            getDamage: (roll) => roll.isCrit ? 3 : 2,

            onHit: (target) => {
                applyStatus(target, {
                    type: STATUS.BURN,
                    duration: 2
                });
            }
        }
    },

    toy_dragon: {
        id: "toy_dragon",
        name: "Dragon",
        portrait: "dragon.png",
        hp: 1,
        initiative: 9,
        type: "elite",

        specialMove: {
            name: "Breathe Fire",
            requiresRoll: true,
            threshold: 15,

            getDamage: (roll) => roll.isCrit ? 4 : 2,

            onHit: (target) => {
                applyStatus(target, {
                    type: STATUS.BURN,
                    duration: 2
                });
            }
        }
    },

    // HP and initative point very intentionally set to 1, as Jerry is meant to be a pathetic side character who thinks he's tough
    jerry: {
        id: "jerry",
        name: "Jerry",
        portrait: "jerry.png",
        hp: 1,
        initiative: 1,
        type: "basic"
    },
};