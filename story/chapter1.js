import { gameState } from "../state.js";

// Story data (you can expand this later)
const storySteps = [
    {
        type: "text",
        text: `Once upon a time— or actually, 5 minutes ago, but that’s not as dramatic— a group of adventurers found themselves approaching the gates of a small town of Walltown, known for its really high walls.`
    },
    {
        type: "text",
        text: `Before we continue, let us introduce our heroes, shall we?`
    },
    {
        type: "text",
        text: `There's Grog Stonemason, a hulking, self-proclaimed "beefcake" of a half-orc barbarian. Grog never knew his parents. It was just him and his brother against the world, until one day, they were separated and never saw one another again. He wields a greataxe that is the size of an average gnome, and boy, he is not afraid to use it. It's a miracle the axe is still intact after an ungodly amount of violence Grog has committed with it.`
    },
    {
        type: "text",
        text: `And then there's Rellynn Orialis, the elf wizard. Rellynn was the black sheep of her family of powerful spellcasters, and ran away from home when she couldn't take it anymore. She's actually pretty good at evocation magic, but she's fragile like glass and cannot take a hit to save herself. She also happens to be a huge nerd; you'll often find her with her face buried in a book, or trying to figure out how to conjure a sandwich out of thin air.`
    },
    {
        type: "text",
        text: `And lastly, there's Leopold "Leo" Albrecht von Heimvald d'Aurum IV (jeez, that's a long name...), a human bard from an aristocratic family. Leo grew up with a loving family, stability, and even was an heir to the family wine business. He just thought adventuring was neat, and set out one day with nothing but a harp, a rapier, and a dream. He's got a bit of a reputation for being the physical embodiment of a "main character syndrome", but somehow always manages to charm his way out of trouble.`
    },
    {
        type: "text",
        text: `These three unlikely companions met each other after drunkenly getting into a bar fight at a tavern a few months ago. After escaping the angry mob of villagers together, they decided to stick together and see where the road takes them.`
    },
    {
        type: "text",
        text: `And here they were, standing at the gates of Walltown.\nThey hadn’t come seeking glory. They hadn’t come seeking destiny.\nThey had come seeking work. They were broke as hell.`
    },
    {
        type: "text",
        text: `As they approached the town gates, a pair of guards stepped forward and raised a hand. One of them takes out a notebook and starts questioning the party.`
    },
    {
        type: "dialogue",
        text: `Guard 1: "Hold it right there! State your name and business in Walltown."`
    },
    {
        type: "text",
        text: `Leo cleared his throat, straightened his coat, and gestured dramatically toward the group.`
    },
    {
        type: "input",
        text: `What is your party's name?`
    },
    {
        type: "dialogue",
        text: (state) => `Leo: "My friend, feast your eyes upon us, for your heroes are finally here! We are ${state.partyName}!"`
    },
    {
        type: "dialogue",
        text: `Guard 1: "Oh, great. Yet another one of those high-and-mighty adventurers that won't surely cause trouble. We've got enough porblems already."`
    },
    {
        type: "dialogue",
        text: `Guard 2: "But, I suppose we'd have to let you in anyway. The mayor surely has some fetch quest for you or something."`
    },
    {
        type: "dialogue",
        text: `Guard: "Hold it right there! State your name and business in Walltown."`
    },
    {
        type: "dialogue",
        text: `Guard: "Hold it right there! State your name and business in Walltown."`
    },
    // you are here (the rest of the story hasn't been written yet)
    {
        type: "choice",
        text: `What will you do?`,
        options: [
            {
                label: "Approach the tower",
                nextStep: 5
            },
            {
                label: "Walk away",
                nextStep: 6
            }
        ]
    },
    {
        type: "text",
        text: `You step toward the tower, each footstep echoing ominously...`
    },
    {
        type: "text",
        text: `You turn away, but the feeling of being watched never leaves you...`
    }
];

export function startChapter1() {
    renderStep();
}

function renderStep() {
    const app = document.getElementById("app");
    const step = storySteps[gameState.step];

    app.innerHTML = `
        <div class="story-container">
            <div class="story-text" id="story-text"></div>
            <div class="story-controls" id="controls"></div>
        </div>
    `;

    const textBox = document.getElementById("story-text");
    const controls = document.getElementById("controls");

    // Handle TEXT (string or function)
    if (step.type === "text") {
        const content = typeof step.text === "function"
            ? step.text(gameState)
            : step.text;

        appendText(content);

        controls.innerHTML = `<button onclick="nextStep()">Continue</button>`;
    }

    // Handle INPUT
    if (step.type === "input") {
        appendText(step.text);

        controls.innerHTML = `
            <input type="text" id="nameInput" placeholder="Enter party name">
            <button onclick="submitName()">Enter</button>
        `;
    }

    // Handle CHOICE
    if (step.type === "choice") {
        appendText(step.text);

        controls.innerHTML = step.options.map(opt => `
            <button onclick="chooseOption(${opt.nextStep})">${opt.label}</button>
        `).join("");
    }
}

// Append text with scroll support
function appendText(text) {
    const textBox = document.getElementById("story-text");

    const p = document.createElement("p");
    p.innerText = text;

    textBox.appendChild(p);

    // Auto scroll to bottom
    textBox.scrollTop = textBox.scrollHeight;
}

// Navigation functions (must be global for onclick)
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
    gameState.partyName = input.value || "Nameless Ones";

    gameState.step++;
    renderStep();
};