// combat/data/statuses.js

// =======================
// STATUS DEFINITIONS
// =======================

export const STATUS = {
    BURN: "burn",
    FROST: "frost",
    SHOCK: "shock",

    DEPRESSED: "depressed",
    HYPNOTIZED: "hypnotized",
    INSPIRATION: "inspiration",

    RAGE: "rage",
    RECKLESS: "reckless",
    TAUNT: "taunt"
};

// =======================
// ELEMENTAL REACTIONS
// =======================

const REACTIONS = {
    burn_shock: "overload",
    burn_frost: "melt",
    frost_shock: "superconduct"
};

// =======================
// APPLY STATUS
// =======================

export function applyStatus(target, status) {
    // remove same type (no stacking duplicates)
    target.statuses = target.statuses.filter(s => s.type !== status.type);

    target.statuses.push({
        ...status
    });
}

// =======================
// PROCESS STATUSES (TURN START)
// =======================

export function processStatuses(unit, log) {
    let skipTurn = false;

    unit.statuses.forEach(status => {
        switch (status.type) {

            // 🔥 DAMAGE OVER TIME
            case STATUS.BURN:
            case STATUS.FROST:
            case STATUS.SHOCK:
                const dmg = status.value || 1;
                unit.currentHp -= dmg;
                log(`${unit.name} takes ${dmg} damage from ${status.type}`);
                break;

            // 🧠 TURN SKIP
            case STATUS.DEPRESSED:
            case STATUS.HYPNOTIZED:
                skipTurn = true;
                log(`${unit.name} is ${status.type} and skips their turn`);
                break;
        }

        status.duration--;
    });

    // remove expired
    unit.statuses = unit.statuses.filter(s => s.duration > 0);

    return { skipTurn };
}

// =======================
// ELEMENTAL REACTION
// =======================

export function tryElementalReaction(target, newElement) {
    const existing = target.statuses.find(s =>
        [STATUS.BURN, STATUS.FROST, STATUS.SHOCK].includes(s.type)
    );

    if (!existing) return null;

    const key = [existing.type, newElement].sort().join("_");

    if (REACTIONS[key]) {
        // remove existing element
        target.statuses = target.statuses.filter(s => s !== existing);

        return {
            type: REACTIONS[key],
            bonusDamage: 3
        };
    }

    return null;
}