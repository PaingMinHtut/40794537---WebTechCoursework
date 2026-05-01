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
        speaker: "loudspeaker",
        text: `SO, JERRY! YOU'VE FINALLY DECIDED TO GROW A PAIR AND COME FACE ME, HUH? AND IT SEEMS YOU BROUGHT SOME FRIENDS WITH YOU THIS TIME! WELL, LET ME TELL YOU SOMETHING. NONE OF YOU ARE GONNA MAKE IT OUT OF HERE ALIVE!`
    },
    {
        type: "dialogue",
        lines: [
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
                speaker: "jerry",
                text: `T-that's the owner of this place... He's the one who's been causing all the trouble in town.`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `YEAH, THAT'S RIGHT! AND YOU ARE ALL GONNA DIE HERE! BUT FIRST, LET ME INTRODUCE SOME OF MY MINIONS TO YOU!`
    },
    {
        type: "text",
        text: `Suddenly, the aisles around the party start shaking violently...`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `FIRST UP, COCA COLA!`
    },
    {
        type: "text",
        text: `A massive red tin can, with the word "COCA COLA" emblazoned on it, bounces from the aisle, approaching the party. It has razor-sharp teeth and a menacing grin.`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `NEXT, DORITOS!`
    },
    {
        type: "text",
        text: `A massive foil bag, labelled "DORITOS", comes flying towards the party. It has a gaping mouth filled with sharp, triangular chips that it uses to attack.`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `AND THAT'S NOT ALL, FOLKS! HERE COMES THE OREO COOKIE!`
    },
    {
        type: "text",
        text: `A giant black-and-white cookie, with the word "OREO" written on it, rolls towards the party. It has a mouth filled with sharp cookie crumbs and a creamy filling that it can shoot at the party.`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `AND LAST BUT NOT LEAST! THE TOMATO-LAVA SPRAYING PIZZA ROLL!`
    },
    {
        type: "text",
        text: `A massive pizza roll, menacingly drags itself towards the party. It has a mouth filled with lava-like tomato sauce that it can spray at the party. It looks like the sauce could burn anyone who gets hit by it.`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `OH, WAIT! HOW COULD I FORGET? THERE'S ALSO MY MOST LOYAL SERVANT!`
    },
    {
        type: "text",
        text: `A half-orc woman steps into the scene with a tired, sleep-deprived look on her face. Grog immediately recognizes her.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `G-Greta..! Is that you..? You're with them?!`
            },
            {
                speaker: "Rellynn",
                text: `Grog. That's your sister?!`
            },
            {
                speaker: "Leo",
                text: `What an interesting turn of events.`
            },
        ]
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `GO, MY MINIONS! DESTROY THEM!!`
    },
    {
        type: "text",
        text: `A panicking Grog starts begging his long-lost sister not to fight them.`
    },
    {
        type: "dialogue",
        speaker: "Grog",
        text: `Greta, please! Don't let us fight you! You can still leave!`
    },
    {
        type: "text",
        text: `Greta does not respond. She approaches the party alongside the monstrous food items. Regardless, Grog could tell she is tired of working at this place, and is slightly reluctant to fight her long-lost brother.`
    },
    {
        type: "dice",
        text: `Grog could convince his sister to leave Walmart.`,
        rollText: `Persuasion Attempt`,

        success: {
            threshold: 6,
            nextStep: 23,
            log: `Grog successfully convinced his sister to leave Walmart.`,
            effect: (state) => {
                    state.flags.convincedGreta = true;
            },
        },

        fail: {
            nextStep: 23,
            log: `Greta remained unconvinced, but refused to fight her brother regardless.`
        },
    },

    // Convinced Greta to leave
    {
        type: "dialogue",
        speaker: "Grog",
        text: `It's not too late, Greta. Please leave this place! I don't want to fight you!`
    },
    {
        type: "text",
        text: (state) => {
            if (state.flags.convincedGreta) {
                return `Greta does not respond, but is fully convinced. She looks up at the loudspeaker on the ceiling with a fierce, determined look on her face. She yanks out her Walmart employee badge and throws it onto the floor. She turns around and heads towards the exit, acknowledging her brother on her way out. She whispered into his ears, promising to meet again somewhere, someday.`;
            } else {
                return `Greta does not respond, but stops at the last second. She could not dare to fight her brother, but she also couldn't let herself go. She retreats further into the Walmart, disappearing from view. Grog looks on in sadness as his sister could not even look at him in the face.`;
            }
        },
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `WELL, WELL, WELL. GRETA. YOU WERE THE EMPLOYEE OF THE MONTH AND YET, YOU DARE TO DISOBEY ME!? PFFT! NO MATTER! I STILL HAVE MY MONSTROUS MINIONS!`
    },
    {
        type: "text",
        text: `The monstrous food items swarm the party. The party prepares for combat, while jerry cowers pathetically in the background.`
    },
    {
        type: "text",
        text: `The battle of the food department begins!`
    },
    {
        type: "combat",
        encounterId: "chapter2_food_department",
        onWin: 29,
        onLose: "retry"
    },
    {
        type: "text",
        text: `A triumphant victory! The party defeated the monstrous food items, but the war is far from over. The loudspeaker's voice echoes once again.`
    },
    {
        type: "dialogue",
        speaker: "loudspeaker",
        text: `NOOOO! MY MINIONS! TCH! BRAVO, JERRY! I'LL BE WAITING FOR YOU IN THE NEXT DEPARTMENT WITH MY GREATEST CREATION! AND THEN, WE WILL KILL YOU AND YOUR FRIENDS!`
    },
    {
        type: "text",
        text: `The loudspeaker falls silent, and the food department has gone quiet once again. The party takes a moment to catch their breath.`
    },
    {
        type: "dialogue",
        lines: [
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
        text: `jerry comes out of hiding.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "jerry",
                text: `H-hey. I-i-is it over? G-g-great job, everyone..!`
            },
            {
                speaker: "Grog",
                text: `Shut up, jerry! You did nothing to help us!`
            },
        ]
    },
    {
        type: "text",
        text: `The party and jerry gather themselves and moves onward. They could tell there is something bad waiting for them in the next department.`
    },
    {
        type: "nextChapter",
        text: `The party sees a sign that says "Toys Department", and steps forward...`,
        nextChapter: 3,
        buttonText: "Enter Toys Department"
    }
];

export const chapter2 = storySteps;