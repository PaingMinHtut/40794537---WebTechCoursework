export function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export function rollChoice({ modifier = 0 } = {}) {
    const base = rollD20();
    const total = base + modifier;

    return {
        base,
        modifier,
        total,
        isCritSuccess: base === 20,
        isCritFail: base === 1
    };
}

// Attack roll
export function rollAttack({
    attackBonus = 0,
    targetAC = 10
} = {}) {
    const base = rollD20();
    const total = base + attackBonus;

    const isCrit = base === 20;
    const isMiss = base === 1;

    const hit = isCrit || (!isMiss && total >= targetAC);

    return {
        base,
        total,
        hit,
        isCrit,
        isMiss
    };
}

export function openDiceModal({ text = "Roll the dice!", rollFn, onResult }) {
    const modal = document.createElement("div");
    modal.className = "dice-modal";

    modal.innerHTML = `
        <div class="dice-overlay">
            <div class="dice-box">
                <h2>${text}</h2>

                <div id="diceDisplay" class="dice-display">?</div>

                <button id="rollBtn">Roll</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const display = document.getElementById("diceDisplay");
    const rollBtn = document.getElementById("rollBtn");

    rollBtn.onclick = () => {
        rollBtn.disabled = true;

        let rolls = 0;

        // Rolling animation
        const interval = setInterval(() => {
            display.innerText = Math.floor(Math.random() * 20) + 1;
            rolls++;
        }, 80);

        setTimeout(() => {
            clearInterval(interval);

            // Use provided roll function OR fallback to choice roll
            const roll = rollFn ? rollFn() : rollChoice();

            display.innerText = roll.total;

            // Reset classes
            display.classList.remove("crit-success", "crit-fail");

            // Handle BOTH systems (choice + attack)
            if (roll.isCrit || roll.isCritSuccess) {
                display.classList.add("crit-success");
            } else if (roll.isMiss || roll.isCritFail) {
                display.classList.add("crit-fail");
            }

            // Small delay before closing
            setTimeout(() => {
                modal.remove();
                onResult(roll);
            }, 2000);

        }, 1000);
    };
}