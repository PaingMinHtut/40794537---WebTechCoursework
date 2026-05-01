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

export function tryElementalReaction(target, newElement, log) {

    const existing = target.statuses.find(s =>
        s.type === STATUS.BURN ||
        s.type === STATUS.FROST ||
        s.type === STATUS.SHOCK
    );

    if (!existing) {
        applyStatus(target, { type: newElement, duration: 2 });
        return;
    }

    const combo = [existing.type, newElement].sort().join("-");

    let reaction = null;

    if (combo === [STATUS.BURN, STATUS.SHOCK].sort().join("-")) {
        reaction = "Overload";
    }

    if (combo === [STATUS.BURN, STATUS.FROST].sort().join("-")) {
        reaction = "Melt";
    }

    if (combo === [STATUS.FROST, STATUS.SHOCK].sort().join("-")) {
        reaction = "Superconduct";
    }

    if (reaction) {
        target.currentHp -= 3;
        log(`${reaction}! 3 bonus damage!`);

        // remove both statuses
        target.statuses = target.statuses.filter(s =>
            s.type !== existing.type
        );

        return;
    }

    // otherwise replace
    applyStatus(target, { type: newElement, duration: 2 });
}