import { v4 as uuidv4 } from 'uuid';
interface ItemStats {
  attackPower?: number;
  defense?: number;
  criticalChance?: number;
  dodgeChance?: number;
  health?: number;
}

export interface Equipment {
  head?: string;
  chest?: string;
  legs?: string;
  feet?: string;
  weapon?: string;
  shield?: string;
  ring?: string;
  amulet?: string;
}

export interface Effect {
  type: 'heal' | 'buff' | 'debuff' | 'damage';
  value: number;
  duration?: number; // in milliseconds
}

export interface ItemData {
  name: string;
  description: string;
  price: number;
  equippableSlot?: keyof Equipment;
  stats?: ItemStats;
  isUsable?: 'single' | 'multiple';
  effect?: Effect;
}

export const itemsData = new Map<string, ItemData>();
const uuid = uuidv4();
itemsData.set(uuid, {
  name: 'Sword',
  description: 'A sharp sword for battle.',
  price: 100,
  equippableSlot: 'weapon',
  stats: {
    attackPower: 10,
  },
});

itemsData.set(uuidv4(), {
  name: 'Shield',
  description: 'A sturdy shield for protection.',
  price: 150,
  equippableSlot: 'shield',
  stats: {
    defense: 8,
  },
});

itemsData.set(uuidv4(), {
  name: 'Health Potion',
  description: 'A potion that restores health.',
  price: 50,
  isUsable: 'single',
  effect: {
    type: 'heal',
    value: 50,
  },
});

itemsData.set(uuidv4(), {
  name: 'Magic Wand',
  description: 'A wand imbued with magical powers.',
  price: 200,
  equippableSlot: 'weapon',
  stats: {
    attackPower: 8,
    criticalChance: 0.05,
  },
});

itemsData.set(uuidv4(), {
  name: 'Helmet',
  description: 'A helmet to protect your head.',
  price: 75,
  equippableSlot: 'head',
  stats: {
    defense: 5,
  },
});

itemsData.set(uuidv4(), {
  name: 'Boots',
  description: 'Boots to increase your speed.',
  price: 80,
  equippableSlot: 'feet',
  stats: {
    defense: 3,
    dodgeChance: 0.02,
  },
});

itemsData.set(uuidv4(), {
  name: 'Ring of Strength',
  description: 'A ring that increases your strength.',
  price: 250,
  equippableSlot: 'ring',
  stats: {
    attackPower: 5,
    criticalChance: 0.03,
  },
});

itemsData.set(uuidv4(), {
  name: 'Cloak of Invisibility',
  description: 'A cloak that makes you invisible.',
  price: 300,
  equippableSlot: 'chest',
  stats: {
    defense: 3,
    dodgeChance: 0.1,
  },
});

itemsData.set(uuidv4(), {
  name: 'Silk',
  description: 'Fine, smooth fabric prized by merchants.',
  price: 180,
});

itemsData.set(uuidv4(), {
  name: 'Mushroom',
  description: 'A rare mushroom used in alchemy.',
  price: 45,
});

itemsData.set(uuidv4(), {
  name: 'Letter',
  description: 'An important document that needs delivery.',
  price: 30,
});

itemsData.set(uuidv4(), {
  name: 'Flour',
  description: 'High-quality baking flour.',
  price: 25,
});

itemsData.set(uuidv4(), {
  name: 'Iron',
  description: 'Raw iron ore for blacksmithing.',
  price: 120,
});

itemsData.set(uuidv4(), {
  name: 'Worm',
  description: 'Fresh bait for fishing.',
  price: 5,
});

itemsData.set(uuidv4(), {
  name: 'Pelt',
  description: 'A well-preserved animal hide.',
  price: 90,
});

itemsData.set(uuidv4(), {
  name: 'Seed',
  description: 'Quality seeds for farming.',
  price: 15,
});

itemsData.set(uuidv4(), {
  name: 'Cloth',
  description: 'Sturdy fabric for tailoring.',
  price: 60,
});

itemsData.set(uuidv4(), {
  name: 'Gem',
  description: 'A precious stone for jewelry making.',
  price: 350,
});

itemsData.set(uuidv4(), {
  name: 'Leather',
  description: 'Tanned animal hide used for armor crafting.',
  price: 45,
});

itemsData.set(uuidv4(), {
  name: 'Wood',
  description: 'Quality lumber for crafting.',
  price: 30,
});

itemsData.set(uuidv4(), {
  name: 'Silver Ore',
  description: 'Raw silver for crafting jewelry and weapons.',
  price: 200,
});

itemsData.set(uuidv4(), {
  name: 'Gold Ore',
  description: 'Raw gold for crafting precious items.',
  price: 400,
});

