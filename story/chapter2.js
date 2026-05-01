const storySteps = [
    {
        type: "text",
        text: `The party enters the Walmart. The interior is vast and cavernous, and well-lit despite the absence of any fire source. The smooth and slippery tiled floors made of marble reflect the light in a way that creates an eerie, disorienting effect.`
    },
    {
        type: "text",
        text: `Rellynn looks up at a hanging sign above one of the aisles. It reads "Food Department" in bold letters. And yes indeed, the aisles are stocked with various food items, and stretch on endlessly.`
    },
    {
        type: "text",
        text: `As the party ventures deeper into the food department, a loud deafening shriek echoes through the aisles, followed by a loud crunchy voice coming from a strange device attached to the ceiling.`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `SO, JERRY! YOU'VE FINALLY DECIDED TO GROW A PAIR AND COME FACE ME, HUH? AND IT SEEMS YOU BROUGHT SOME FRIENDS WITH YOU THIS TIME! WELL, LET ME TELL YOU SOMETHING. NONE OF YOU ARE GONNA MAKE IT OUT OF HERE ALIVE!`
    },
    {
        type: "dialogue",
        lines:[
            {
                speaker: "Grog",
                text: `Gah!`
            },
            {
                speaker: "Rellynn",
                text: `Oh!`
            },
            {
                speaker: "Leo",
                text: `By the gods! Who is that?`
            },
            {
                speaker: "Jerry",
                text: `T-that's the owner of this place... He's the one who's been causing all the trouble in town.`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `YEAH, THAT'S RIGHT! AND YOU ARE ALL GONNA DIE HERE! BUT FIRST, LET ME INTRODUCE SOME OF MY MINIONS TO YOU!`
    },
    {
        type: "text",
        text: `Suddenly, the aisles around the party start shaking violently...`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `FIRST UP, COCA COLA!`
    },
    {
        type: "text",
        text: `A massive red tin can, with the word "COCA COLA" emblazoned on it, bounces from the aisle, approaching the party. It has razor-sharp teeth and a menacing grin.`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `NEXT, DORITOS!`
    },
    {
        type: "text",
        text: `A massive foil bag, labelled "DORITOS", comes flying towards the party. It has a gaping mouth filled with sharp, triangular chips that it uses to attack.`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `AND THAT'S NOT ALL, FOLKS! HERE COMES THE OREO COOKIE!`
    },
    {
        type: "text",
        text: `A giant black-and-white cookie, with the word "OREO" written on it, rolls towards the party. It has a mouth filled with sharp cookie crumbs and a creamy filling that it can shoot at the party.`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `AND LAST BUT NOT LEAST! THE TOMATO-LAVA SPRAYING PIZZA ROLL!`
    },
    {
        type: "text",
        text: `A massive pizza roll, menacingly drags itself towards the party. It has a mouth filled with lava-like tomato sauce that it can spray at the party. It looks like the sauce could burn anyone who gets hit by it.`
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `GO, MY MINIONS! DESTROY THEM!!`
    },
    {
        type: "text",
        text: `The monstrous food items swarm the party. The party prepares for combat, while Jerry cowers pathetically in the background.`
    },
    {
        type: "text",
        text: `The battle of the food department begins!`
    },
    {
        type: "combat",
        encounterId: "chapter2_food_department",
        onWin: 20,
        onLose: "retry"
    },
    {
        type: "text",
        text: "A triumphant victory! The party defeated the monstrous food items, but the war is far from over. The loudspeaker's voice echoes once again."
    },
    {
        type: "dialogue",
        speaker: "Loudspeaker",
        text: `HAHAHA! NOT BAD, NOT BAD AT ALL! BUT YOU'VE ONLY JUST BEGUN TO SCRATCH THE SURFACE OF MY POWER! IF YOU THINK THAT WAS TOUGH, WAIT UNTIL YOU SEE WHAT'S IN STORE FOR YOU IN THE NEXT DEPARTMENTS!`
    },
    {
        type: "text",
        text: `The loudspeaker falls silent, and the food department has gone quiet once again. The party takes a moment to catch their breath.`
    },
    {
        type: "dialogue",
        lines:[
            {
                speaker: "Leo",
                text: `Gods, that was intense!`
            },
            {
                speaker: "Rellynn",
                text: `Yeah. Maybe we should be more careful next time. Who knows what else the owner has in stores for us?` // pun definitely intended
            },
        ]
    },
    {
        type: "text",
        text: "Jerry comes out of hiding."
    },
    {
        type: "dialogue",
        lines: 
        [
            {
                speaker: "Jerry",
                text: "H-hey. I-i-is it over? G-g-great job, everyone..!"
            },
            {
                speaker: "Grog",
                text: "Shut up, Jerry! You did nothing to help us!"
            },
        ]
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