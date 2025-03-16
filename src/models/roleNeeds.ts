import { Need } from './npc';

type RoleNeeds = {
  [key: string]: Array<{
    type: string;
    subject: string;
    basePriority: number;
    randomRange: number;
    potentialGoldReward: number;
  }>;
};

export const roleSpecificNeeds: RoleNeeds = {
  Merchant: [
    { type: 'bring', subject: 'silk', basePriority: 7, randomRange: 3, potentialGoldReward: 50 },
    { type: 'bring', subject: 'spices', basePriority: 8, randomRange: 2, potentialGoldReward: 40 },
    { type: 'bring', subject: 'wine', basePriority: 7, randomRange: 3, potentialGoldReward: 35 },
    { type: 'bring', subject: 'incense', basePriority: 8, randomRange: 2, potentialGoldReward: 45 }
  ],
  Alchemist: [
    { type: 'bring', subject: 'mushroom', basePriority: 8, randomRange: 2, potentialGoldReward: 25 },
    { type: 'bring', subject: 'health potion', basePriority: 7, randomRange: 3, potentialGoldReward: 60 },
    { type: 'bring', subject: 'mana potion', basePriority: 8, randomRange: 2, potentialGoldReward: 65 },
    { type: 'bring', subject: 'antidote', basePriority: 7, randomRange: 3, potentialGoldReward: 45 }
  ],
  Guard: [
    { type: 'bring', subject: 'letter', basePriority: 7, randomRange: 3, potentialGoldReward: 20 },
    { type: 'bring', subject: 'plate armor', basePriority: 8, randomRange: 2, potentialGoldReward: 100 },
    { type: 'bring', subject: 'chain mail', basePriority: 7, randomRange: 3, potentialGoldReward: 80 },
    { type: 'bring', subject: 'stamina potion', basePriority: 8, randomRange: 2, potentialGoldReward: 40 }
  ],
  Baker: [
    { type: 'bring', subject: 'flour', basePriority: 8, randomRange: 2, potentialGoldReward: 15 },
    { type: 'bring', subject: 'wood', basePriority: 7, randomRange: 3, potentialGoldReward: 20 },
    { type: 'bring', subject: 'spices', basePriority: 8, randomRange: 2, potentialGoldReward: 40 }
  ],
  Blacksmith: [
    { type: 'bring', subject: 'iron', basePriority: 8, randomRange: 2, potentialGoldReward: 45 },
    { type: 'bring', subject: 'silver ore', basePriority: 7, randomRange: 3, potentialGoldReward: 70 },
    { type: 'bring', subject: 'gold ore', basePriority: 8, randomRange: 2, potentialGoldReward: 100 },
    { type: 'bring', subject: 'leather', basePriority: 7, randomRange: 3, potentialGoldReward: 25 }
  ],
  Fisherman: [
    { type: 'bring', subject: 'worm', basePriority: 8, randomRange: 2, potentialGoldReward: 5 },
    { type: 'bring', subject: 'fishing rod', basePriority: 7, randomRange: 3, potentialGoldReward: 30 },
    { type: 'bring', subject: 'leather', basePriority: 8, randomRange: 2, potentialGoldReward: 25 }
  ],
  Hunter: [
    { type: 'bring', subject: 'pelt', basePriority: 8, randomRange: 2, potentialGoldReward: 35 },
    { type: 'bring', subject: 'bow', basePriority: 7, randomRange: 3, potentialGoldReward: 50 },
    { type: 'bring', subject: 'arrow', basePriority: 8, randomRange: 2, potentialGoldReward: 15 },
    { type: 'bring', subject: 'leather', basePriority: 7, randomRange: 3, potentialGoldReward: 25 }
  ],
  Farmer: [
    { type: 'bring', subject: 'seed', basePriority: 8, randomRange: 2, potentialGoldReward: 10 },
    { type: 'bring', subject: 'wood', basePriority: 7, randomRange: 3, potentialGoldReward: 20 },
    { type: 'bring', subject: 'herbalist kit', basePriority: 8, randomRange: 2, potentialGoldReward: 45 }
  ],
  Tailor: [
    { type: 'bring', subject: 'cloth', basePriority: 8, randomRange: 2, potentialGoldReward: 20 },
    { type: 'bring', subject: 'silk', basePriority: 7, randomRange: 3, potentialGoldReward: 50 },
    { type: 'bring', subject: 'leather', basePriority: 8, randomRange: 2, potentialGoldReward: 25 },
    { type: 'bring', subject: 'pelt', basePriority: 7, randomRange: 3, potentialGoldReward: 35 }
  ],
  Jeweler: [
    { type: 'bring', subject: 'gem', basePriority: 8, randomRange: 2, potentialGoldReward: 85 },
    { type: 'bring', subject: 'silver ore', basePriority: 7, randomRange: 3, potentialGoldReward: 70 },
    { type: 'bring', subject: 'gold ore', basePriority: 8, randomRange: 2, potentialGoldReward: 100 },
    { type: 'bring', subject: 'ring of strength', basePriority: 7, randomRange: 3, potentialGoldReward: 120 }
  ]
}; 