itemsData.set(uuidv4(), {
  name: 'Dagger',
  description: 'A quick, light weapon for close combat.',
  price: 75,
  equippableSlot: 'weapon',
  stats: {
    attackPower: 6,
    criticalChance: 0.08,
  },
});

itemsData.set(uuidv4(), {
  name: 'Spear',
  description: 'A versatile weapon with good reach.',
  price: 130,
  equippableSlot: 'weapon',
  stats: {
    attackPower: 8,
    defense: 2,
  },
});

itemsData.set(uuidv4(), {
  name: 'Leather Armor',
  description: 'Light armor offering basic protection.',
  price: 120,
  equippableSlot: 'chest',
  stats: {
    defense: 5,
    health: 5,
  },
});

itemsData.set(uuidv4(), {
  name: 'Plate Armor',
  description: 'Heavy armor offering excellent protection.',
  price: 500,
  equippableSlot: 'chest',
  stats: {
    defense: 15,
    health: 20,
  },
});

itemsData.set(uuidv4(), {
  name: 'Mana Potion',
  description: 'Restores magical energy.',
  price: 60,
  isUsable: 'single',
});

itemsData.set(uuidv4(), {
  name: 'Stamina Potion',
  description: 'Restores physical energy.',
  price: 55,
  isUsable: 'single',
});

itemsData.set(uuidv4(), {
  name: 'Scroll of Lightning',
  description: 'A scroll containing the Lightning spell.',
  price: 120,
  isUsable: 'single',
});

itemsData.set(uuidv4(), {
  name: 'Scroll of Healing',
  description: 'A scroll containing the Healing spell.',
  price: 80,
  isUsable: 'single',
  effect: {
    type: 'heal',
    value: 20,
    duration: 5000,
  },
});

itemsData.set(uuidv4(), {
  name: 'Healing Salve',
  description: 'A salve that restores health over time.',
  price: 45,
  isUsable: 'single',
  effect: {
    type: 'heal',
    value: 30,
    duration: 5000,
  },
});

itemsData.set(uuidv4(), {
  name: 'Crystal Vial',
  description: 'A vial used for storing magical substances.',
  price: 30,
});

itemsData.set(uuidv4(), {
  name: 'Amulet of Health',
  description: 'An amulet that increases health.',
  price: 250,
  equippableSlot: 'amulet',
  stats: {
    health: 10,
  },
});

itemsData.set(uuidv4(), {
  name: 'Chain Mail',
  description: 'Medium armor made of interlocking metal rings.',
  price: 250,
  equippableSlot: 'chest',
  stats: {
    defense: 10,
    health: 10,
  },
});

itemsData.set(uuidv4(), {
  name: 'Antidote',
  description: 'Cures poison effects.',
  price: 20,
});

itemsData.set(uuidv4(), {
  name: 'Ring of Protection',
  description: 'Enhances defensive capabilities.',
  price: 280,
  equippableSlot: 'ring',
  stats: {
    defense: 5,
  },
});

// Trade Goods
itemsData.set(uuidv4(), {
  name: 'Spices',
  description: 'Exotic spices valued by merchants.',
  price: 85,
});

itemsData.set(uuidv4(), {
  name: 'Wine',
  description: 'Fine aged wine from distant vineyards.',
  price: 95,
});

itemsData.set(uuidv4(), {
  name: 'Incense',
  description: 'Aromatic incense from foreign lands.',
  price: 65,
});

// Tools
itemsData.set(uuidv4(), {
  name: 'Fishing Rod',
  description: 'A sturdy rod for catching fish.',
  price: 70,
});

itemsData.set(uuidv4(), {
  name: 'Mining Pick',
  description: 'Essential tool for mining ore.',
  price: 85,
});

itemsData.set(uuidv4(), {
  name: 'Herbalist Kit',
  description: 'Tools for gathering and processing herbs.',
  price: 90,
});

// Merchant-specific Items
itemsData.set(uuidv4(), {
  name: 'Exotic Perfume',
  description: 'A rare fragrance from distant lands.',
  price: 220,
});

itemsData.set(uuidv4(), {
  name: 'Dye',
  description: 'High-quality fabric dye in various colors.',
  price: 95,
});

itemsData.set(uuidv4(), {
  name: 'Alchemist Kit',
  description: 'A complete set of alchemy tools.',
  price: 180,
});

itemsData.set(uuidv4(), {
  name: 'Torch',
  description: 'Standard guard patrol equipment.',
  price: 15,
});

// Baker-specific Items
itemsData.set(uuidv4(), {
  name: 'Yeast',
  description: 'Fresh baking yeast.',
  price: 20,
});

