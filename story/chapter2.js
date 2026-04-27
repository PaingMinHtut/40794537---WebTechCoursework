const storySteps = [
    // shared event
    {
        type: "text",
        text: "A strange presence watches you..." // shared event
    },
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