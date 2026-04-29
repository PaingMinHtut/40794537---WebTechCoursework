import { applyStatus, STATUS } from "./statuses.js";

export const moves = {

    // ======================
    // GROG
    // ======================

    cleave: {
        name: "Cleave",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    reckless: {
        name: "Reckless Attack",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 5,

        getDamage: (roll) => roll.isCrit ? 3 : 2,

        onHit: (user) => {
            applyStatus(user, {
                type: STATUS.RECKLESS,
                duration: 1,
                value: -7 // AC penalty
            });
        }
    },

    roar: {
        name: "Beckoning Roar",
        type: "support",
        target: "self",
        requiresRoll: false,

        cooldown: 2,
        currentCooldown: 0,
        startLocked: false,

        endsTurn: false,

        onUse: (user) => {
            applyStatus(user, {
                type: STATUS.TAUNT,
                duration: 1
            });
        }
    },

    rage: {
        name: "Unbridled Rage",
        type: "support",
        target: "self",
        requiresRoll: false,

        cooldown: 4,
        currentCooldown: 4,
        startLocked: true,

        endsTurn: false,

        onUse: (user) => {
            applyStatus(user, {
                type: STATUS.RAGE,
                duration: 2
            });
        }
    },

    // ======================
    // LEO
    // ======================

    mockery: {
        name: "Vicious Mockery",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 15,

        getDamage: (roll) => roll.isCrit ? 2 : 1,

        onHit: (user, target) => {
            applyStatus(target, {
                type: STATUS.DEPRESSED,
                duration: 1
            });
        }
    },

    heal: {
        name: "Healing Word",
        type: "support",
        target: "ally",
        requiresRoll: false,

        onUse: (user, target) => {
            target.currentHp = Math.min(target.maxHp, target.currentHp + 1);
        }
    },

    inspire: {
        name: "Bardic Inspiration",
        type: "support",
        target: "party",
        requiresRoll: false,

        cooldown: 2,
        currentCooldown: 0,
        startLocked: false
    },

    hypnotic: {
        name: "Hypnotic Pattern",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 17,

        cooldown: 4,
        currentCooldown: 4,
        startLocked: true,

        onHit: (user, target) => {
            applyStatus(target, {
                type: STATUS.HYPNOTIZED,
                duration: 2
            });
        }
    },

    // ======================
    // RELLYNN
    // ======================

    fireball: {
        name: "Fireball",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,

        element: STATUS.BURN,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    frost: {
        name: "Ray of Frost",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,

        element: STATUS.FROST,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    lightning: {
        name: "Lightning Bolt",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,

        element: STATUS.SHOCK,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    missiles: {
        name: "Magic Missiles",
        type: "attack",
        target: "enemy",
        requiresRoll: false,

        cooldown: 4,
        currentCooldown: 4,
        startLocked: true,

        getDamage: (roll) => (roll && roll.isCrit) ? 7 : 5
    }
};