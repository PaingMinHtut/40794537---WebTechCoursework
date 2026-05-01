import { gameState } from "./state.js";

function generateId() {
    return "save-" + crypto.randomUUID();
}

const STORAGE_KEY = "game_saves";

function getAllSaves() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function setAllSaves(saves) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

export function createNewSave(gameState) {
    const saves = getAllSaves();

    const id = generateId();
    gameState.saveId = id;

    const saveData = structuredClone(gameState);
    saveData.lastPlayed = Date.now(); // add timestamp

    saves[id] = saveData;
    setAllSaves(saves);

    return id;
}

export function saveGame(gameState) {
    if (!gameState.saveId) return;

    const saves = getAllSaves();

    const saveData = structuredClone(gameState);
    saveData.lastPlayed = Date.now(); // update timestamp on save

    saves[gameState.saveId] = saveData;

    setAllSaves(saves);
}

export function loadGame(id) {
    const saves = getAllSaves();
    return saves[id] || null;
}

export function deleteSave(id) {
    const saves = getAllSaves();
    delete saves[id];
    setAllSaves(saves);
}

export function getSaveList() {
    const saves = getAllSaves();

    return Object.entries(saves).map(([id, data]) => ({
        id,
        partyName: data.partyName,
        chapter: data.chapter,
        step: data.step,
        lastPlayed: data.lastPlayed || 0 // fallback for old saves
    }));
}