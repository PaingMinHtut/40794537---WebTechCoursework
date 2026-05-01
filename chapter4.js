const storySteps = [
    {
        type: "text",
        text: `The party returns to the town square of Waltown.`
    },
    {
        type: "text",
        text: `Word of their victory spreads quickly—what little of the town remains gathers to greet them. A handful of weary villagers step forward, offering scattered applause and quiet cheers.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "villager_1",
                text: `Y-you did it... The Walmart... it's gone...`
            },
            {
                speaker: "villager_2",
                text: `Thank you... truly.`
            }
        ]
    },
    {
        type: "text",
        text: `The celebration is... modest. A few claps. A couple of tired smiles. The town is simply too empty for anything more.`
    },
    {
        type: "text",
        text: `Rellynn stands slightly apart from the group, the strange staff still in her hands. Its glow has dimmed, but it hasn’t gone out.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `So... what happens to that thing now?`
            },
            {
                speaker: "Grog",
                text: `Yeah. That stick caused a lot of trouble.`
            }
        ]
    },
    {
        type: "text",
        text: `Rellynn could hear a faint, sinister whisper from within the staff. It seems to tell her to keep it. It could grant her unimaginable power, enough to finally get revenge on her family for casting her out. She would finally be the greatest wizard in her family.`
    },
    {
        type: "dialogue",
        speaker: "Grog",
        text: `Rellynn, are you there?`
    },

    // CHOICE: STAFF
    {
        type: "choice",
        text: `Rellynn looks down at the staff. It hums faintly in her grasp. What will she do?`,
        options: [
            {
                label: "Keep the staff",
                log: "Rellynn decided to keep the magic staff.",
                nextStep: 9,
                effect: (state) => {
                    state.flags.keptStaff = true;
                }
            },
            {
                label: "Break the staff",
                log: "Rellynn destroyed the magic staff.",
                nextStep: 9,
                effect: (state) => {
                    state.flags.brokeStaff = true;
                }
            }
        ]
    },

    // MERGED RESULT
    {
        type: "text",
        text: (state) => {
            if (state.flags.keptStaff) {
                return `Rellynn tightens her grip on the staff.`;
            } else if (state.flags.brokeStaff) {
                return `Rellynn raises the staff high above her head.`;
            }
        }
    },
    {
        type: "dialogue",
        speaker: "Rellynn",
        text: (state) => {
            if (state.flags.keptStaff) {
                return `...I’m keeping it. If something like this exists, I need to understand it. I won’t let it fall into the wrong hands again.`;
            } else if (state.flags.brokeStaff) {
                return `No more of this. We’re done with it. I don't need a powerful magic staff to prove myself.`;
            }
        }
    },
    {
        type: "text",
        text: (state) => {
            if (state.flags.keptStaff) {
                return `Despite what she says, somewhere within her psyche, there are "other reasons" for wanting to keep the staff.`;
            } else if (state.flags.brokeStaff) {
                return `With a decisive motion, she brings it down against the stone pavement. The staff cracks, its glow flickering violently before fading out completely.`;
            }
        }
    },

    // MERGE
    {
        type: "text",
        text: `The moment passes. The town grows quiet again.`
    },
    {
        type: "text",
        text: `Grog looks around, scratching his head. There's this familiar feeling that is missing somehow...`
    },
    {
        type: "dialogue",
        speaker: "Grog",
        text: `...We're not getting paid, are we?`
    },
    {
        type: "text",
        text: `The realization settles in. Jerry—the one who promised them a reward—is gone.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Rellynn",
                text: `...No. I don’t think we are.`
            },
            {
                speaker: "Grog",
                text: `Great. Fantastic...`
            }
        ]
    },

    {
        type: "dialogue",
        speaker: "Leo",
        text: `Well... maybe the real reward was the friends we made along the way.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `🤢`
            },
            {
                speaker: "Rellynn",
                text: `🤮`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "Leo",
        text: `By the gods. Are you two alright?`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `U-Uh, yeah. I-I don't know what happened, man.`
            },
            {
                speaker: "Rellynn",
                text: `Y-Yeah. Me neither.`
            }
        ]
    },

    // ENDING
    {
        type: "text",
        text: `The small crowd begins to disperse. One by one, the villagers return to what little remains of their lives.`
    },
    {
        type: "text",
        text: `Before long, the town square is empty again.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `So... where to next?`
            },
            {
                speaker: "Grog",
                text: `Anywhere with actual gold.`
            },
            {
                speaker: "Rellynn",
                text: `And preferably without... whatever that was.`
            }
        ]
    },
    {
        type: "text",
        text: `The party shares a quiet moment... then turns toward the road ahead.`
    },
    {
        type: "text",
        text: `Together, they leave Waltown behind.`
    },
    {
        type: "text",
        text: `Their adventure in Waltown ends, but their journey contines.`
    },
    {
        type: "returnToMenu",
        text: `THE END.`,
        buttonText: "Return to Main Menu"
    }
];

export const chapter4 = storySteps;