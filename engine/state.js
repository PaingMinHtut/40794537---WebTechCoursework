import { defaultChoiceFlags } from "../choices/choiceConditions.js";

export const gameState = {
    screen: "menu",
    chapter: null,
    step: 0,
    partyName: "",
    inventory: [],
    allies: ["Grog", "Leo", "Rellynn"],

    saveId: null,

    flags: { ...defaultChoiceFlags },

    choiceHistory: [] // NEW
};