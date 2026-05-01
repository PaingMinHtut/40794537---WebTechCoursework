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

        description: "Grog swings the greataxe at the enemy. Requires 13 or above to hit. Deals 1 damage. Deals 2 damage on nat20s.",

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    reckless: {
        name: "Reckless Attack",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 5,

        description: "Grog attacks recklessly; deals more damage easily, but he is more vulnerable on the next turn. Requires 5 or above to hit. Deals 2 damage. Deals 3 damage on nat20s.",

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

        description: "Grog roars; attracting all of the enemy's attention onto him for the next 2 turns. This move always hits, and does not end Grog's turn. Goes on a cooldown for 2 turns.",

        cooldown: 2,

        endsTurn: false,

        onUse: (user) => {
            applyStatus(user, {
                type: STATUS.TAUNT,
                duration: 2
            });
        }
    },

    rage: {
        name: "Unbridled Rage",
        type: "support",
        target: "self",
        requiresRoll: false,

        description: "Grog rages; his attacks are much stronger for the next 3 turns. This move always hits. Goes on a cooldown for 4 turns.",
        cooldown: 4,

        onUse: (user) => {
            applyStatus(user, {
                type: STATUS.RAGE,
                duration: 3
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
        threshold: 13,

        description: "Leo viciously mocks the enemy, making them depressed if successful. Depressed enemies are unable to move on the next turn. Requires 13 or above to hit. Deals 1 damage. Deals 2 damage on nat20s.",
        
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

        description: "Leo heals an ally for 2 HP. This move always hits.",

        onUse: (user, target) => {
            target.currentHp = Math.min(target.maxHp, target.currentHp + 2);
        }
    },

    inspire: {
        name: "Bardic Inspiration",
        type: "support",
        target: "party",
        requiresRoll: false,

        description: "Leo lets out a song; inspiring the party for the next 2 turns. Inspired allies' moves are more likely to hit. This move always hits. Goes on a cooldown for 2 turns.",

        cooldown: 2,
    },

    hypnotic: {
        name: "Hypnotic Pattern",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 15,

        description: "Leo hypnotizes the enemy. Hypnotized enemies are unable to move for the next 2 turns. Requires 15 or above to hit. Goes on a cooldown for 4 turns.",

        cooldown: 4,

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
        threshold: 10,

        description: "Rellynn shoots a fireball and burns the enemy. Requires 10 or above to hit. Deals 1 damage. Deals 2 damage on nat20s.\nBurning enemies take 1 damage on each of the next 2 turns.\nCauses the MELT effect if the burning enemy is met with ice, and deals 3 damage.\nCauses the OVERLOAD effect if the burning enemy is met with lightning, and deals 3 damage.",

        element: STATUS.BURN,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    frost: {
        name: "Ray of Frost",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 10,

        description: "Rellynn shoots a ice beam and freezes the enemy. Requires 10 or above to hit. Deals 1 damage. Deals 2 damage on nat20s.\nFrozen enemies take 1 damage on each of the next 2 turns.\nCauses the MELT effect if the frozen enemy is met with fire, and deals 3 damage.\nCauses the SUPERCONDUCT effect if the frozen enemy is met with lightning, and deals 3 damage.",

        element: STATUS.FROST,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    lightning: {
        name: "Lightning Bolt",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 10,

        description: "Rellynn shoots a lighting bolt and shocks the enemy. Requires 10 or above to hit. Deals 1 damage. Deals 2 damage on nat20s.\nShocked enemies take 1 damage on each of the next 2 turns.\nCauses the OVERLOAD effect if the shocked enemy is met with fire, and deals 3 damage.\nCauses the SUPERCONDUCT effect if the shocked enemy is met with ice, and deals 3 damage.",

        element: STATUS.SHOCK,

        getDamage: (roll) => roll.isCrit ? 2 : 1
    },

    missiles: {
        name: "Magic Missiles",
        type: "attack",
        target: "enemy",
        requiresRoll: false,

        description: "Rellynn fires five magic missiles at the enemy, dealing 5 damage. This move always hits. Goes on a cooldown for 4 turns.",

        cooldown: 4,

        getDamage: (roll) => 5
    }
};