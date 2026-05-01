import { gameState } from "./state.js";
import { render } from "../app.js";
import { saveGame } from "./saveSystem.js";
import { openDiceModal } from "../engine/dice.js";
import { chapter1 } from "../story/chapter1.js";
import { chapter2 } from "../story/chapter2.js";
import { chapter3 } from "../story/chapter3.js";
// expand story chapters later

export function startStory() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="story-container">
            <div class="story-text" id="story-text"></div>
            <div class="story-controls" id="controls"></div>
        </div>
    `;

    // 🧠 Reset rendered flags (important)
    currentStorySteps.forEach(step => step.rendered = false);

    // 🧠 Replay all previous steps
    for (let i = 0; i < gameState.step; i++) {
        renderPastStep(i);
    }

    // Render current step normally
    renderStep();
}

let currentStorySteps = [];

export function loadChapter(storySteps) {
    currentStorySteps = storySteps;
}

function renderStep() {
    const step = currentStorySteps[gameState.step];
    const controls = document.getElementById("controls");

    // Clear ONLY controls
    controls.innerHTML = "";

    if (step.type === "text") {
        appendText(resolveText(step.text));
        controls.innerHTML = `<button onclick="nextStep()">Continue</button>`;
    }

    if (step.type === "dialogue") {
        const lines = typeof step.lines === "function"
            ? step.lines(gameState)
            : step.lines;

        // Supports both single dialogue and multiple lines of dialogue
        if (lines) {
            lines.forEach(line => {
                appendDialogue(line.speaker, resolveText(line.text));
            });
        } else {
            appendDialogue(step.speaker, resolveText(step.text));
        }

        controls.innerHTML = `<button onclick="nextStep()">Continue</button>`;
    }

    if (step.type === "input") {
        appendText(step.text);
        controls.innerHTML = `
            <input type="text" id="nameInput" placeholder="Enter party name">
            <button onclick="submitName()">Enter</button>
        `;
    }

    if (step.type === "choice") {
        appendText(step.text);

        const availableOptions = step.options.filter(opt =>
            !opt.condition || opt.condition(gameState)
        );

        controls.innerHTML = availableOptions.map(opt => `
            <button class="choice-btn">${opt.label}</button>
        `).join("");

        document.querySelectorAll(".choice-btn").forEach((btn, index) => {
            btn.onclick = () => chooseOption(availableOptions[index]);
        });
    }

    if (step.type === "nextChapter") {
        appendText(resolveText(step.text || "Proceed to next chapter?"));

        controls.innerHTML = `
            <button onclick="goToNextChapter(${step.nextChapter})">
                ${step.buttonText || "Continue"}
            </button>
        `;
    }

    if (step.type === "dice") {
        appendText(resolveText(step.text));

        controls.innerHTML = `
            <button id="rollDiceBtn">Roll Dice</button>
        `;

        document.getElementById("rollDiceBtn").onclick = () => {
            openDiceModal({
                text: step.rollText || "Rolling...",
                onResult: (result) => {
                    handleDiceResult(step, result);
                }
            });
        };
    }

    // Combat step
    if (step.type === "combat") {
        startCombat(step);
        return;
    }

    if (step.rendered) return;
    step.rendered = true;
}

function resolveText(text) {
    return typeof text === "function" ? text(gameState) : text;
}

/* Dialogue renderer */
function appendDialogue(speaker, text) {
    const textBox = document.getElementById("story-text");

    const isAlly = gameState.allies.includes(speaker);

    const wrapper = document.createElement("div");
    wrapper.className = `dialogue ${isAlly ? "left" : "right"}`;

    const portrait = document.createElement("div");
    portrait.className = "portrait";

    const name = document.createElement("div");
    name.innerText = speaker;

    const character = document.createElement("div");
    character.className = "character";
    character.appendChild(portrait);
    character.appendChild(name);

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = text;

    if (isAlly) {
        wrapper.appendChild(character);
        wrapper.appendChild(bubble);
    } else {
        wrapper.appendChild(bubble);
        wrapper.appendChild(character);
    }

    textBox.appendChild(wrapper);
    textBox.scrollTop = textBox.scrollHeight;
}

/* Normal text */
function appendText(text) {
    const textBox = document.getElementById("story-text");

    const p = document.createElement("p");
    p.innerText = text;

    textBox.appendChild(p);
    textBox.scrollTop = textBox.scrollHeight;
}

/* Global controls */
window.nextStep = function() {
    gameState.step++;
    saveGame(gameState); // autosave
    renderStep();
};

window.chooseOption = function(option) {

    // ✅ Record choice (NEW SYSTEM)
    gameState.choiceHistory.push({
        chapter: gameState.chapter,
        text: option.log || option.label
    });

    // ✅ Apply effect
    if (option.effect) {
        option.effect(gameState);
    }

    // ✅ Location change
    if (option.setLocation) {
        gameState.location = option.setLocation;
    }

    // ✅ Chapter change
    if (option.nextChapter) {
        gameState.chapter = option.nextChapter;
        gameState.step = 0;

        if (gameState.chapter === 1) loadChapter(chapter1);
        if (gameState.chapter === 2) loadChapter(chapter2);
        if (gameState.chapter === 3) loadChapter(chapter3);
        // expand later

        saveGame(gameState);
        startStory();
        return;
    }

    // ✅ Normal progression
    gameState.step = option.nextStep;
    saveGame(gameState);
    renderStep();
};

window.submitName = function() {
    const input = document.getElementById("nameInput");
    const rawName = input.value.trim();

    const name = rawName || "The Solos"; // Default name if input is empty
    const normalized = rawName.toLowerCase();

    gameState.partyName = name;

    // Reset reactions
    gameState.nameReaction = "normal";

    // Easter eggs
    if (!rawName) {
        gameState.nameReaction = "noName";
    } else if (normalized.includes("mighty nein")) {
        gameState.nameReaction = "mightyNein";
    } else if (normalized.includes("vox machina")) {
        gameState.nameReaction = "voxMachina";
    } else if (normalized.includes("fellowship of the ring")) {
        gameState.nameReaction = "lotr";
    } else if (normalized.includes("laios") || normalized.includes("touden")) {
        gameState.nameReaction = "dungeonMeshi";
    }

    gameState.step++;
    saveGame(gameState); // autosave after naming
    renderStep();
};

// Used when replaying past steps (like when loading a save)
function renderPastStep(index) {
    const step = currentStorySteps[index];

    if (!step || step.rendered) return;

    if (step.type === "text") {
        appendText(resolveText(step.text));
    }

    if (step.type === "dialogue") {
        const lines = typeof step.lines === "function"
            ? step.lines(gameState)
            : step.lines;

        if (lines) {
            lines.forEach(line => {
                appendDialogue(line.speaker, resolveText(line.text));
            });
        } else {
            appendDialogue(step.speaker, resolveText(step.text));
        }
    }

    // ❗ Skip interactive steps when replaying
    // (input, choice, nextChapter)

    step.rendered = true;
}

window.goToNextChapter = function(chapterNumber) {
    gameState.chapter = chapterNumber;
    gameState.step = 0;

    // Load correct chapter
    if (chapterNumber === 1) loadChapter(chapter1);
    if (chapterNumber === 2) loadChapter(chapter2);
    if (chapterNumber === 3) loadChapter(chapter3);
    // expand later

    saveGame(gameState);
    startStory();
};

function handleDiceResult(step, roll) {
    const controls = document.getElementById("controls");
    const textBox = document.getElementById("story-text");

    const success = step.success && roll.total >= step.success.threshold;

    // Save roll
    gameState.lastRoll = roll.total;

    if (!gameState.rollHistory) gameState.rollHistory = [];
    gameState.rollHistory.push({
        chapter: gameState.chapter,
        roll: roll.total
    });

    // Clear controls while showing result
    controls.innerHTML = "";

    // ✅ SUCCESS
    if (success) {
        if (step.success.message) {
            appendText(step.success.message);
        }

        wait(1200).then(() => {
            gameState.step = step.success.nextStep;
            saveGame(gameState);
            renderStep();
        });

        return;
    }

    // ❌ FAIL + ADVANTAGE
    if (step.advantage && !gameState._advantageUsed) {
        if (step.fail?.message) {
            appendText(step.fail.message);
        }

        wait(1200).then(() => {
            showAdvantageRetry(step);
        });

        return;
    }

    // ❌ FAIL (no retry)
    if (step.fail?.message) {
        appendText(step.fail.message);
    }

    wait(1200).then(() => {
        gameState._advantageUsed = false;
        gameState.step = step.fail?.nextStep ?? gameState.step + 1;

        saveGame(gameState);
        renderStep();
    });
}

// advantage retry UI
function showAdvantageRetry(step) {
    const controls = document.getElementById("controls");

    gameState._advantageUsed = true;

    controls.innerHTML = `
        <button id="retryRoll">${step.advantageText || "Try Again"}</button>
        <button id="acceptFail">Accept Failure</button>
    `;

    document.getElementById("retryRoll").onclick = () => {
        openDiceModal({
            text: step.rollText || "Rolling...",
            onResult: (roll) => {
                handleDiceResult(step, roll);
            }
        });
    };

    document.getElementById("acceptFail").onclick = () => {
        gameState._advantageUsed = false;
        gameState.step = step.fail?.nextStep ?? gameState.step + 1;

        saveGame(gameState);
        renderStep();
    };
}

function startCombat(step) {
    // Save combat context
    gameState.currentCombat = {
        encounterId: step.encounterId,
        onWin: step.onWin,
        onLose: step.onLose
    };

    // Switch screen
    gameState.screen = "combat";

    saveGame(gameState);

    render(); // just render combat screen
}

// Simple utility to wait for a specified time (used for pacing)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}