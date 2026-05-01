import { party } from "party.js";
import { enemies } from "enemies.js";
import { encounters } from "encounters.js";
import { moves } from "moves.js";
import { rollAttack } from "dice.js";
import { 
    applyStatus, 
    processStatuses, 
    tryElementalReaction,
    STATUS
} from "statuses.js";
import { openDiceModal } from "dice.js";
import { gameState } from "state.js";
import { saveGame, loadGame } from "saveSystem.js";
import { render } from "app.js";

const STATUS_ICONS = {
    burn: "🔥",
    frost: "❄️",
    shock: "⚡",

    rage: "💢",
    reckless: "⚠️",
    taunt: "🎯",

    depressed: "😞",
    hypnotized: "🌀",
    inspiration: "✨"
};

let combatState = {
    units: [],
    turnOrder: [],
    turnIndex: 0,
    isActive: false
};

// Initialize combat
function initCombat(encounterId) {

    const partyUnits = Object.values(party).map(p => ({
        ...structuredClone(p),
        team: "player",
        currentHp: p.hp,
        maxHp: p.hp,
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
            maxHp: e.hp,
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
                currentCooldown: 0
            };
        });
    });

    combatState.turnOrder = [...combatState.units].sort(
        (a, b) => b.initiative - a.initiative
    );

    combatState.turnIndex = 0;
    combatState.isActive = true;
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
        el.className = "turn-unit";

        if (i === combatState.turnIndex) {
            el.classList.add("active-turn");
        }

        if (unit.currentHp <= 0) {
            el.classList.add("dead-unit");
        }

        const img = document.createElement("img");
        img.src = `assets/portraits/${unit.portrait}`;
        img.className = "turn-portrait";

        el.appendChild(img);
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

        // Portrait
        const img = document.createElement("img");
        img.src = `assets/portraits/${unit.portrait}`;
        img.className = "portrait-img";

        // HP text
        const hpBar = document.createElement("div");
        hpBar.className = "hp-bar";

        const hpFill = document.createElement("div");
        hpFill.className = "hp-fill";

        const percent = (unit.currentHp / unit.maxHp) * 100;
        hpFill.style.width = percent + "%";

        hpBar.appendChild(hpFill);
        el.appendChild(hpBar);

        // STATUS ICONS
        const statusBar = document.createElement("div");
        statusBar.className = "status-bar";

        unit.statuses.forEach(status => {
            const icon = document.createElement("span");

            const key = status.type.toLowerCase();
            icon.innerText = STATUS_ICONS[key] || "❔";

            statusBar.appendChild(icon);
        });

        el.appendChild(statusBar);
        el.appendChild(img);
        el.appendChild(hpBar, hpFill, percent);

        if (unit.team === "player") {
            partyArea.appendChild(el);
        } else {
            enemyArea.appendChild(el);
        }
    });
}

function startTurn() {
    const unit = combatState.turnOrder[combatState.turnIndex];

    console.log("TURN:", unit.name, unit.team);

    // APPLY COOLDOWN REDUCTION HERE
    if (unit.moves) {
        reduceCooldowns(unit);
    }

    // DEAD PLAYER → skip but KEEP in turn order
    if (unit.team === "player" && unit.currentHp <= 0) {
        setTimeout(nextTurn, 600);
        return;
    }

    const { skipTurn } = processStatuses(unit, log);

    renderTurnBar();

    if (skipTurn) {
        setTimeout(nextTurn, 800);
        return;
    }

    // Always clear UI first
    clearActionUI();

    if (unit.team === "enemy") {
        runEnemyTurn(unit);
    } else {
        renderCharacterPanel(unit);
    }
}

function renderCharacterPanel(unit) {
    document.getElementById("charName").innerText = unit.name;

    document.querySelectorAll(".unit").forEach(el => {
        el.style.pointerEvents = "auto";
    });

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
        el.style.pointerEvents = "auto";
        el.onclick = () => {
            clearTargetSelection();
            executeMove(user, target, move);
        };
    });
}