itemsData.set(uuidv4(), {
  name: 'Rolling Pin',
  description: 'Essential tool for any baker.',
  price: 35,
});

// Blacksmith-specific Items
itemsData.set(uuidv4(), {
  name: 'Smithing Hammer',
  description: 'Heavy hammer for metalworking.',
  price: 95,
});

itemsData.set(uuidv4(), {
  name: 'Steel Ingot',
  description: 'Refined steel ready for forging.',
  price: 150,
});

// Fisherman-specific Items
itemsData.set(uuidv4(), {
  name: 'Fishing Net',
  description: 'Large net for catching multiple fish.',
  price: 85,
});

itemsData.set(uuidv4(), {
  name: 'Fish Bait',
  description: 'Premium bait for catching fish.',
  price: 25,
});

// Hunter-specific Items
itemsData.set(uuidv4(), {
  name: 'Hunting Trap',
  description: 'Metal trap for catching game.',
  price: 110,
});

itemsData.set(uuidv4(), {
  name: 'Animal Call',
  description: 'Device for mimicking animal sounds.',
  price: 45,
});

// Farmer-specific Items
itemsData.set(uuidv4(), {
  name: 'Hoe',
  description: 'Farming tool for tilling soil.',
  price: 40,
});

itemsData.set(uuidv4(), {
  name: 'Fertilizer',
  description: 'Nutrient-rich soil supplement.',
  price: 30,
});

// Tailor-specific Items
itemsData.set(uuidv4(), {
  name: 'Needle Set',
  description: 'Fine sewing needles of various sizes.',
  price: 55,
});

itemsData.set(uuidv4(), {
  name: 'Pattern Book',
  description: 'Collection of clothing patterns.',
  price: 120,
});

// Jeweler-specific Items
itemsData.set(uuidv4(), {
  name: 'Jeweler Tools',
  description: 'Precision tools for jewelry crafting.',
  price: 200,
});

itemsData.set(uuidv4(), {
  name: 'Gemcutter Kit',
  description: 'Tools for cutting and polishing gems.',
  price: 250,
});

// Additional Merchant-specific Items
itemsData.set(uuidv4(), {
  name: 'Trade Ledger',
  description: 'A detailed book for tracking transactions.',
  price: 75,
});

itemsData.set(uuidv4(), {
  name: 'Merchant Scale',
  description: 'Precise scales for weighing goods.',
  price: 150,
});

itemsData.set(uuidv4(), {
  name: 'Mortar and Pestle',
  description: 'Essential tools for grinding ingredients.',
  price: 95,
});

// Additional Guard-specific Items
itemsData.set(uuidv4(), {
  name: 'Guard Whistle',
  description: 'Used to signal other guards.',
  price: 35,
});

itemsData.set(uuidv4(), {
  name: 'Chain Cuffs',
  description: 'Standard restraints used by guards.',
  price: 65,
});

// Additional Baker-specific Items
itemsData.set(uuidv4(), {
  name: 'Baking Oven',
  description: 'A professional-grade baking oven.',
  price: 450,
});

itemsData.set(uuidv4(), {
  name: 'Recipe Book',
  description: 'Collection of secret family recipes.',
  price: 120,
});

// Additional Blacksmith-specific Items
itemsData.set(uuidv4(), {
  name: 'Anvil',
  description: 'Heavy-duty anvil for metalworking.',
  price: 350,
});

itemsData.set(uuidv4(), {
  name: 'Forge Tongs',
  description: 'Long tongs for handling hot metal.',
  price: 85,
});

// Additional Fisherman-specific Items
itemsData.set(uuidv4(), {
  name: 'Fishing Boat',
  description: 'Small boat for fishing in deeper waters.',
  price: 500,
});

itemsData.set(uuidv4(), {
  name: 'Fish Basket',
  description: 'Woven basket for storing caught fish.',
  price: 45,
});

// Additional Hunter-specific Items
itemsData.set(uuidv4(), {
  name: 'Skinning Knife',
  description: 'Sharp knife for preparing animal hides.',
  price: 65,
});

itemsData.set(uuidv4(), {
  name: 'Camouflage Cloak',
  description: 'Helps blend into natural surroundings.',
  price: 150,
  equippableSlot: 'chest',
  stats: {
    defense: 2,
    dodgeChance: 0.05,
  },
});

// Additional Farmer-specific Items
itemsData.set(uuidv4(), {
  name: 'Watering Can',
  description: 'Large can for watering crops.',
  price: 55,
});

itemsData.set(uuidv4(), {
  name: 'Scarecrow',
  description: 'Protects crops from birds.',
  price: 70,
});

