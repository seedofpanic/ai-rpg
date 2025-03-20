import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData';
import { Location } from './location'; // Import related types
import { backgroundsData } from './backgroundsData';
import { Player } from './Player';
import { Vector2 } from '../utils/vector2'; // Import Vector2
import { combatLogStore } from 'components/CombatLog';
import { roleSpecificItems } from './roleItems';
import { roleSpecificNeeds } from './roleNeeds';

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface Need {
  type: string;
  priority: number;
  subject: string;
  potentialGoldReward: number;
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
  relationChange?: number;
}

const names = [
  'Mikhail',
  'Vasily',
  'Peter',
  'Anna',
  'Ivan',
  'Alexey',
  'Dmitry',
  'Nikolay',
  'Elena',
  'Olga',
  'Maria',
  'Sergey',
  'Andrey',
  'Tatyana',
  'Yulia',
  'Alexander',
  'Vladimir',
  'Ekaterina',
  'Natalya',
  'Galina',
];
const roles = [
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
const knowledgePool = [
  'Knows everything about goods and prices in the city',
  'Aware of the latest city events',
  'Has connections with other merchants',
  'Expert in potion making and alchemy',
  'Knows many rare recipes',
  'Studies the magical properties of plants',
  'Master in blacksmithing',
  'Knows the best fishing spots',
  'Experienced hunter',
  'Knows everything about agriculture',
  'Master of sewing and tailoring',
  'Expert in jewelry making',
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
      let quantity = 1;
      if (item.quantity) {
        const [min, max] = item.quantity;
        quantity = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      addItemByName(item.name, quantity);
    }
    // add random items from itemsData
    const baseSize = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < baseSize; i++) {
      const randomItem = getRandomElement(itemEntries);
      inventory.push({ itemId: randomItem[0], quantity: 1 });
    }
  } else {
    // Random inventory for unknown roles
    const baseSize = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < baseSize; i++) {
      const randomItem = getRandomElement(itemEntries);
      inventory.push({ itemId: randomItem[0], quantity: 1 });
    }
  }

  return inventory;
}

export class NPC {
  id: string;
  type = 'npc';
  position: Vector2;
  name: string;
  speed = 10;
  race: string;
  role: string;
  personality: string;
  knowledge: string[];
  relationships: Record<string, string>;
  location: Location;
  dialogueHistory: Message[] | null;
  state?: string;
  inventory?: InventoryItem[];
  gold: number;
  relation: number;
  background: string;
  trueBackground: string;
  Motivation: string;
  uniqueTrait: string;
  beliefs: string;
  health: number;
  attackPower: number;
  defense: number; // New attribute
  criticalChance: number; // New attribute
  dodgeChance: number; // New attribute
  aggroTimer?: ReturnType<typeof setTimeout>;
  needs: Need[];

  // utils
  lastUpdateTime: number = Date.now();
  attackReady = 0;
  sellingItems: TradeItem[] = [];
  buyingItems: TradeItem[] = [];

  constructor(
    id: string,
    x: number,
    y: number,
    name: string,
    race: string,
    role: string,
    personality: string,
    knowledge: string[],
    background: string,
    trueBackground: string,
    Motivation: string,
    uniqueTrait: string,
    beliefs: string,
    relationships: Record<string, string>,
    location: Location,
    state?: string,
    inventory?: InventoryItem[],
    gold: number = 0,
    relation: number = 0,
    health: number = 100,
    attackPower: number = 10,
    defense: number = 5,
    criticalChance: number = 0.1,
    dodgeChance: number = 0.05,
    needs: Need[] = [],
  ) {
    this.id = id;
    this.position = new Vector2(x, y);
    this.name = name;
    this.race = race;
    this.role = role;
    this.personality = personality;
    this.knowledge = knowledge;
    this.background = background;
    this.trueBackground = trueBackground;
    this.Motivation = Motivation;
    this.uniqueTrait = uniqueTrait;
    this.beliefs = beliefs;
    this.relationships = relationships;
    this.location = location;
    this.dialogueHistory = null;
    this.state = state;
    this.inventory = inventory;
    this.gold = gold;
    this.relation = relation;
    this.health = health;
    this.attackPower = attackPower;
    this.defense = defense;
    this.criticalChance = criticalChance;
    this.dodgeChance = dodgeChance;
    this.needs = needs;
    makeAutoObservable(this);
  }

  static generateRandomNPC(locs: Location[]): NPC {
    const id = uuidv4();
    const backgroundIndex = Math.floor(Math.random() * backgroundsData.length);
    const background = backgroundsData.splice(backgroundIndex, 1)[0];
    const name = background?.name || getRandomElement(names);
    const race = background?.race || 'Human';
    const role = getRandomElement(roles);
    const personality = getRandomElement(personalities);
    const knowledge = Array.from({ length: 3 }, () =>
      getRandomElement(knowledgePool),
    );
    const location = getRandomElement(locs);
    const x = location.x + Math.floor(Math.random() * (location.width - 40));
    const y = location.y + Math.floor(Math.random() * (location.height - 40));

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

    const npc = new NPC(
      id,
      x,
      y,
      name,
      race,
      role,
      personality,
      knowledge,
      background?.background || '',
      background?.trueBackground || '',
      background?.motivation || '',
      background?.uniqueTrait || '',
      background?.beliefs || '',
      {},
      location,
      undefined,
      generateRoleSpecificInventory(role),
      Math.floor(Math.random() * 3000) + 2000,
      Math.floor(Math.random() * 100) + 1,
      100,
      10,
      5,
      0.1,
      0.05,
      needs,
    );

    location.npcs.push(npc.id);
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

  getRelationChange(state: string | undefined): number {
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
    combatLogStore.push(`${this.name} attacked ${target.name}.`);
    target.takeDamage(damage);
  }

  takeDamage(amount: number) {
    this.changeRelation(-50);
    const isDodged = Math.random() < this.dodgeChance;
    if (isDodged) {
      console.log(`${this.name} dodged the attack!`);
      combatLogStore.push(`${this.name} dodged the attack!`);
      return;
    }
    const reducedDamage = Math.max(0, amount - this.defense);
    this.health = Math.max(0, this.health - reducedDamage);
    console.log(`${this.name} took ${reducedDamage} damage.`);
    combatLogStore.push(`${this.name} took ${reducedDamage} damage.`);
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

  removeBuyItem(item: TradeItem) {
    this.buyingItems = this.buyingItems.filter((i) => i.itemId !== item.itemId);
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

    const basePriority = killPriorities[this.role] || 7;
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
}
