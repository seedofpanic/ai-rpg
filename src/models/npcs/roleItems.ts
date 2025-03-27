type RoleItems = {
  [key: string]: {
    items: Array<{ name: string; quantity?: [number, number] }>;
  };
};

export const roleSpecificItems: RoleItems = {
  Merchant: {
    items: [
      { name: 'Silk', quantity: [1, 3] },
      { name: 'Cloth', quantity: [1, 3] },
      { name: 'Gem', quantity: [1, 1] },
      { name: 'Trade Ledger' },
      { name: 'Merchant Scale' },
      { name: 'Spices', quantity: [2, 5] },
      { name: 'Wine', quantity: [1, 3] },
      { name: 'Exotic Perfume', quantity: [1, 2] },
      { name: 'Dye', quantity: [2, 4] },
      { name: 'Incense', quantity: [2, 5] },
      { name: 'Gold Ore', quantity: [1, 2] },
    ],
  },
  Alchemist: {
    items: [
      { name: 'Health Potion', quantity: [2, 5] },
      { name: 'Mushroom', quantity: [1, 3] },
      { name: 'Alchemist Kit' },
      { name: 'Crystal Vial', quantity: [3, 6] },
      { name: 'Mortar and Pestle' },
      { name: 'Mana Potion', quantity: [1, 3] },
      { name: 'Stamina Potion', quantity: [1, 3] },
      { name: 'Antidote', quantity: [1, 2] },
      { name: 'Healing Salve', quantity: [2, 4] },
      { name: 'Herbalist Kit' },
    ],
  },
  Guard: {
    items: [],
  },
  Baker: {
    items: [
      { name: 'Flour', quantity: [3, 7] },
      { name: 'Yeast', quantity: [2, 5] },
      { name: 'Rolling Pin' },
      { name: 'Recipe Book' },
      { name: 'Baking Oven' },
    ],
  },
  Blacksmith: {
    items: [
      { name: 'Iron', quantity: [1, 3] },
      { name: 'Sword' },
      { name: 'Shield' },
      { name: 'Smithing Hammer' },
      { name: 'Steel Ingot', quantity: [1, 2] },
      { name: 'Anvil' },
      { name: 'Forge Tongs' },
      { name: 'Silver Ore', quantity: [1, 2] },
      { name: 'Leather', quantity: [2, 4] },
    ],
  },
  Fisherman: {
    items: [
      { name: 'Worm', quantity: [5, 14] },
      { name: 'Fishing Rod' },
      { name: 'Fishing Net' },
      { name: 'Fish Bait', quantity: [3, 8] },
      { name: 'Fish Basket' },
      { name: 'Fishing Boat' },
    ],
  },
  Hunter: {
    items: [
      { name: 'Bow' },
      { name: 'Arrow', quantity: [10, 29] },
      { name: 'Pelt', quantity: [1, 2] },
      { name: 'Hunting Trap' },
      { name: 'Animal Call' },
      { name: 'Skinning Knife' },
      { name: 'Camouflage Cloak' },
      { name: 'Leather', quantity: [1, 3] },
      { name: 'Dagger' },
    ],
  },
  Farmer: {
    items: [
      { name: 'Seed', quantity: [5, 14] },
      { name: 'Hoe' },
      { name: 'Fertilizer', quantity: [2, 5] },
      { name: 'Watering Can' },
      { name: 'Scarecrow' },
      { name: 'Wood', quantity: [2, 5] },
    ],
  },
  Tailor: {
    items: [
      { name: 'Cloth', quantity: [2, 5] },
      { name: 'Silk', quantity: [1, 2] },
      { name: 'Needle Set' },
      { name: 'Pattern Book' },
      { name: 'Measuring Tape' },
      { name: 'Sewing Machine' },
      { name: 'Dye', quantity: [1, 3] },
      { name: 'Leather', quantity: [1, 3] },
    ],
  },
  Jeweler: {
    items: [
      { name: 'Gem', quantity: [1, 2] },
      { name: 'Ring of Strength' },
      { name: 'Jeweler Tools' },
      { name: 'Gemcutter Kit' },
      { name: 'Magnifying Glass' },
      { name: 'Gold Scales' },
      { name: 'Ring of Protection' },
      { name: 'Gold Ore', quantity: [1, 2] },
      { name: 'Silver Ore', quantity: [1, 2] },
    ],
  },
  Mage: {
    items: [
      { name: 'Magic Wand' },
      { name: 'Mana Potion', quantity: [2, 4] },
      { name: 'Scroll of Fireball', quantity: [1, 3] },
      { name: 'Crystal Vial', quantity: [1, 3] },
      { name: 'Ring of Protection' },
      { name: 'Amulet of Health' },
    ],
  },
  Healer: {
    items: [
      { name: 'Health Potion', quantity: [3, 6] },
      { name: 'Healing Salve', quantity: [2, 5] },
      { name: 'Herbalist Kit' },
      { name: 'Antidote', quantity: [2, 4] },
      { name: 'Crystal Vial', quantity: [2, 4] },
      { name: 'Amulet of Health' },
    ],
  },
  Adventurer: {
    items: [
      { name: 'Sword' },
      { name: 'Leather Armor' },
      { name: 'Health Potion', quantity: [1, 3] },
      { name: 'Torch', quantity: [1, 2] },
      { name: 'Dagger' },
      { name: 'Boots' },
    ],
  },
};
