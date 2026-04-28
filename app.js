import { gameState } from "../engine/state.js";

import { showMenu } from "../screens/menuPage.js";
import { showNewGame } from "../screens/newgamePage.js";
import { showSaves } from "../screens/continuePage.js";
import { showChoices } from "../screens/choicesPage.js";
import { showCombat } from "../screens/combatPage.js";

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
        case "combat":
            showCombat();
            break;
    }
}

// Start app
render();