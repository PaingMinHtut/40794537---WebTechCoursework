import { getSaveList, loadGame } from "saveSystem.js";

export function showChoices() {
    const app = document.getElementById("app");
    const saves = getSaveList();

    if (saves.length === 0) {
        app.innerHTML = `
            <div class="choices-container">
                <h2>No saved games</h2>
                <button onclick="navigate('menu')">Back</button>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="choices-container">
            <h2>Choice History</h2>
            <div id="choicesList"></div>
            <button onclick="navigate('menu')">Back</button>
        </div>
    `;

    const container = document.getElementById("choicesList");

    saves.forEach(save => {
        const data = loadGame(save.id);

        const div = document.createElement("div");
        div.className = "choice-save-block";

        div.innerHTML = `
            <h3>${save.partyName || "Unnamed Party"}</h3>
            <div class="choice-list">
                ${
                    data.choiceHistory && data.choiceHistory.length > 0
                        ? data.choiceHistory.map(choice => `
                            <div class="choice-entry">
                                ${choice.text}
                            </div>
                        `).join("")
                        : `<div class="choice-entry">No choices recorded.</div>`
                }
            </div>
        `;

        container.appendChild(div);
    });
}