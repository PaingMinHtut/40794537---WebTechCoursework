export function showSaves() {
    document.getElementById("app").innerHTML = `
        <h1>This is the Continue page</h1>
        <button onclick="navigate('menu')">Back</button>
    `;
}