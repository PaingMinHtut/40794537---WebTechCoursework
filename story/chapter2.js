const storySteps = [
    // shared event
    {
        type: "text",
        text: "A strange presence watches you..." // shared event
    },
    // choice roll example
    {
        type: "dice",
        text: "The door looks fragile. Try to break it?",
        rollText: "Strength Check",

        success: {
            threshold: 12,
            nextStep: 2
        },

        fail: {
            nextStep: 2
        }
    },
    // choice roll with advantage example
    {
        type: "dice",
        text: "Try to convince the guard to let you pass.",
        rollText: "Persuasion Attempt",

        success: {
            threshold: 12,
            nextStep: 3,
            message: "The party successfully convinced the guards."
        },

        fail: {
            nextStep: 3,
            message: "The guards remain unconvinced."
        },

        advantage: true,
        advantageText: "Try again with a better argument?"
    },

    // branching choice based on location
    {
        type: "choice",
        text: "Where do you go next?",
        options: [
            {
                label: "Clothing Department",
                log: "The party headed to the clothing department.",
                nextStep: 0,
                setLocation: "clothing",
                nextChapter: 3,
                effect: (state) => {
                    state.flags.wentToClothing = true;
                }
            },
            {
                label: "Hardware Department",
                log: "The party headed to the hardware department.",
                nextStep: 0,
                setLocation: "hardware",
                nextChapter: 3,
                effect: (state) => {
                    state.flags.wentToHardware = true;
                }
            }
        ]
    }
];

export const chapter2 = storySteps;