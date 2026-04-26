import { gameState } from "../engine/state.js";

import { showMenu } from "../screens/menu.js";
import { showNewGame } from "../screens/newgame.js";
import { showSaves } from "../screens/continue.js";
import { showChoices } from "../screens/choices.js";

// Make navigation globally accessible (for onclick)
window.navigate = function(screen) {
    gameState.screen = screen;
    render();
};

export function render() {
    switch (gameState.screen) {
        case "menu":
            showMenu();
            break;
        case "newGame":
            showNewGame();
            break;
        case "continue":
            showSaves();
            break;
        case "choices":
            showChoices();
            break;
    }
}

// Start app
render();