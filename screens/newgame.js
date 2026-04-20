export function showNewGame() {
    document.getElementById("app").innerHTML = `
        <h1>This is the New Game page</h1>
        <button onclick="navigate('menu')">Back</button>
    `;
}