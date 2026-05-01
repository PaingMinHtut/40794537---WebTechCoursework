const storySteps = [
    {
        type: "text",
        text: `The party steps into the Toys Department.`
    },
    {
        type: "text",
        text: `The shelves are filled with strange, colorful objects—small figures frozen in place, wheeled contraptions, and soft creatures with stitched smiles. Everything feels… wrong. Like a mockery of life.`
    },
    {
        type: "text",
        text: `A low mechanical hum fills the air. The lights flicker slightly.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `So... you actually made it this far.`
    },
    {
        type: "text",
        text: `At the far end of the department, a man stands atop a raised platform. He holds a glowing staff, its light pulsing faintly.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `Welcome to my store. My empire.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `You're the one behind all this?`
            },
            {
                speaker: "doug",
                text: `Of course I am. I built this place. Expanded it. Perfected it.`
            },
            {
                speaker: "Rellynn",
                text: `This isn't natural.`
            },
            {
                speaker: "doug",
                text: `Natural? Oh, I abandoned that idea a long time ago.`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `I came from a time far beyond yours. A world ruled by profit. I simply... brought it here sooner.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `And then I found this.`
    },
    {
        type: "text",
        text: `doug raises the staff. Its glow intensifies. The toys around the room tremble slightly.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `With this, I gave everything purpose. Life. Loyalty.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `And now... you get to witness my greatest creation.`
    },
    {
        type: "text",
        text: `The ground shakes violently. Shelves collapse as something massive begins to emerge from the shadows.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `BEHOLD!`
    },
    {
        type: "text",
        text: `A massive toy dragon rises before the party. Its body is made of colorful plastic plates, its eyes glowing with artificial light. Its wings creak as they unfold, and its mouth opens with a hollow, echoing roar.`
    },
    {
        type: "text",
        text: `The final battle begins!`
    },
    {
        type: "combat",
        encounterId: "chapter3_final_boss",
        onWin: 18,
        onLose: "retry"
    },

    // AFTER BOSS
    {
        type: "text",
        text: `The dragon collapses into a heap of lifeless parts. Silence fills the Toys Department.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `...Impossible.`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `Do you have any idea what you've done? This was perfection!`
    },
    {
        type: "dialogue",
        speaker: "doug",
        text: `No matter. I can rebuild. I always rebuild—`
    },
    {
        type: "text",
        text: `Suddenly, Jerry rushes forward.`
    },
    {
        type: "text",
        text: `With a surprising burst of speed, he takes out a dagger from his pocket, and stabs Doug in the chest.`
    },
    {
        type: "text",
        text: `Doug collapses, gargling as he takes his last breath. The glowing staff slips from his hand, clattering onto the floor.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Rellynn",
                text: `(gasps loudly)`
            },
            {
                speaker: "Leo",
                text: `Oh, damn...!`
            },
            {
                speaker: "Grog",
                text: `Woah! Oh my god, Jerry! I didn't know you were actually pretty cool!`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `heh heh heh...`
    },
    {
        type: "dialogue",
        speaker: "Grog",
        text: `Um... Jerry...?`
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `M'WAHAHAHAHA!! FINALLY! This staff, such magnificent power... IT'S FINALLY MINE!!`
    },
    {
        type: "text",
        text: `Jerry reaches for the staff, his hands trembling, as he finally reveals his true colors.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Rellynn",
                text: `Jerry... don't. You don't know what you're messing with.`
            },
            {
                speaker: "Leo",
                text: `Somehow, I could tell this was coming.`
            },
            {
                speaker: "Grog",
                text: `I take back the compliment, Jerry. You're the worst!`
            }
        ]
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `I've been pushed around my whole life... I deserve this! With this power, I can make everyone not fear me again!!`
    },

    // DICE: INTIMIDATE JERRY
    {
        type: "dice",
        text: `Grog could intimidate Jerry into backing down.`,
        rollText: `Intimidation Attempt`,

        success: {
            threshold: 5,
            nextStep:  33, // will resolve below manually (engine uses number)
            log: `Grog intimidated Jerry into giving up the staff.`,
            effect: (state) => {
                state.flags.intimidatedJerry = true;
            }
        },

        fail: {
            nextStep: 32,
            log: `Jerry refuses to back down and prepares to fight.`
        }
    },

    // Roll somehow fails, must fight Jerry
    {
        type: "combat",
        encounterId: "chapter3_jerry",
        onWin:  32,
        onLose: "retry"
    },

    // After intimidation, or fight Jerry
    {
        type: "text",
        text: `Jerry drops the staff, unable to keep up his resolve.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "jerry",
                text: `N-n-no...! I-I didn't mean it... please don't hurt me...`
            },
            {
                speaker: "Grog",
                text: `Yeah, not so tough now, are you? Chump!`
            },
        ]
    },
    {
        type: "text",
        text: `Rellynn steps forward and picks up the staff.`
    },
    {
        type: "text",
        text: `The moment she touches it, the entire Walmart begins to tremble violently. The staff seems to recognize its previous owner was not longer alive, and intends to destroy the whole building.`
    },
    {
        type: "dialogue",
        speaker: "Leo",
        text: `That's... probably not a good sign.`
    },
    {
        type: "text",
        text: `The walls crack. The ceiling begins to collapse. The strange lights flicker and die.`
    },
    {
        type: "dialogue",
        speaker: "Leo",
        text: `HOTFOOT IT OUT OF HERE, GUYS!!`
    },
    {
        type: "text",
        text: `The party turns and runs, avoiding the crumbling debris, through the Toys Department, and the Food Department. The exit is getting closer, but everything is crumbling down.`
    },
    {
        type: "text",
        text: `Behind them, Jerry stumbles and falls as debris crashes down around him.`
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `N-no-!`
    },
    {
        type: "text",
        text: `He is buried under the collapsing structure.`
    },
    {
        type: "text",
        text: `The party narrowly escapes as the entire Walmart caves in behind them.`
    },
    {
        type: "text",
        text: `Silence returns to the land, as the party catches their breath.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `Phew-! That was so fun!`
            },
            {
                speaker: "Rellynn",
                text: `No, you idiot! We almost died! We barely made it back out alive!`
            },
        ]
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `Jerry is not with us.`
            },
            {
                speaker: "Grog",
                text: `I saw him getting crushed by the debris. I kinda feel bad for him to be honest. Sure, I hated how pathetic he was, and he tried to betray us, but he didn't deserve death.`
            },
        ]
    },
    {
        type: "nextChapter",
        text: `Grog takes a moment to mourn jerry. Afterwards, the party starts making it back to the town square.`,
        nextChapter: 4,
        buttonText: "Continue forward to the Town Square"
    }
];

export const chapter3 = storySteps;