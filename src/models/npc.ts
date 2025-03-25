import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData';
import { Location } from './location'; // Import related types
import {
  BackgroundTemplate,
  getRandomBackground,
  Need,
} from './backgroundsData';
import { Player } from './Player';
import { Vector2 } from '../utils/vector2'; // Import Vector2
import { combatLogStore } from 'components/CombatLog';
import { roleSpecificItems } from './roleItems';
import { roleSpecificNeeds } from './roleNeeds';
import { gameStore } from './gameStore';

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface TradeItem {
  itemId: string;
  price: number;
  quantity: number;
}

export enum MessageType {
  Player,
  NPC,
  Action,
}

interface Message {
  text: string;
  type: MessageType;
  tokensCount: number;
  moodChange?: { state: string; change: number };
}

type NpcRole =
  | 'Merchant'
  | 'Alchemist'
  | 'Guard'
  | 'Baker'
  | 'Blacksmith'
  | 'Fisherman'
  | 'Hunter'
  | 'Farmer'
  | 'Tailor'
  | 'Jeweler'
  | 'Priest'
  | 'Tinker';

const names = [
  'Jesse',
  'Michael',
  'Nicolas',
  'Gabriel',
  'Gilead',
  'Levi',
  'Joseph',
  'Stephen',
  'Shiloh',
  'Obed',
  'Christina',
  'Talitha',
  'Ithra',
  'Maria',
  'Melea',
  'Kathleen',
  'Magdalene',
  'Melita',
  'Zimrah',
  'Athalia',
  'Jared',
  'Marcus',
  'Elhanan',
  'Kir',
  'Ramiah',
  'Lucius',
  'Parmenus',
  'Mose',
  'Zebedee',
  'Stephen',
  'Salome',
  'Hali',
  'Zelah',
  'Clementina',
  'Melea',
  'Hadashah',
  'Lael',
  'Elisabeth',
  'Sherah',
  'Elia',
  'Jakin',
  'Jehoshua',
  'Berechiah',
  'Jahaziah',
  'Mose',
  'Jamin',
  'Ebenezer',
  'Cornelius',
  'Elasah',
  'Thaddeus',
  'Jubilee',
  'Tamara',
  'Lydia',
  'Shiloh',
  'Zipporah',
  'Abiel',
  'Bethel',
  'Adah',
  'Amethyst',
  'Charis',
  'Levi',
  'Simon',
  'Ishmael',
  'Enan',
  'Nedabiah',
  'Dodavah',
  'Jared',
  'Stephen',
  'Ebenezer',
  'Barak',
  'Martha',
  'Jemimah',
  'Zilpah',
  'Katharine',
  'Damaris',
  'Lasha',
  'Gethsemane',
  'Galilee',
  'Beulah',
];
const roles: NpcRole[] = [
  'Merchant',
  'Alchemist',
  'Guard',
  'Baker',
  'Blacksmith',
  'Fisherman',
  'Hunter',
  'Farmer',
  'Tailor',
  'Jeweler',
];
const personalities = [
  'Friendly',
  'Eccentric',
  'Serious',
  'Cheerful',
  'Reserved',
  'Sociable',
  'Modest',
  'Ambitious',
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRoleSpecificInventory(role: string): InventoryItem[] {
  const inventory: InventoryItem[] = [];
  const itemEntries = Array.from(itemsData.entries());

  // Helper function to add an item by name
  const addItemByName = (name: string, quantity: number = 1) => {
    const itemEntry = itemEntries.find(([_, item]) => item.name === name);
    if (itemEntry) {
      inventory.push({ itemId: itemEntry[0], quantity });
    }
  };

  const roleConfig = roleSpecificItems[role];
  if (roleConfig) {
    for (const item of roleConfig.items) {
      if (Math.random() < 0.5) {
        continue;
      }

      let quantity = 1;
      if (item.quantity) {
        const [min, max] = item.quantity;
        quantity = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      addItemByName(item.name, quantity);
    }
  }

  // Add 0-5 random items
  const baseSize = Math.floor(Math.random() * 6);
  for (let i = 0; i < baseSize; i++) {
    const randomItem = getRandomElement(itemEntries);
    inventory.push({ itemId: randomItem[0], quantity: 1 });
  }

  return inventory;
}

export const getRelationChange = (state: string | undefined): number => {
  if (!state) return 0;

  switch (state) {
    case 'like':
      return 4;
    case 'confused':
      return -1;
    case 'offensive':
      return -50;
    case 'interesting':
      return 1;
    case 'unfriendly':
      return -2;
    case 'hostile':
      return -4;
    case 'friendly':
      return 2;
    case 'neutral':
      return 0;
    case 'cautious':
      return 1;
    case 'wary':
      return -1;
    case 'frugality':
      return -3;
    default:
      return 0;
  }
};

interface Family {
  children: string[];
}

export class NPC {
  id: string;
  type = 'npc';
  position: Vector2;
  speed = 10;
  background: BackgroundTemplate;
  location: Location;
  dialogueHistory: Message[] | null;
  state?: string;
  inventory?: InventoryItem[];
  gold: number;
  relation: number;
  health: number;
  attackPower: number;
  defense: number; // New attribute
  criticalChance: number; // New attribute
  dodgeChance: number; // New attribute
  aggroTimer?: ReturnType<typeof setTimeout>;
  needs: Need[];
  additionalInstructions?: string;
  family: Family;
  memory: string[] = [];

  // utils
  lastUpdateTime: number = Date.now();
  attackReady = 0;
  sellingItems: TradeItem[] = [];
  buyingItems: TradeItem[] = [];

  constructor(
    x: number,
    y: number,
    background: BackgroundTemplate,
    location: Location,
    inventory?: InventoryItem[],
    gold: number = 0,
    health: number = 100,
    attackPower: number = 10,
    defense: number = 5,
    criticalChance: number = 0.1,
    dodgeChance: number = 0.05,
  ) {
    this.id = uuidv4();
    this.position = new Vector2(x, y);
    this.background = background;
    this.location = location;
    this.dialogueHistory = null;
    this.inventory = inventory;
    this.gold = gold;
    this.relation = background.relation || Math.floor(Math.random() * 80) + 10;
    this.health = health;
    this.attackPower = attackPower;
    this.defense = defense;
    this.criticalChance = criticalChance;
    this.dodgeChance = dodgeChance;
    this.needs = background.needs || [];
    this.family = {
      children: [],
    };
    NPC.generateFamily(this);
    makeAutoObservable(this);
  }

  static generateFamily(npc: NPC) {
    npc.family.children = Array.from(
      { length: Math.floor(Math.random() * 5) },
      () => getRandomElement(names),
    );
  }

  static generateRandomNPC(
    loc: Location,
    background?: BackgroundTemplate,
  ): NPC {
    const backgroundIndex = Math.floor(
      Math.random() * gameStore.backgroundsData.length,
    );
    const selectedBackground =
      gameStore.backgroundsData.splice(backgroundIndex, 1)[0] ||
      background ||
      getRandomBackground();
    const role = getRandomElement(roles);
    const personality = getRandomElement(personalities);

    const x = loc.x + Math.floor(Math.random() * (loc.width - 40));
    const y = loc.y + Math.floor(Math.random() * (loc.height - 40));

    // Generate role-specific needs
    const roleNeeds = roleSpecificNeeds[role] || [
      { type: 'bring', subject: 'supply', basePriority: 7, randomRange: 3 },
    ];

    const needs = roleNeeds.map((needConfig) => ({
      type: needConfig.type,
      subject: needConfig.subject,
      priority:
        needConfig.basePriority + Math.random() * needConfig.randomRange,
      potentialGoldReward: needConfig.potentialGoldReward,
    }));

    selectedBackground.name ||= getRandomElement(names);
    selectedBackground.race ||= 'human';
    selectedBackground.role ||= role;
    selectedBackground.relation = Math.floor(Math.random() * 100) + 1;
    selectedBackground.needs = needs;
    selectedBackground.personality ||= personality;

    const npc = new NPC(
      x,
      y,
      selectedBackground,
      loc,
      generateRoleSpecificInventory(role),
      Math.floor(Math.random() * 3000) + 2000,
      100,
      10,
      5,
      0.1,
      0.05,
    );

    return npc;
  }

  getPlayerRelation() {
    if (this.relation > 95) {
      return 'Very Friendly';
    } else if (this.relation > 85) {
      return 'Friendly';
    } else if (this.relation > 70) {
      return 'Neutral';
    } else if (this.relation > 60) {
      return 'Cautious';
    } else if (this.relation > 45) {
      return 'Wary';
    } else if (this.relation > 30) {
      return 'Unfriendly';
    } else if (this.relation > 15) {
      return 'Very Unfriendly';
    } else if (this.relation > 0) {
      return 'Hateful';
    } else {
      return 'Hostile';
    }
  }

  changeRelation(relationChange: number) {
    this.relation = Math.min(100, Math.max(0, this.relation + relationChange));

    if (this.relation === 0) {
      if (this.aggroTimer) {
        clearTimeout(this.aggroTimer);
      }
      this.aggroTimer = setTimeout(() => this.changeRelation(1), 10000);
    }
  }

  setState(newState: string | undefined) {
    if (!newState) return;

    this.state = newState;
  }

  addDialogHistory(message: Message) {
    if (this.dialogueHistory) {
      this.dialogueHistory.push(message);
    }
  }

  removeDialogHistory(count: number) {
    if (this.dialogueHistory) {
      this.dialogueHistory.splice(-count);
    }
  }

  removeItem({ itemId, quantity }: InventoryItem) {
    if (this.inventory) {
      const item = this.inventory.find((i) => i.itemId === itemId);
      if (item) {
        item.quantity -= quantity;
        if (item.quantity <= 0) {
          this.inventory = this.inventory.filter((i) => i.itemId !== itemId);
        }
      }
    }
  }

  addItem({ itemId, quantity }: InventoryItem) {
    const item = this.inventory?.find((i) => i.itemId === itemId);
    if (item) {
      item.quantity += quantity;
    } else {
      this.inventory?.push({ itemId, quantity });
    }
  }

  attack(target: { takeDamage: (damage: number) => void; name: string }) {
    const isCritical = Math.random() < this.criticalChance;
    const damage = isCritical ? this.attackPower * 2 : this.attackPower;
    combatLogStore.push(`${this.background.name} attacked ${target.name}.`);
    target.takeDamage(damage);
  }

  takeDamage(amount: number) {
    this.changeRelation(-50);
    const isDodged = Math.random() < this.dodgeChance;
    if (isDodged) {
      console.log(`${this.background.name} dodged the attack!`);
      combatLogStore.push(`${this.background.name} dodged the attack!`);
      return;
    }
    const reducedDamage = Math.max(0, amount - this.defense);
    this.health = Math.max(0, this.health - reducedDamage);
    console.log(`${this.background.name} took ${reducedDamage} damage.`);
    combatLogStore.push(
      `${this.background.name} took ${reducedDamage} damage.`,
    );
  }

  isAlive() {
    return this.health > 0;
  }

  doActions(player: Player, currentTime: number) {
    if (!this.isAlive()) {
      return;
    }

    const delta = currentTime - this.lastUpdateTime;
    if (delta >= 100) {
      this.lastUpdateTime += 100;

      if (this.relation === 0) {
        // Calculate direction towards the player
        const distance = player.position.subtract(this.position);
        const magnitude = distance.magnitude();

        if (magnitude > 40) {
          const direction = distance.normalize();

          // Move NPC in the direction of the player
          const movement = direction.multiply(this.speed);
          this.position = this.position.add(movement);
        }

        if (this.attackReady === 0) {
          if (magnitude <= 50) {
            this.attack(player);
            this.attackReady = 5;
          }
        } else {
          this.attackReady--;
        }
        return;
      }
    }
  }

  setSellItem(item: TradeItem) {
    const existingItem = this.sellingItems.find(
      (i) => i.itemId === item.itemId,
    );

    if (existingItem) {
      existingItem.price = item.price;
      existingItem.quantity = item.quantity;
    } else {
      makeAutoObservable(item);
      this.sellingItems.push(item);
    }
  }

  setBuyItems(item: TradeItem) {
    const existingItem = this.buyingItems.find((i) => i.itemId === item.itemId);

    if (existingItem) {
      existingItem.price = item.price;
      existingItem.quantity = item.quantity;
    } else {
      makeAutoObservable(item);
      this.buyingItems.push(item);
    }
  }

  removeBuyItem(item: TradeItem, quantity: number) {
    const existingItem = this.buyingItems.find((i) => i.itemId === item.itemId);
    if (existingItem?.quantity) {
      existingItem.quantity -= quantity;
    }
  }

  removeSellItem(item: TradeItem) {
    this.sellingItems = this.sellingItems.filter(
      (i) => i.itemId !== item.itemId,
    );
  }

  updateGold(price: number) {
    this.gold += price;
  }

  // Add new method to set kill need
  addKillNeed(targetNpcName: string) {
    const killPriorities: Record<string, number> = {
      Merchant: 6,
      Alchemist: 7,
      Guard: 9,
      Baker: 7,
      Blacksmith: 7,
      Fisherman: 7,
      Hunter: 8,
      Farmer: 7,
      Tailor: 7,
      Jeweler: 7,
    };

    const basePriority =
      this.background.role && killPriorities[this.background.role]
        ? killPriorities[this.background.role]
        : 7;
    this.needs.push({
      type: 'kill',
      priority: basePriority + Math.random() * 3,
      subject: targetNpcName,
      potentialGoldReward: 200,
    });
  }

  initializeDialogueHistory() {
    this.dialogueHistory = [];
  }

  setInventory(inventory: { itemId: string; quantity: number }[]): void {
    this.inventory = inventory;
  }

  replaceUserMessage(message: string) {
    if (!this.dialogueHistory) return;

    // find index backwards
    const playerMessageIndex = this.dialogueHistory.findLastIndex(
      (message) => message.type === MessageType.Player,
    );
    if (playerMessageIndex !== undefined) {
      this.dialogueHistory[playerMessageIndex].text = message;
    }
  }

  addMemory(information: string) {
    this.memory.push(information);
  }
}
