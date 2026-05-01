// Story data structure:
const storySteps = [
    {
        type: "text",
        text: `Once upon a time— or actually, 5 minutes ago, but that’s not as dramatic— a group of adventurers found themselves approaching the gates of a small town of Waltown.`
    },
    {
        type: "text",
        text: `Before we continue, let us introduce our heroes, shall we?`
    },
    {
        type: "text",
        text: `There's Grog Stonemason, a hulking, self-proclaimed "beefcake" of a half-orc barbarian. Grog never knew his parents. It was just him and his sister against the world, until one day, they were separated and never saw one another again. He wields a greataxe that is the size of an average gnome, and boy, he is not afraid to use it. It's a miracle the axe is still intact after an ungodly amount of violence Grog has committed with it.`
    },
    {
        type: "text",
        text: `And then there's Rellynn Orialis, the elf wizard. Rellynn was the black sheep of her family of powerful spellcasters, and ran away from home when she couldn't take it anymore. She's actually pretty good at evocation magic, but she's fragile like glass and cannot take a hit to save herself. She also happens to be a huge nerd; you'll often find her with her face buried in a book, or trying to figure out how to conjure a sandwich out of thin air.`
    },
    {
        type: "text",
        text: `And lastly, there's Leopold "Leo" Albrecht von Heimvald d'Aurum IV (jeez, what a name...), a human bard from an aristocratic family. Leo grew up with a loving family, stability, and even was an heir to the family wine business. He just thought adventuring was neat, and set out one day with nothing but a harp, a rapier, and a dream. He's got a bit of a reputation for being the physical embodiment of a "main character syndrome", but somehow always manages to charm his way out of trouble.`
    },
    {
        type: "text",
        text: `These three unlikely companions met each other after drunkenly getting into a bar fight at a tavern a few months ago. After escaping the angry mob of villagers together, they decided to stick together and see where the road takes them.`
    },
    {
        type: "text",
        text: `And here they were, standing at the gates of Waltown.\nThey hadn’t come seeking glory. They hadn’t come seeking destiny.\nThey had come seeking work. They were broke as hell.`
    },
    {
        type: "text",
        text: `As they approached the town gates, a pair of guards stepped forward and raised a hand. One of them takes out a notebook and starts questioning the party.`
    },
    {
        type: "dialogue",
        speaker: "guard_1",
        text: `Hold it right there! State your name and business in Waltown.`
    },
    {
        type: "text",
        text: `Leo cleared his throat, straightened his coat, and gestured dramatically toward the group.`
    },
    {
        type: "input",
        text: `What is your party's name?`
    },
    {
        type: "dialogue",
        lines: (state) => {
        switch (state.nameReaction) {
            case "noName":
                return [
                    {
                        speaker: "Leo",
                        text: `Um... Uh...`
                    },
                ];

            default:
                return [
                    {
                        speaker: "Leo",
                        text: (state) => `Fear not, humble guards, for your heroes are finally here! We are ${state.partyName}!`
                    },
                    {
                        speaker: "Rellynn",
                        text: `(whispers) This is so cringe...`
                    }
                ];
            }
        }
    },
    // Easter egg reactions based on party name
    {
    type: "dialogue",
    lines: (state) => {
        switch (state.nameReaction) {

            case "noName":
                return [
                    {
                        speaker: "guard_1",
                        text: `Oh. A bunch of nameless nobodies, eh?`
                    },
                    {
                        speaker: "guard_2",
                        text: `I guess we'll call you... The Solos.` // A jab at that one scene from the Han Solo movie
                    }
                ];

            case "mightyNein":
                return [
                    {
                        speaker: "guard_1",
                        text: `N-Nine? But there's only three of you.` // Not everyone understand German or "Zemnian", Caleb!
                    },
                    {
                        speaker: "guard_2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            case "voxMachina":
                return [
                    {   
                        speaker: "guard_1",
                        text: `Hey, isn't that the group that overthrew the Briarwoods and saved Whitestone? Are you sure you guys are the real deal?`
                    },
                    {
                        speaker: "guard_2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];
            
            case "lotr":
                return [
                    {   
                        speaker: "guard_1",
                        text: `Why didn't you guys take the eagles to Mordor?` // Yes, I am aware that flying to Mordor is not a good idea, but it just felt too perfect not to include.
                    },
                    {    
                        speaker: "guard_2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            case "dungeonMeshi":
                return [
                    {   
                        speaker: "guard_1",
                        text: `Ew... You're not a part of those weirdos that eat monsters, are you?`
                    },
                    {    
                        speaker: "guard_2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            default:
                return [
                    {
                        speaker: "guard_1",
                        text: `Oh, great. Yet another one of those high-and-mighty adventurers that won't surely cause trouble. We've got enough problems already.`
                    },
                    {
                        speaker: "guard_2",
                        text: `But, I suppose we'd have to let you in anyway. The mayor surely has some fetch quest for you or something.`
                    }
                ];
            }
        }
    },
    {
        type: "text",
        text: `The guards step aside and let the party into Waltown. The town is eerily quiet, with only a few townsfolk milling about. The buildings are old and run-down, and the streets are empty. The party can't help but feel a sense of unease as they step into the town.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `Man, those guards were really rude. I hate this town already.`
            },
            {
                speaker: "Rellynn",
                text: `I'm guessing we go straight to the mayor's place, right?`
            },
        ]
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `No, I'm thirsty. I want a drink.`
            },
            {
                speaker: "Rellynn",
                text: `Look, Grog. I get it. Some drinks sound good right now, but we literally don't have any money. We need to find work first.`
            },
            {
                speaker: "Leo",
                text: `Yeah, Grog. Let's go to the tavern first.`
            },
            {
                speaker: "Rellynn",
                text: `Are you two even listening to me? We have no money for a drink!`
            }
        ]
    },
    {
        type: "text",
        text: `Despite Rellynn's protests, the two man-children drag her along and head to the nearest tavern anyway. The interiors of the taven are dimly lit, the air thick with the smell of ale. It was also quite deserted, as there was no one else but a meek-looking tavern keeper behind the counter. The tavern keeper looks up as they enter, and greets them with an awkward, nervous look on his face.`
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `O-oh, h-hello there, travelers! I am Jerry, the mayor of Waltown.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Rellynn",
                text: `Wait. You're the mayor? Why are you bussing tables then?`
            },
            {
                speaker: "jerry",
                text: `O-oh, well, Waltown has a very small population. Y-you might have noticed that there aren't many people around. But it wasn't always this way...`
            }
        ]
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `Yeah, we noticed. What happened to the town?`
            },
            {
                speaker: "jerry",
                text: `W-well, Waltown used to be a bustling town, with a thriving economy and a large population, t-thanks to the strange, otherworldly store that appeared out of nowhere. T-the owner of that store called it... Walmart.`
            },
            {
                speaker: "jerry",
                text: `B-but it became so popular. We could get high-quality goods from all over the world, even ones that we have never seen before. That led to our economy booming, and our population growing rapidly. W-we even named our town after the store.`
        
            },
        ]
    },
    {
        type: "choice",
        text: "Grog is really thirsty, and can't stop thinking about how good some orange juice would taste right now. What will you do?",
        options: [
            {
                label: "Ask for some orange juice",
                log: "The party rudely interrupted jerry and asked for some orange juice.",
                nextStep: 21, // starts from the next dialogue step where jerry goes to get the orange juice
                effect: (state) => {
                    state.flags.askedForOJ = true;
                }
            },
            {
                label: "Continue listening",
                log: "The party continued lisetening to jerry's story.",
                nextStep: 24 // starts from the next dialogue step where jerry continues his story without interruption
            }
        ]
    },

    // orange juice interruption starts here
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `Can we get some orange juice or something? I'm parched.`
            },
            {
                speaker: "jerry",
                text: `O-oh, u-um, s-sure. I have some in the back. I-I'll go get it for you.`
            }
        ]
    },
    {
        type: "text",
        text: `jerry awkwardly stumbles into the back of the tavern. A few minutes later, he returns with a pitcher of orange juice. He pours the orange juice into three mugs and serves them to the party.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `Heh! Now that's more like it!`   
            },
            {
                speaker: "Rellynn",
                text: `Really, Grog?`
            },
        ]
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: (state) => {
            if (state.flags.askedForOJ) {
                return `S-so, as I was saying before, the problem was that... monsters started appearing around the town. All of them looked like the goods from Walmart. This drove everyone away, and there are only a few of us left.`;
            } else {
                return `W-well, t-t-the problem was that... monsters started appearing around the town. All of them looked like the goods from Walmart. This drove everyone away, and there are only a few of us left.`;
            }
        },
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `Why don't you guys just fight back?`
            },
            {
                speaker: "Rellynn",
                text: `(bumps Grog with her elbow while whispering) Grog!`
            }
        ]
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "jerry",
                text: `W-well, we tried that. But the monsters were too strong. They were like nothing we've ever seen before. We couldn't hurt them with our weapons, and they could easily tear us apart.`
            },
            {
                speaker: "jerry",
                text: `A-and we can't fight them now! There are only two guards left in this town. W-we are just a bunch of defenseless villagers now! Oh, please, adventurers, you must help us!`
            }
        ]
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Leo",
                text: `Don't worry, jerry. We'll take care of those monsters for you.`
            },
            {
                speaker: "jerry",
                text: `Oh, thank you so much! Please, go to the store and take care of-`
            },
            {
                speaker: "Leo",
                text: `For a price, of course.`
            }
        ]
    },
    {
        type: "text",
        text: `jerry hesitates mid-sentence, and looks at Leo for a moment, then nods reluctantly.`
    },
    {
        type: "dialogue",
        speaker: "jerry",
        text: `O-okay. I-I'll pay you 100 gold coins if you can take care of the monsters. A-and, I'm coming with you.`
    },
    {
        type: "dialogue",
        lines: [
            {
                speaker: "Grog",
                text: `Why does he have to come with us?`
            },
            {
                speaker: "Rellynn",
                text: `So he can show us the way, Grog. Urgh!`
            },
            {
                speaker: "Leo",
                text: `Yep. The more the merrier, right?`
            },
            {
                speaker: "Grog",
                text: `But this guy's so lame! Ugh, fine... But if something happens to us, I'm blaming him!`
            },
        ]
    },
    {
        type: "dialogue",
        speaker: "Leo",
        text: `Alas! Time for another adventure!`
    },
    {
        type: "text",
        text: `The party, along with jerry, head to the Walmart store on the outskirts of town. As they approach the store, the party sees that it's unlike anything they've ever seen before. It's a massive, multi-story building that seems to stretch on forever.`
    },
    {
        type: "text",
        text: `The walls are too smooth—unnaturally so—like polished stone without a single crack or seam. The surface gleams faintly, reflecting light in a way that feels… wrong. No torchlight flickers against it, yet everything is clearly visible.`
    },
    {
        type: "text",
        text: `Above the entrance, glowing symbols hang in the air, bright as magefire but steady, cold, and without warmth. The doors themselves slide open on their own as the party nears, parting with a soft hiss like a creature breathing.`
    },
    {
        type: "nextChapter",
        text: "The party steps into Walmart...",
        nextChapter: 2,
        buttonText: "Enter Walmart"
    }
];

export const chapter1 = storySteps;