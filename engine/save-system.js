function generateId() {
    return crypto.randomUUID();
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

    const id = crypto.randomUUID();
    gameState.saveId = id;

    saves[id] = structuredClone(gameState);
    setAllSaves(saves);

    return id;
}

export function saveGame(gameState) {
    if (!gameState.saveId) return;

    const saves = getAllSaves();
    saves[gameState.saveId] = structuredClone(gameState);

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
        step: data.step
    }));
}