function executeMove(user, target, move) {

    if (move.requiresRoll) {

        openDiceModal({
            text: `${user.name} uses ${move.name}!`,
            rollFn: () => rollAttack({
                attackBonus: getAttackBonus(user),
                targetAC: 0
            }),
            onResult: (roll) => {

                log(`${user.name} rolled ${roll.total}`);

                // USE THRESHOLD INSTEAD OF roll.hit
                if (roll.base === 1 || roll.total < move.threshold) {
                    log("Miss!");
                    if (move.endsTurn !== false) {
                        clearActionUI();
                        nextTurn();
                    }
                    return;
                }

                log(roll.isCrit ? "Critical Hit!" : "Hit!");

                applyMove(user, target, move, roll);
            }
        });

        return;
    }

    // No roll (for moves that don't require rolls)
    applyMove(user, target, move, null);
}

function handleMove(user, move) {

    // PARTY BUFF
    if (move.target === "party") {
        combatState.units
            .filter(u => u.team === "player")
            .forEach(u => {
                applyStatus(u, {
                    type: STATUS.INSPIRATION,
                    duration: 2,
                    value: 3
                });
            });

        applyMove(user, null, move, null);
        return;
    }

    // SELF
    if (move.target === "self") {
        applyMove(user, user, move, null);
        return;
    }

    // TARGET
    selectTarget(user, move);
}

function applyMove(user, target, move, roll) {

    // LOG MOVE NAME
    log(`${user.name} uses ${move.name}!`);

    let damage = 0;

    // DAMAGE
    if (move.getDamage) {
        damage = move.getDamage(roll);
    }

    // RAGE BONUS
    if (user.statuses.some(s => s.type === STATUS.RAGE)) {
        damage += 2;
    }

    // APPLY DAMAGE
    if (damage > 0 && target) {
        target.currentHp -= damage;
        log(`${user.name} deals ${damage} damage to ${target.name}`);
    }

    // ELEMENTAL REACTION (VERY IMPORTANT)
    if (move.element && target) {
        tryElementalReaction(target, move.element, log);
    }

    // ON HIT
    if (move.onHit && target) {
        move.onHit(user, target, roll);
    }

    // ON USE
    if (move.onUse) {
        move.onUse(user, target);

        // CUSTOM LOGS (NOW YOU CAN IDENTIFY MOVES)
        if (move.name === "Unbridled Rage") {
            log(`${user.name} is going on a rampage!`);
        }

        if (move.name === "Beckoning Roar") {
            log("Enemies are forced to target Grog!");
        }

        if (move.name === "Bardic Inspiration") {
            log("Party gains +3 attack bonus for 2 turns!");
        }
    }

    // COOLDOWN APPLY (ALWAYS)
    if (move.cooldown) {
        move.currentCooldown = move.cooldown;
    }

    handleDeath();
    renderUnits();

    if (move.endsTurn !== false) {
        nextTurn();
    }
}

function getAttackBonus(unit) {
    let bonus = unit.attackBonus || 0;

    const inspiration = unit.statuses.find(s => s.type === STATUS.INSPIRATION);

    if (inspiration) {
        bonus += inspiration.value || 3;
    }

    return bonus;
}

function getEffectiveAC(unit) {
    let ac = unit.ac;

    unit.statuses.forEach(s => {
        if (s.type === STATUS.RECKLESS) {
            ac += s.value; // value is -7
        }
    });

    return ac;
}

