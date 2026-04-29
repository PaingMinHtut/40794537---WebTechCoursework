export const enemies = {

    // =====================================
    // Food Dept Enemies
    // =====================================
    cola: {
        id: "cola",
        name: "Can o' Coca Cola",
        hp: 4,
        initiative: 3,
        type: "basic"
    },

    doritos: {
        id: "doritos",
        name: "Doritos Bag",
        hp: 2,
        initiative: 7,
        type: "basic"
    },

    oreo: {
        id: "oreo",
        name: "Oreo Cookie",
        hp: 3,
        initiative: 5,
        type: "basic"
    },

    hot_pocket: {
        id: "hot_pocket",
        name: "Lava Hot Pocket",
        hp: 6,
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