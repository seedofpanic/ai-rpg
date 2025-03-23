import { makeAutoObservable } from 'mobx';
import { Mob, MobType } from './mob';
import { NPC } from './npc';
import { v4 as uuidv4 } from 'uuid';
import { npcStore } from './npcStore';
import { mobStore } from './mobStore';
import { gameStore } from './gameStore';
import { Vector2 } from 'utils/vector2';
type locationData = Omit<
  Location,
  'id' | 'npcs' | 'monsters' | 'generateNPCs' | 'generateMonsters'
>;

const requiredNPCs = ['Harl'];

const CLOSE_LOCATION_RADIUS = 100;

export class Location {
  id = uuidv4();
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  npcsTemplate: { role: string; minQuantity: number; maxQuantity: number }[];
  monstersTemplate: {
    type: MobType;
    minQuantity: number;
    maxQuantity: number;
  }[];
  npcs: NPC[] = [];
  monsters: Mob[] = [];

  constructor(data: locationData) {
    this.name = data.name;
    this.description = data.description;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.npcsTemplate = data.npcsTemplate;
    this.monstersTemplate = data.monstersTemplate;

    locationsStore.generateNPCs(this);
    locationsStore.generateMonsters(this);
  }
}

class LocationsStore {
  locations: Location[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  generateNPCs(location: Location) {
    for (const template of location.npcsTemplate) {
      const quantity =
        Math.floor(
          Math.random() * (template.maxQuantity - template.minQuantity + 1),
        ) + template.minQuantity;
      for (let i = 0; i < quantity; i++) {
        location.npcs.push(npcStore.generateRandomNPC(location));
      }
    }
  }

  generateMonsters(location: Location) {
    for (const template of location.monstersTemplate) {
      const quantity =
        Math.floor(
          Math.random() * (template.maxQuantity - template.minQuantity + 1),
        ) + template.minQuantity;
      for (let i = 0; i < quantity; i++) {
        location.monsters.push(
          mobStore.generateRandomMob(location, template.type),
        );
      }
    }
  }

  getCloseLocationByPosition(position: Vector2) {
    return this.locations.filter((location) => {
      return (
        position.x >= location.x - CLOSE_LOCATION_RADIUS &&
        position.x <= location.x + location.width + CLOSE_LOCATION_RADIUS &&
        position.y >= location.y - CLOSE_LOCATION_RADIUS &&
        position.y <= location.y + location.height + CLOSE_LOCATION_RADIUS
      );
    });
  }

  addLocation(location: locationData) {
    this.locations.push(new Location(location));
  }

  generateLocations() {
    this.locations.length = 0;

    this.addLocation({
      name: 'Village Center',
      description:
        'The heart of the village where villagers gather, trade, and chat. A small well sits in the middle.',
      x: 300,
      y: 500,
      width: 400,
      height: 300,
      npcsTemplate: [{ role: 'villager', minQuantity: 4, maxQuantity: 8 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: "Blacksmith's Forge",
      description:
        'A hot and noisy forge where blacksmith forges weapons and armor',
      x: 900,
      y: 500,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'blacksmith', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: "Herbalist's Hut",
      description:
        'A small wooden hut filled with drying herbs and potions, tucked near the forest edge',
      x: 100,
      y: 600,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'herbalist', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Fields',
      description: 'Plain fields to the north of the village',
      x: 1200,
      y: 300,
      width: 500,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [{ type: 'wolf', minQuantity: 3, maxQuantity: 6 }],
    });

    this.addLocation({
      name: 'Old Mill',
      description:
        "An abandoned windmill just outside the village. The locals say it's haunted.",
      x: 1700,
      y: 1150,
      width: 200,
      height: 200,
      npcsTemplate: [],
      monstersTemplate: [{ type: 'ghost', minQuantity: 1, maxQuantity: 2 }],
    });

    this.addLocation({
      name: 'Forest Edge',
      description:
        'The edge of a dense forest. Travelers report strange sounds from within.',
      x: 1700,
      y: 300,
      width: 300,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'goblin', minQuantity: 2, maxQuantity: 4 },
        { type: 'boar', minQuantity: 1, maxQuantity: 2 },
      ],
    });

    this.addLocation({
      name: "Hunter's Cabin",
      description:
        'A lonely cabin where the village hunter lives and prepares his traps.',
      x: 900,
      y: 700,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'hunter', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Tavern',
      description:
        'A cozy tavern where travelers and locals gather to share stories and drink ale.',
      x: 50,
      y: 250,
      width: 400,
      height: 250,
      npcsTemplate: [
        { role: 'barkeep', minQuantity: 1, maxQuantity: 1 },
        { role: 'villager', minQuantity: 2, maxQuantity: 5 },
      ],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Ancient Ruins',
      description:
        'Mysterious stone ruins covered in strange symbols. Some say they hold ancient magic.',
      x: 2000,
      y: 300,
      width: 600,
      height: 300,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'skeleton', minQuantity: 3, maxQuantity: 6 },
        { type: 'ghost', minQuantity: 1, maxQuantity: 2 },
      ],
    });

    this.addLocation({
      name: 'Fishing Dock',
      description:
        'A wooden dock extending into the lake, where fishermen gather to catch fish.',
      x: 300,
      y: 800,
      width: 200,
      height: 150,
      npcsTemplate: [{ role: 'fisherman', minQuantity: 2, maxQuantity: 4 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Cave System',
      description:
        'A network of dark caves that wind deep into the mountains. Strange noises echo from within.',
      x: 2000,
      y: 600,
      width: 1000,
      height: 1000,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'goblin', minQuantity: 4, maxQuantity: 8 },
        { type: 'spider', minQuantity: 2, maxQuantity: 4 },
        { type: 'bat', minQuantity: 3, maxQuantity: 6 },
      ],
    });

    this.addLocation({
      name: 'Market Square',
      description:
        'A bustling marketplace where merchants sell their wares and villagers trade goods.',
      x: 450,
      y: 150,
      width: 650,
      height: 350,
      npcsTemplate: [
        { role: 'merchant', minQuantity: 2, maxQuantity: 4 },
        { role: 'villager', minQuantity: 3, maxQuantity: 6 },
      ],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Guard Post',
      description:
        'A fortified post where village guards keep watch over the surrounding area.',
      x: 700,
      y: 700,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'guard', minQuantity: 2, maxQuantity: 4 }],
      monstersTemplate: [],
    });

    this.addLocation({
      name: 'Swamp',
      description:
        'A murky swamp filled with twisted trees and mysterious lights. The air is thick with fog.',
      x: 1200,
      y: 1100,
      width: 500,
      height: 700,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'boar', minQuantity: 2, maxQuantity: 4 },
        { type: 'spider', minQuantity: 3, maxQuantity: 6 },
        { type: 'ghost', minQuantity: 1, maxQuantity: 2 },
      ],
    });

    this.addLocation({
      name: 'Researchers camp',
      description: 'A camp of researchers who are studying the zone.',
      x: 50,
      y: 1100,
      width: 800,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [],
    });

    this.addRequiredNPCs();
  }

  addRequiredNPCs() {
    for (const background of gameStore.backgroundsData) {
      if (requiredNPCs.includes(background.name)) {
        const suitableLocations = this.locations.filter(
          (location) => !!location.npcsTemplate,
        );
        const randomLocation =
          suitableLocations[
            Math.floor(Math.random() * suitableLocations.length)
          ];
        randomLocation.npcs.push(
          npcStore.generateRandomNPC(randomLocation, background),
        );
      }
    }
  }

  reset() {
    this.locations.length = 0;
  }
}

const locationsStore = new LocationsStore();

export { locationsStore };
