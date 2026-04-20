export function showMenu() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="menu-container">
            <div class="game-title">Echoes of Aether</div>

            <div class="menu-box">
                <div class="menu-button" onclick="navigate('newGame')">New Game</div>
                <div class="menu-button" onclick="navigate('continue')">Continue</div>
                <div class="menu-button" onclick="navigate('choices')">Choices</div>
            </div>
        </div>
    `;
}