export function startStory() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="story-container">
            <div class="story-text" id="story-text"></div>
            <div class="story-controls" id="controls"></div>
        </div>
    `;

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
            <button onclick="chooseOption(${opt.nextStep})">${opt.label}</button>
        `).join("");
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
    renderStep();
};

window.chooseOption = function(stepIndex) {
    gameState.step = stepIndex;
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
    renderStep();
};