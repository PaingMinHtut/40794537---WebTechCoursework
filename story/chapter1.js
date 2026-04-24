import { gameState } from "../engine/state.js";

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
        text: `There's Grog Stonemason, a hulking, self-proclaimed "beefcake" of a half-orc barbarian. Grog never knew his parents. It was just him and his brother against the world, until one day, they were separated and never saw one another again. He wields a greataxe that is the size of an average gnome, and boy, he is not afraid to use it. It's a miracle the axe is still intact after an ungodly amount of violence Grog has committed with it.`
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
        speaker: "Guard 1",
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
                        speaker: "Guard 2",
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
                        speaker: "Guard 1",
                        text: `Oh. A bunch of nameless nobodies, eh?`
                    },
                    {
                        speaker: "Guard 2",
                        text: `I guess we'll call you... The Solos.` // A jab at that one scene from the Han Solo movie
                    }
                ];

            case "mightyNein":
                return [
                    {
                        speaker: "Guard 1",
                        text: `N-Nine? But there's only three of you.` // Not everyone understand German or "Zemnian", Caleb!
                    },
                    {
                        speaker: "Guard 2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            case "voxMachina":
                return [
                    {   
                        speaker: "Guard 1",
                        text: `Hey, isn't that the group that overthrew the Briarwoods and saved Whitestone? Are you sure you guys are the real deal?`
                    },
                    {
                        speaker: "Guard 2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];
            
            case "lotr":
                return [
                    {   
                        speaker: "Guard 1",
                        text: `Why didn't you guys take the eagles to Mordor?` // Yes, I am aware that flying to Mordor is not a good idea, but it just felt too perfect not to include.
                    },
                    {    
                        speaker: "Guard 2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            case "dungeonMeshi":
                return [
                    {   
                        speaker: "Guard 1",
                        text: `Ew... You're not a part of those weirdos that eat monsters, are you?`
                    },
                    {    
                        speaker: "Guard 2",
                        text: `Ugh. Whatever. The mayor probably has some sort of fetch quest for you. Just don't cause any trouble!`
                    }
                ];

            default:
                return [
                    {
                        speaker: "Guard 1",
                        text: `Oh, great. Yet another one of those high-and-mighty adventurers that won't surely cause trouble. We've got enough problems already.`
                    },
                    {
                        speaker: "Guard 2",
                        text: `But, I suppose we'd have to let you in anyway. The mayor surely has some fetch quest for you or something.`
                    }
                ];
            }
        }
    },
    {
        type: "text",
        text: `The guards step aside and let the party into Waltown.`
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
                speaker: "Reyllynn",
                text: `Are you two even listening to me? We have no money for a drink!`
            }
        ]
    },
    {
        type: "text",
        text: `Despite Rellynn's protests, the two man-children drag her along and head to the nearest tavern anyway. The interiors of the taven are dimly lit, the air thick with the smell of ale and sweat. It was also quite deserted, as there was no one else but the bartender behind the counter. The bartender looks up as they enter, and greets them with an innocent look on his face.`
    },

    // you are currently here (the rest of the story hasn't been written yet)
];