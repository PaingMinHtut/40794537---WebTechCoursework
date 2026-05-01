import { gameState } from "state.js";

import { showMenu } from "menuPage.js";
import { showNewGame } from "newgamePage.js";
import { showSaves } from "continuePage.js";
import { showChoices } from "choicesPage.js";
import { showCombat } from "combatPage.js";
import { startStory } from "renderer.js";

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
        case "story":
            startStory();
            break;
    }
}

// Start app
render();