function clearTargetSelection() {
    document.querySelectorAll(".unit").forEach(el => {
        el.style.outline = "";
        el.onclick = null;
        el.style.pointerEvents = "auto";
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

    clearActionUI(); // prevent UI interaction during enemy turn
    document.querySelectorAll(".unit").forEach(el => {
        el.style.pointerEvents = "none";
    });

    log(`${enemy.name}'s turn`);

    setTimeout(() => {

        if (enemy.type === "basic") {
            basicEnemyAI(enemy);
        } else if (enemy.type === "elite") {
            eliteEnemyAI(enemy);
        }

    }, 800); // increased delay
}

function getTarget(enemy) {

    const players = combatState.units.filter(u =>
        u.team === "player" &&
        u.currentHp > 0
    );

    if (players.length === 0) return null;

    // 🎯 TAUNT
    const tauntTarget = players.find(p =>
        p.statuses.some(s => s.type === STATUS.TAUNT)
    );

    if (tauntTarget) return tauntTarget;

    return players[Math.floor(Math.random() * players.length)];
}

function basicEnemyAI(enemy) {

    const target = getTarget(enemy);

    if (!target) {
        log("No targets left");
        return endEnemyTurn();
    }

    const roll = rollAttack({
        attackBonus: 0,
        targetAC: getEffectiveAC(target)
    });

    log(`${enemy.name} attacks ${target.name}`);
    log(`Roll: ${roll.total}`);

    if (!roll.hit) {
        log("Miss!");
        return endEnemyTurn();
    }

    let damage;

    if (roll.isCrit) { // 2 damage on nat20s
        damage = 2;
    } else {
        damage = 1; // always deal 1 damage
    }

    target.currentHp -= damage;

    log(`${enemy.name} deals ${damage} damage to ${target.name}`);

    handleDeath();
    renderUnits();

    endEnemyTurn();
}

function eliteEnemyAI(enemy) {

    const target = getTarget(enemy);

    if (!target) {
        log("No targets left");
        return endEnemyTurn();
    }

    const useSpecial = Math.random() < 0.5 && enemy.specialMove;

    if (useSpecial) {

        log(`${enemy.name} uses ${enemy.specialMove.name}!`);

        const roll = rollAttack({
            attackBonus: 0,
            targetAC: getEffectiveAC(target)
        });

        log(`Roll: ${roll.total}`);

        if (!roll.hit) {
            log("Miss!");
            return endEnemyTurn();
        }

        const damage = enemy.specialMove.getDamage
            ? enemy.specialMove.getDamage(roll)
            : 2;

        target.currentHp -= damage;

        log(`${enemy.name} deals ${damage} damage to ${target.name}`);

        if (enemy.specialMove.onHit) {
            enemy.specialMove.onHit(target);
        }

        handleDeath();
        renderUnits();

        endEnemyTurn();

    } else {
        return basicEnemyAI(enemy);
    }
}

function endEnemyTurn() {
    setTimeout(() => {
        nextTurn();
    }, 1000);
}

function nextTurn() {

    if (!combatState.isActive) return;

    combatState.turnIndex++;

    if (combatState.turnIndex >= combatState.turnOrder.length) {
        combatState.turnIndex = 0;
    }

    setTimeout(() => {
        startTurn();
    }, 300);
}

function clearActionUI() {
    const actionsRow = document.getElementById("actionsRow");
    const tooltip = document.getElementById("tooltip");
    const charName = document.getElementById("charName");

    if (actionsRow) actionsRow.innerHTML = "";
    if (tooltip) tooltip.innerText = "";
    if (charName) charName.innerText = "";
}

function handleDeath() {

    // ENEMY DEATH
    combatState.units = combatState.units.filter(unit => {
        if (unit.team === "enemy" && unit.currentHp <= 0) {
            log(`${unit.name} is defeated!`);
            return false;
        }
        return true;
    });

    // ALLY DEATH (DO NOT REMOVE)
    combatState.units.forEach(unit => {
        if (unit.team === "player" && unit.currentHp <= 0 && !unit._deadLogged) {
            log(`${unit.name} has fallen!`);
            unit._deadLogged = true;
        }
    });

    // REBUILD TURN ORDER (KEEP DEAD ALLIES)
    combatState.turnOrder = combatState.units
        .sort((a, b) => b.initiative - a.initiative);

    // WIN CHECK
    const enemiesAlive = combatState.units.some(u => u.team === "enemy");

    if (!enemiesAlive) {
        setTimeout(() => showCombatResult("win"), 800);
        return;
    }

    // LOSE CHECK
    const alliesAlive = combatState.units.some(
        u => u.team === "player" && u.currentHp > 0
    );

    if (!alliesAlive) {
        setTimeout(() => showCombatResult("lose"), 800);
        return;
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showCombatResult(type) {
    const modal = document.createElement("div");
    modal.className = "combat-modal";

    const isWin = type === "win";

    modal.innerHTML = `
        <div class="combat-modal-overlay">
            <div class="combat-modal-box">
                <h2>${isWin ? "Victory!" : "Defeat..."}</h2>
                <button id="combatResultBtn">
                    ${isWin ? "Continue" : "Try Again"}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("combatResultBtn").onclick = () => {
        modal.remove();

        if (isWin) {
            endCombatWin();
        } else {
            restartCombat();
        }
    };
}

function endCombatWin() {
    const { onWin } = gameState.currentCombat;

    // Resume story
    gameState.screen = "story";

    // Move to the correct step AFTER combat
    if (onWin !== undefined) {
        gameState.step = onWin;
    }

    saveGame(gameState);

    render();
}

function restartCombat() {
    // simply reload the current save
    const save = loadGame(gameState.saveId);

    if (save) {
        Object.assign(gameState, save);
    }

    render();
}