// Additional Tailor-specific Items
itemsData.set(uuidv4(), {
  name: 'Measuring Tape',
  description: 'For taking precise measurements.',
  price: 25,
});

itemsData.set(uuidv4(), {
  name: 'Sewing Machine',
  description: 'Professional grade sewing machine.',
  price: 300,
});

// Additional Jeweler-specific Items
itemsData.set(uuidv4(), {
  name: 'Magnifying Glass',
  description: 'For inspecting gems and detailed work.',
  price: 85,
});

itemsData.set(uuidv4(), {
  name: 'Gold Scales',
  description: 'Precise scales for weighing precious metals.',
  price: 175,
});

// Mob Drop Items
itemsData.set(uuidv4(), {
  name: 'Wolf Pelt',
  description: 'A thick, warm pelt from a wolf.',
  price: 120,
});

itemsData.set(uuidv4(), {
  name: 'Wolf Fang',
  description: 'A sharp fang from a fierce wolf.',
  price: 85,
});

itemsData.set(uuidv4(), {
  name: 'Raw Meat',
  description: 'Fresh meat from a hunted animal.',
  price: 45,
});

itemsData.set(uuidv4(), {
  name: 'Stolen Goods',
  description: 'Various items of questionable origin.',
  price: 75,
});

itemsData.set(uuidv4(), {
  name: 'Rotten Flesh',
  description: 'Decaying flesh from a zombie.',
  price: 15,
});

itemsData.set(uuidv4(), {
  name: 'Tattered Cloth',
  description: 'Worn and torn pieces of cloth.',
  price: 25,
});

itemsData.set(uuidv4(), {
  name: 'Bone',
  description: 'A sturdy bone that could be crafted into tools.',
  price: 35,
});

itemsData.set(uuidv4(), {
  name: 'Ancient Coin',
  description: 'A mysterious coin from a forgotten era.',
  price: 150,
});

itemsData.set(uuidv4(), {
  name: 'Arrow',
  description: 'A sharp arrow for ranged combat.',
  price: 1,
});

itemsData.set(uuidv4(), {
  name: 'Bow',
  description: 'A well-crafted bow for hunting and combat.',
  price: 150,
  equippableSlot: 'weapon',
  stats: {
    attackPower: 12,
    criticalChance: 0.06,
  },
});

// Add new consumable items
itemsData.set(uuidv4(), {
  name: 'Greater Health Potion',
  description: 'A powerful potion that restores a large amount of health.',
  price: 100,
  isUsable: 'single',
  effect: {
    type: 'heal',
    value: 100,
  },
});

itemsData.set(uuidv4(), {
  name: 'Strength Elixir',
  description: 'Temporarily increases your attack power.',
  price: 150,
  isUsable: 'single',
  effect: {
    type: 'buff',
    value: 10,
    duration: 30000, // 30 seconds
  },
});

itemsData.set(uuidv4(), {
  name: 'Swiftness Potion',
  description: 'Increases your dodge chance temporarily.',
  price: 120,
  isUsable: 'single',
  effect: {
    type: 'buff',
    value: 0.15,
    duration: 20000, // 20 seconds
  },
});

itemsData.set(uuidv4(), {
  name: 'Defense Tonic',
  description: 'Temporarily increases your defense.',
  price: 130,
  isUsable: 'single',
  effect: {
    type: 'buff',
    value: 8,
    duration: 25000, // 25 seconds
  },
});

itemsData.set(uuidv4(), {
  name: 'Poison Vial',
  description: 'A deadly poison that deals damage over time.',
  price: 200,
  isUsable: 'single',
  effect: {
    type: 'debuff',
    value: 5,
    duration: 10000, // 10 seconds
  },
});

itemsData.set(uuidv4(), {
  name: 'Scroll of Fireball',
  description: 'A scroll that unleashes a powerful fireball.',
  price: 180,
  isUsable: 'single',
  effect: {
    type: 'damage',
    value: 30,
  },
});

itemsData.set(uuidv4(), {
  name: 'Regeneration Potion',
  description: 'Gradually restores health over time.',
  price: 160,
  isUsable: 'single',
  effect: {
    type: 'heal',
    value: 5,
    duration: 15000, // 15 seconds
  },
});

itemsData.set(uuidv4(), {
  name: 'Critical Strike Elixir',
  description: 'Temporarily increases your critical hit chance.',
  price: 140,
  isUsable: 'single',
  effect: {
    type: 'buff',
    value: 0.2,
    duration: 20000, // 20 seconds
  },
});

export const itemsDataContext = Array.from(itemsData)
  .map(([id, item]) => `${item.name}|${id}|${item.description}`)
  .join('\n');
