import { gameState } from "../engine/state.js";

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
                    <div id="charName">Character</div>

                    <div class="health-bar">
                        <div class="health-fill" id="healthFill"></div>
                    </div>

                    <div class="actions">
                        <div class="action-row" id="actionsRow"></div>
                        <div class="item-row" id="itemsRow"></div>
                    </div>

                    <div class="tooltip" id="tooltip"></div>
                </div>

                <div class="battle-log" id="battleLog"></div>

            </div>

        </div>
    `;

    console.log("Combat started:", gameState.currentCombat);

    renderDummyUnits(); // 👈 temporary test
}

function renderDummyUnits() {
    const partyArea = document.getElementById("partyArea");
    const enemyArea = document.getElementById("enemyArea");

    partyArea.innerHTML = "";
    enemyArea.innerHTML = "";

    // 🟦 Party (3)
    for (let i = 0; i < 3; i++) {
        const unit = document.createElement("div");
        unit.className = "unit";
        unit.textContent = "P";
        partyArea.appendChild(unit);
    }

    // 🟥 Enemies (4)
    for (let i = 0; i < 4; i++) {
        const unit = document.createElement("div");
        unit.className = "unit";
        unit.textContent = "E";
        enemyArea.appendChild(unit);
    }
}