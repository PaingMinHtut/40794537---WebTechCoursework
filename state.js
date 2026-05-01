import { defaultChoiceFlags } from "choiceConditions.js";

export const gameState = {
    screen: "menu",
    chapter: null,
    step: 0,
    partyName: "",
    allies: ["Grog", "Leo", "Rellynn"],

    saveId: null,

    flags: { ...defaultChoiceFlags },

    choiceHistory: [], // NEW
    _advantageUsed: false,
    currentCombat: null,
};