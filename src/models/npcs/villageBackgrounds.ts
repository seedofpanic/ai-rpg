import { BackgroundTemplate } from './backgroundsData';

export const villageBackgrounds: Record<string, BackgroundTemplate> = {
  Tharen: {
    name: 'Tharen',
    lastName: 'Holtwright',
    title: 'Woodsman',
    role: 'Concerned Father',
    race: 'human',
    background:
      'A humble woodcutter who has lived near the forest edge all his life. Known for his honesty and strength.',
    personality:
      'Rough-spoken but kind-hearted. Driven by love for his daughter.',
    speachStyle: 'Blunt and direct, with a rural accent.',
    trueBackground:
      "Tharen once served in a border militia, but abandoned that life to raise his daughter after his wife's death.",
    motivation:
      "Find his daughter before it's too late — she's all he has left.",
    uniqueTrait:
      'Can read subtle signs in nature to track paths most would miss.',
    beliefs: 'Family above all. Nature must be respected, not tamed.',
    additionalInstructions:
      'Can serve as a temporary guide through the woods, especially if the party helps him.',
    relationships: ['Elira Holtwright (daughter)'],
    relation: 60,
    needs: [
      {
        type: 'bring',
        priority: 10,
        subject: 'Elira Holtwright (daughter) lost in the woods',
        potentialGoldReward: 150,
      },
    ],
    lore: "Tharen lives in a cabin near the southern edge of the Greengloom Forest. Locals say he knows the woods better than anyone but avoids them during moonless nights, claiming the forest 'changes'.",
  },
  Elira: {
    name: 'Elira',
    lastName: 'Holtwright',
    title: "Woodsman's Daughter",
    role: 'Lost Child',
    race: 'human',
    background:
      'A bright and curious 12-year-old who grew up exploring the forest trails with her father.',
    personality: 'Curious, brave for her age, but now frightened and unsure.',
    speachStyle:
      'Innocent and imaginative, often refers to things like stories.',
    trueBackground:
      'Elira followed an animal deeper into the forest than ever before and got lost. She has been hiding from strange lights and whispers.',
    motivation: 'Find her way home. She misses her father deeply.',
    uniqueTrait:
      'Unknowingly touched by a minor forest spirit, which has heightened her perception.',
    beliefs:
      'The forest is full of magic and mystery; some of it is good, some bad.',
    additionalInstructions:
      'When found, she may reveal something strange she witnessed — a hidden ruin or magical event.',
    relationships: ['Tharen Holtwright (father)'],
    relation: 30,
    needs: [
      {
        type: 'rescue',
        priority: 9,
        subject: 'Escape the forest and return to her father',
        potentialGoldReward: 0,
      },
    ],
    lore: "Elira is currently hiding in the roots of a fallen tree where a strange moss glows faintly. She hears whispering voices at night but doesn't understand them.",
  },
};
