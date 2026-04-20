import { gameState } from "../state.js";
import { startChapter1 } from "../story/chapter1.js";

export function showNewGame() {
    gameState.chapter = 1;
    gameState.step = 0;

    startChapter1();
}