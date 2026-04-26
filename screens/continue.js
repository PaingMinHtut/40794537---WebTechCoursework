import { getSaveList, loadGame, deleteSave } from "../engine/saveSystem.js";
import { gameState } from "../engine/state.js";
import { loadChapter, startStory } from "../engine/renderer.js";
import { chapter1 } from "../story/chapter1.js";

// 🕒 Time formatter
function formatTime(timestamp) {
    if (!timestamp) return "Unknown";

    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day(s) ago`;
}

export function showSaves() {
    const app = document.getElementById("app");

    // ✅ Sort newest first
    const saves = getSaveList().sort((a, b) => b.lastPlayed - a.lastPlayed);

    if (saves.length === 0) {
        app.innerHTML = `
            <div class="saves-container">
                <h2>No saves found</h2>
                <button class="menu-button" onclick="navigate('menu')">Back</button>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="saves-container">
            <h2 class="saves-title">Saved Games</h2>
            <div id="saveList" class="save-list"></div>
            <button class="menu-button back-btn" onclick="navigate('menu')">Back</button>
        </div>
    `;

    const list = document.getElementById("saveList");

    saves.forEach(save => {
        const div = document.createElement("div");
        div.className = "save-card";

        div.innerHTML = `
            <div class="save-info">
                <div class="save-name">${save.partyName || "Unnamed Party"}</div>
                <div class="save-meta">
                    Chapter ${save.chapter} • Step ${save.step}
                </div>
                <div class="save-time">
                    Last played: ${formatTime(save.lastPlayed)}
                </div>
            </div>

            <div class="save-actions">
                <button data-id="${save.id}" class="load-btn">Load</button>
                <button data-id="${save.id}" class="delete-btn">Delete</button>
            </div>
        `;

        list.appendChild(div);
    });

    // Load handlers (unchanged logic)
    document.querySelectorAll(".load-btn").forEach(btn => {
        btn.onclick = () => {
            const data = loadGame(btn.dataset.id);
            if (!data) return;

            Object.assign(gameState, data);

            if (gameState.chapter === 1) {
                loadChapter(chapter1);
            }

            startStory();
        };
    });

    // Confirm delete (NEW)
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            const confirmed = confirm("Are you sure you want to delete this save?");
            if (!confirmed) return;

            deleteSave(btn.dataset.id);
            showSaves(); // refresh
        };
    });
}