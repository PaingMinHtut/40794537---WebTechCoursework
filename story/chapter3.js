const storySteps = [
    // depends on location choice in chapter 2
    {
        type: "text",
        text: (state) => {
            if (state.location === "clothing") {
                return "You are surrounded by mannequins...";
            }
            if (state.location === "hardware") {
                return "Tools begin to move on their own...";
            }
        }
    },

    {
        type: "text",
        text: "A strange presence watches you..." // shared event
    }
];

export const chapter3 = storySteps;