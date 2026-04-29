import { party } from "../characters/party.js";
import { enemies } from "../characters/enemies.js";
import { encounters } from "./data/encounters.js";
import { moves } from "./data/moves.js";
import { rollAttack } from "../engine/dice.js";
import { 
    applyStatus, 
    processStatuses, 
    tryElementalReaction,
    STATUS
} from "./data/statuses.js";
import { openDiceModal } from "../engine/dice.js";
import { gameState } from "../engine/state.js";

let combatState = {
    units: [],
    turnOrder: [],
    turnIndex: 0
};

// Initialize combat
function initCombat(encounterId) {

    const partyUnits = Object.values(party).map(p => ({
        ...structuredClone(p),
        team: "player",
        currentHp: p.hp,
        statuses: []
    }));

    const enemyIds = encounters[encounterId];

    // Safety check (in case of invalid encounterId)
    if (!enemyIds) {
        console.error("Invalid encounterId:", encounterId);
        return;
    }
    const enemyUnits = enemyIds.map(id => {
        const e = enemies[id];

        return {
            ...e,
            team: "enemy",
            currentHp: e.hp,
            statuses: []
        };
    });

    combatState.units = [...partyUnits, ...enemyUnits];

    combatState.units.forEach(unit => {

        // Skip enemy units as they don't use the same move system as the player
        if (!unit.moves) return;

        unit.moves = unit.moves.map(moveId => {
            const baseMove = moves[moveId];

            return {
                ...baseMove,
                currentCooldown: baseMove.startLocked
                    ? baseMove.cooldown
                    : 0
            };
        });
    });

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

    const encounterId = gameState.currentCombat.encounterId;

    initCombat(encounterId);
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

    // 💀 Skip dead allies
    if (unit.team === "player" && unit.currentHp <= 0) {
        nextTurn();
        return;
    }

    reduceCooldowns(unit); // ✅ NEW

    const { skipTurn } = processStatuses(unit, log);

    renderTurnBar();

    if (skipTurn) {
        setTimeout(nextTurn, 800);
        return;
    }

    if (unit.team === "enemy") {
        runEnemyTurn(unit);
    } else {
        renderCharacterPanel(unit);
    }
}

