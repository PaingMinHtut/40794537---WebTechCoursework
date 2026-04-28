import { gameState } from "../engine/state.js";
import { loadChapter, startStory } from "../engine/renderer.js";
import { createNewSave } from "../engine/saveSystem.js";
import { chapter1 } from "../story/chapter1.js";

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