import { gameState } from "../state.js";
import { loadChapter, startStory } from "../engine/renderer.js";
import { chapter1 } from "../story/chapter1.js";

export function showNewGame() {
    gameState.chapter = 1;
    gameState.step = 0;

    loadChapter(chapter1);
    startStory();
}