function renderCharacterPanel(unit) {
    document.getElementById("charName").innerText = unit.name;

    const hpPercent = (unit.currentHp / unit.maxHp) * 100;
    document.getElementById("healthFill").style.width = hpPercent + "%";

    const actionsRow = document.getElementById("actionsRow");
    const tooltip = document.getElementById("tooltip");

    actionsRow.innerHTML = "";

    unit.moves.forEach(move => {

        const btn = document.createElement("button");
        btn.innerText = move.name;

        if (move.currentCooldown > 0) {
            btn.disabled = true;
            btn.innerText += ` (${move.currentCooldown})`;
        }

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

    // 🎲 IF ROLL REQUIRED
    if (move.requiresRoll) {

        openDiceModal({
            text: `${user.name} uses ${move.name}!`,
            rollFn: () => rollAttack({
                attackBonus: getAttackBonus(user),
                targetAC: target.ac
            }),
            onResult: (roll) => {

                log(`${user.name} rolled ${roll.total}`);

                if (!roll.hit) {
                    log("Miss!");
                    if (move.endsTurn !== false) nextTurn();
                    return;
                }

                log(roll.isCrit ? "Critical Hit!" : "Hit!");

                applyMove(user, target, move, roll);
            }
        });

        return;
    }

    // ⚡ NO ROLL (like Magic Missiles, Rage, Roar)
    applyMove(user, target, move, null);
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

function applyMove(user, target, move, roll) {

    let damage = 0;

    // 🎯 DAMAGE
    if (move.getDamage) {
        damage = move.getDamage(roll);
    }

    // 💪 RAGE BONUS
    if (user.statuses.some(s => s.type === STATUS.RAGE)) {
        damage += 2;
    }

    if (damage > 0) {
        target.currentHp -= damage;
        log(`${user.name} deals ${damage} damage to ${target.name}`);
        handleDeath();
    }

    // ✨ ON HIT EFFECTS
    if (move.onHit && target) {
        move.onHit(user, target, roll);
    }

    // ⚡ ON USE (for support moves)
    if (move.onUse) {
        move.onUse(user, target);
    }

    if (move.cooldown) {
        move.currentCooldown = move.cooldown;
    }

    renderUnits();

    // 🔚 TURN CONTROL
    if (move.endsTurn !== false) {
        nextTurn();
    }
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

function reduceCooldowns(unit) {
    unit.moves.forEach(move => {
        if (move.currentCooldown > 0) {
            move.currentCooldown--;
        }
    });
}

function runEnemyTurn(enemy) {

    log(`${enemy.name}'s turn`);

    // ⏳ Small delay for feel
    setTimeout(() => {

        if (enemy.type === "basic") {
            basicEnemyAI(enemy);
        }

        if (enemy.type === "elite") {
            eliteEnemyAI(enemy);
        }

    }, 600);
}

function getTarget(enemy) {
    const players = combatState.units.filter(u => u.team === "player" && u.currentHp > 0);

    // 🎯 Check for TAUNT
    const tauntTarget = players.find(p =>
        p.statuses.some(s => s.type === STATUS.TAUNT)
    );

    if (tauntTarget) return tauntTarget;

    // 🎲 Random target
    return players[Math.floor(Math.random() * players.length)];
}

function basicEnemyAI(enemy) {

    const target = getTarget(enemy);

    const roll = rollAttack({
        attackBonus: 0,
        targetAC: target.ac
    });

    log(`${enemy.name} attacks ${target.name}`);
    log(`Roll: ${roll.total}`);

    if (!roll.hit) {
        log("Miss!");
        return endEnemyTurn();
    }

    let damage = 1;

    // 🎲 Damage distribution
    const rand = Math.random();

    if (roll.isCrit) {
        damage = 3;
    } else if (rand < 0.33) { // 1/3 chance for 2 damage
        damage = 2;
    } else { // 2/3 chance for 1 damage
        damage = 1;
    }

    target.currentHp -= damage;
    handleDeath();

    log(`${enemy.name} deals ${damage} damage to ${target.name}`);

    renderUnits();

    endEnemyTurn();
}

function eliteEnemyAI(enemy) {

    const target = getTarget(enemy);

    // 50% chance to use special
    const useSpecial = Math.random() < 0.5 && enemy.specialMove;

    if (useSpecial) {
        log(`${enemy.name} uses ${enemy.specialMove.name}!`);

        const roll = rollAttack({
            attackBonus: 0,
            targetAC: target.ac
        });

        log(`Roll: ${roll.total}`);

        if (!roll.hit) {
            log("Miss!");
            return endEnemyTurn();
        }

        let damage = enemy.specialMove.getDamage
            ? enemy.specialMove.getDamage(roll)
            : 2;

        target.currentHp -= damage;
        handleDeath();

        log(`${enemy.name} deals ${damage} damage to ${target.name}`);

        if (enemy.specialMove.onHit) {
            enemy.specialMove.onHit(target);
        }

    } else {
        basicEnemyAI(enemy);
        return; // already ends turn
    }

    renderUnits();

    endEnemyTurn();
}

function endEnemyTurn() {
    setTimeout(() => {
        nextTurn();
    }, 800);
}

function nextTurn() {
    combatState.turnIndex++;

    if (combatState.turnIndex >= combatState.turnOrder.length) {
        combatState.turnIndex = 0;
    }

    startTurn();
}

function handleDeath() {

    // Remove dead enemies
    combatState.units = combatState.units.filter(unit => {
        if (unit.team === "enemy" && unit.currentHp <= 0) {
            log(`${unit.name} is defeated!`);
            return false;
        }
        return true;
    });

    // Rebuild turn order (VERY IMPORTANT)
    combatState.turnOrder = combatState.units
        .filter(u => u.currentHp > 0 || u.team === "player")
        .sort((a, b) => b.initiative - a.initiative);

    // Fix turn index if needed
    if (combatState.turnIndex >= combatState.turnOrder.length) {
        combatState.turnIndex = 0;
    }

    // 🏆 Check win condition
    const enemiesAlive = combatState.units.some(u => u.team === "enemy");

    if (!enemiesAlive) {
        log("Victory!");
        // !! TODO: return to story !!
    }
}

function log(text) {
    const logBox = document.getElementById("battleLog");

    if (!logBox) return; // safety (prevents crashes if UI not ready)

    const entry = document.createElement("div");
    entry.innerText = text;

    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}