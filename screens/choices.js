export function showChoices() {
    document.getElementById("app").innerHTML = `
        <h1>This is the Choices page</h1>
        <button onclick="navigate('menu')">Back</button>
    `;
}