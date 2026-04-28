import { party } from "../characters/party.js";
import { enemies } from "../characters/enemies.js";
import { moves } from "./data/moves.js";
import { rollAttack } from "../engine/dice.js";
import { 
    applyStatus, 
    processStatuses, 
    tryElementalReaction,
    STATUS
} from "./data/statuses.js";
import { openDiceModal } from "../engine/dice.js";

let combatState = {
    units: [],
    turnOrder: [],
    turnIndex: 0
};

// Initialize combat
function initCombat() {
    const partyUnits = Object.values(party).map(p => ({
        ...structuredClone(p),
        team: "player",
        currentHp: p.hp,
        statuses: []
    }));

    const dummy = {
        ...structuredClone(enemies.training_dummy),
        team: "enemy",
        currentHp: 999,
        statuses: []
    };

    combatState.units = [...partyUnits, dummy];

    combatState.turnOrder = [...combatState.units].sort(
        (a, b) => b.initiative - a.initiative
    );

    combatState.turnIndex = 0;
}

export function showCombat() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="combat-container">
            <div class="turn-bar" id="turnBar"></div>

            <div class="battlefield">
                <div class="team team-left" id="partyArea"></div>
                <div class="team team-right" id="enemyArea"></div>
            </div>

            <div class="combat-ui">
                <div class="character-panel">
                    <div id="charName"></div>
                    <div class="health-bar">
                        <div class="health-fill" id="healthFill"></div>
                    </div>

                    <div id="actionsRow"></div>
                    <div id="tooltip"></div>
                </div>

                <div class="battle-log" id="battleLog"></div>
            </div>
        </div>
    `;

    initCombat();
    renderUnits();
    renderTurnBar();
    startTurn();
}

// Render turn order bar
function renderTurnBar() {
    const bar = document.getElementById("turnBar");
    bar.innerHTML = "";

    combatState.turnOrder.forEach((unit, i) => {
        const el = document.createElement("div");
        el.className = "unit";

        if (i === combatState.turnIndex) {
            el.style.border = "2px solid yellow";
        }

        el.innerText = unit.name[0];
        bar.appendChild(el);
    });
}

// Render units on battlefield (currently just party)
function renderUnits() {
    const partyArea = document.getElementById("partyArea");
    const enemyArea = document.getElementById("enemyArea");

    partyArea.innerHTML = "";
    enemyArea.innerHTML = "";

    combatState.units.forEach(unit => {
        const el = document.createElement("div");
        el.className = "unit";
        el.dataset.id = unit.id;

        const img = document.createElement("img");
        img.src = `assets/portraits/${unit.portrait}`;
        img.className = "portrait-img";

        const hp = document.createElement("div");
        hp.className = "hp-text";
        hp.innerText = `${unit.currentHp}/${unit.maxHp}`;

        el.appendChild(img);
        el.appendChild(hp);

        if (unit.team === "player") {
            partyArea.appendChild(el);
        } else {
            enemyArea.appendChild(el);
        }
    });
}

function startTurn() {
    const unit = combatState.turnOrder[combatState.turnIndex];

    const { skipTurn } = processStatuses(unit, log);

    renderTurnBar();

    if (skipTurn) {
        setTimeout(nextTurn, 800);
        return;
    }

    renderCharacterPanel(unit);
}

function renderCharacterPanel(unit) {
    document.getElementById("charName").innerText = unit.name;

    const hpPercent = (unit.currentHp / unit.maxHp) * 100;
    document.getElementById("healthFill").style.width = hpPercent + "%";

    const actionsRow = document.getElementById("actionsRow");
    const tooltip = document.getElementById("tooltip");

    actionsRow.innerHTML = "";

    unit.moves.forEach(moveId => {
        const move = moves[moveId];

        const btn = document.createElement("button");
        btn.innerText = move.name;

        // Hover tooltip
        btn.onmouseenter = () => {
            tooltip.innerText = move.description;
        };

        btn.onmouseleave = () => {
            tooltip.innerText = "";
        };

        // Click (basic test flow)
        btn.onclick = () => {
            handleMove(unit, move);
        };

        actionsRow.appendChild(btn);
    });
}

function selectTarget(user, move) {
    const validTargets = combatState.units.filter(u => {
        if (move.target === "enemy") return u.team !== user.team;
        if (move.target === "ally") return u.team === user.team;
        return false;
    });

    const tooltip = document.getElementById("tooltip");
    tooltip.innerText = "Select a target...";

    validTargets.forEach(target => {
        const el = document.querySelector(`[data-id="${target.id}"]`);

        el.style.outline = "2px solid yellow";

        el.onclick = () => {
            clearTargetSelection();
            executeMove(user, target, move);
        };
    });
}

function executeMove(user, target, move) {

    // 🎲 ATTACK ROLL
    if (move.requiresRoll) {

        openDiceModal({
            text: `${user.name} attacks!`,
            rollFn: () => rollAttack({
                attackBonus: getAttackBonus(user),
                targetAC: target.ac
            }),
            onResult: (result) => {
                log(`${user.name} rolled ${result.total}`);

                if (!result.hit) {
                    log("Miss!");
                    nextTurn();
                    return;
                }

                log(result.isCrit ? "Critical Hit!" : "Hit!");

                applyMoveEffect(user, target, move);

                renderUnits();
                nextTurn();
            }
        });

        log(`${user.name} rolls ${result.total}`);

        if (!result.hit) {
            log("Miss!");
            nextTurn();
            return;
        }

        log(result.isCrit ? "Critical Hit!" : "Hit!");
    }

    applyMoveEffect(user, target, move);

    renderUnits();

    nextTurn();
}

function handleMove(user, move) {

    // 🟢 PARTY BUFF
    if (move.target === "party") {
        combatState.units
            .filter(u => u.team === "player")
            .forEach(u => {
                applyStatus(u, {
                    type: "inspiration",
                    duration: 2,
                    value: 3
                });
            });

        log("Party gains Bardic Inspiration!");
        nextTurn();
        return;
    }

    // 🟢 SELF
    if (move.target === "self") {

        if (move.name === "Unbridled Rage") {
            applyStatus(user, { type: "rage", duration: 2 });
        }

        if (move.name === "Beckoning Roar") {
            applyStatus(user, { type: "taunt", duration: 1 });
            log("Enemies are forced to target Grog!");
            return;
        }

        nextTurn();
        return;
    }

    // ⚔️ TARGET REQUIRED
    selectTarget(user, move);
}

function applyMoveEffect(user, target, move) {
    let damage = 1;

    // 🔥 ELEMENTAL SYSTEM
    if (move.element) {
        const reaction = tryElementalReaction(target, move.element);

        if (reaction) {
            damage += reaction.bonusDamage;
            log(`${reaction.type.toUpperCase()} triggered!`);
        } else {
            applyStatus(target, {
                type: move.element,
                duration: 2,
                value: 1
            });
        }
    }

    // 💪 RAGE BONUS
    if (user.statuses.some(s => s.type === STATUS.RAGE)) {
        damage += 2;
    }

    target.currentHp -= damage;

    log(`${user.name} dealt ${damage} damage to ${target.name}`);
}

function getAttackBonus(unit) {
    let bonus = unit.attackBonus || 0;

    const inspiration = unit.statuses.find(s => s.type === "inspiration");

    if (inspiration) {
        bonus += inspiration.value;
    }

    return bonus;
}

function clearTargetSelection() {
    document.querySelectorAll(".unit").forEach(el => {
        el.style.outline = "";
        el.onclick = null;
    });
}

function nextTurn() {
    combatState.turnIndex++;

    if (combatState.turnIndex >= combatState.turnOrder.length) {
        combatState.turnIndex = 0;
    }

    startTurn();
}

function log(text) {
    const logBox = document.getElementById("battleLog");

    if (!logBox) return; // safety (prevents crashes if UI not ready)

    const entry = document.createElement("div");
    entry.innerText = text;

    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}