import { v4 as uuidv4 } from 'uuid';

interface Item {
  name: string;
  description: string;
  price: number;
}

export const itemsData = new Map<string, Item>();
const uuid = uuidv4();
itemsData.set(uuid, {
  name: 'Sword',
  description: 'A sharp sword for battle.',
  price: 100,
});

itemsData.set(uuidv4(), {
  name: 'Shield',
  description: 'A sturdy shield for protection.',
  price: 150,
});

itemsData.set(uuidv4(), {
  name: 'Health Potion',
  description: 'A potion that restores health.',
  price: 50,
});

itemsData.set(uuidv4(), {
  name: 'Magic Wand',
  description: 'A wand imbued with magical powers.',
  price: 200,
});

itemsData.set(uuidv4(), {
  name: 'Helmet',
  description: 'A helmet to protect your head.',
  price: 75,
});

itemsData.set(uuidv4(), {
  name: 'Bow',
  description: 'A bow for ranged attacks.',
  price: 120,
});

itemsData.set(uuidv4(), {
  name: 'Arrow',
  description: 'Ammunition for the bow.',
  price: 10,
});

itemsData.set(uuidv4(), {
  name: 'Boots',
  description: 'Boots to increase your speed.',
  price: 80,
});

itemsData.set(uuidv4(), {
  name: 'Ring of Strength',
  description: 'A ring that increases your strength.',
  price: 250,
});

itemsData.set(uuidv4(), {
  name: 'Cloak of Invisibility',
  description: 'A cloak that makes you invisible.',
  price: 300,
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
  name: 'Letter',
  description: 'A letter from a friend.',
  price: 1,
});
