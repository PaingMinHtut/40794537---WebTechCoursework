export const moves = {
    cleave: {
        name: "Cleave",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,
        description: "Deal 1 damage (2 on crit)"
    },

    reckless: {
        name: "Reckless Attack",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 5,
        description: "Deal 2 damage (3 on crit), lower AC"
    },

    roar: {
        name: "Beckoning Roar",
        type: "support",
        target: "self",
        requiresRoll: false,
        description: "Force enemies to target Grog"
    },

    rage: {
        name: "Unbridled Rage",
        type: "support",
        target: "self",
        requiresRoll: false,
        description: "+2 damage for 2 turns"
    },

    mockery: {
        name: "Vicious Mockery",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 15,
        description: "Damage + skip enemy turn"
    },

    heal: {
        name: "Healing Word",
        type: "support",
        target: "ally",
        requiresRoll: false,
        description: "Heal 1 HP"
    },

    inspire: {
        name: "Bardic Inspiration",
        type: "support",
        target: "party",
        requiresRoll: false,
        description: "+3 attack rolls to ALL allies (2 turns)"
    },

    hypnotic: {
        name: "Hypnotic Pattern",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 17,
        description: "Skip enemy turns"
    },

    fireball: {
        name: "Fireball",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,
        element: "burn",
        description: "Apply Burn"
    },

    frost: {
        name: "Ray of Frost",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,
        element: "frost",
        description: "Apply Frostbite"
    },

    lightning: {
        name: "Lightning Bolt",
        type: "attack",
        target: "enemy",
        requiresRoll: true,
        threshold: 13,
        element: "shock",
        description: "Apply Shock"
    },

    missiles: {
        name: "Magic Missiles",
        type: "attack",
        target: "enemy",
        requiresRoll: false,
        description: "Always hit (5 damage)"
    }
};