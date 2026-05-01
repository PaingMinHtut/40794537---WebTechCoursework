import { gameState } from "state.js";
import { loadChapter, startStory } from "renderer.js";
import { createNewSave } from "saveSystem.js";
import { chapter1 } from "chapter1.js";

export function showNewGame() {
    // Reset state
    gameState.chapter = 1;
    gameState.step = 0;
    gameState.partyName = "";

    // Create save slot
    createNewSave(gameState);

    loadChapter(chapter1);
    startStory();
}