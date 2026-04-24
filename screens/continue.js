import { getSaveList, loadGame, deleteSave } from "../engine/saveSystem.js";
import { gameState } from "../engine/state.js";
import { loadChapter, startStory } from "../engine/renderer.js";
import { chapter1 } from "../story/chapter1.js";

export function showSaves() {
    const app = document.getElementById("app");
    const saves = getSaveList();

    if (saves.length === 0) {
        app.innerHTML = `
            <h2>No saves found</h2>
            <button onclick="navigate('menu')">Back</button>
        `;
        return;
    }

    app.innerHTML = `
        <h2>Saved Games</h2>
        <div id="saveList"></div>
        <button onclick="navigate('menu')">Back</button>
    `;

    const list = document.getElementById("saveList");

    saves.forEach(save => {
        const div = document.createElement("div");

        div.innerHTML = `
            <strong>${save.partyName || "Unnamed Party"}</strong>
            (Chapter ${save.chapter}, Step ${save.step})
            <br>
            <button data-id="${save.id}" class="load">Load</button>
            <button data-id="${save.id}" class="delete">Delete</button>
            <hr>
        `;

        list.appendChild(div);
    });

    // Load handlers
    document.querySelectorAll(".load").forEach(btn => {
        btn.onclick = () => {
            const data = loadGame(btn.dataset.id);
            if (!data) return;

            Object.assign(gameState, data);

            // Load correct chapter
            if (gameState.chapter === 1) {
                loadChapter(chapter1);
            }

            startStory();
        };
    });

    // Delete handlers
    document.querySelectorAll(".delete").forEach(btn => {
        btn.onclick = () => {
            deleteSave(btn.dataset.id);
            showSaves(); // refresh
        };
    });
}