import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData'; // Import itemsData

interface Message {
  text: string;
  isPlayer: boolean;
  tokensCount: number;
}

interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface NPC {
    id: string;
    x: number;
    y: number;
    name: string;
    role: string;
    personality: string;
    knowledge: string[];
    background: string;
    relationships: Record<string, string>;
    location: Location;
    environmentKnowledge: {
        localEvents: string[];
        locationFeatures: string[];
        commonVisitors: string[];
    };
    dialogueHistory: Message[]; // Add dialogueHistory
    state?: string; // Add state
    inventory?: InventoryItem[]; // Add inventory
    gold: number; // Add gold
}

const names = ["Mikhail", "Vasily", "Peter", "Anna", "Ivan", "Alexey", "Dmitry", "Nikolay", "Elena", "Olga", "Maria", "Sergey", "Andrey", "Tatyana", "Yulia", "Alexander", "Vladimir", "Ekaterina", "Natalya", "Galina"];
const roles = ["Merchant", "Alchemist", "Guard", "Baker", "Blacksmith", "Fisherman", "Hunter", "Farmer", "Tailor", "Jeweler"];
const personalities = ["Friendly", "Eccentric", "Serious", "Cheerful", "Reserved", "Sociable", "Modest", "Ambitious"];
const knowledgePool = [
    "Knows everything about goods and prices in the city",
    "Aware of the latest city events",
    "Has connections with other merchants",
    "Expert in potion making and alchemy",
    "Knows many rare recipes",
    "Studies the magical properties of plants",
    "Master in blacksmithing",
    "Knows the best fishing spots",
    "Experienced hunter",
    "Knows everything about agriculture",
    "Master of sewing and tailoring",
    "Expert in jewelry making"
];

interface Location {
    name: string;
    description: string;
    nearbyNPCs: string[];
    x: number;
    y: number;
    width: number; // Add width
    height: number; // Add height
    npcs: string[];
}

const locations: Location[] = [
    {
        name: "Market Square",
        description: "A bustling trading square in the city center, surrounded by various shops and stores",
        nearbyNPCs: ["Alchemist Vasily", "Guard Peter", "Baker Anna"],
        x: 100,
        y: 100,
        width: 500,
        height: 500,
        npcs: []
    },
    {
        name: "Alchemist's Shop",
        description: "A small shop on the corner of the market square, filled with vials, herbs, and magical items",
        nearbyNPCs: ["Merchant Mikhail", "Herbalist Maria"],
        x: 700,
        y: 100,
        width: 300,
        height: 300,
        npcs: []
    },
    {
        name: "Blacksmith's Forge",
        description: "A hot and noisy forge where blacksmith Ivan forges weapons and armor",
        nearbyNPCs: ["Blacksmith Ivan", "Fisherman Alexey"],
        x: 1100,
        y: 100,
        width: 400,
        height: 400,
        npcs: []
    },
    {
        name: "Fishing Village",
        description: "A small village on the riverbank where fishermen live",
        nearbyNPCs: ["Fisherman Alexey", "Hunter Dmitry"],
        x: 100,
        y: 700,
        width: 600,
        height: 400,
        npcs: []
    },
    {
        name: "Farm",
        description: "A large farm outside the city where various crops are grown",
        nearbyNPCs: ["Farmer Nikolay", "Tailor Elena"],
        x: 800,
        y: 700,
        width: 500,
        height: 500,
        npcs: []
    },
    {
        name: "Jeweler's Workshop",
        description: "A workshop where jeweler Olga creates exquisite jewelry",
        nearbyNPCs: ["Jeweler Olga", "Merchant Mikhail"],
        x: 1400,
        y: 700,
        width: 350,
        height: 350,
        npcs: []
    }
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomInventory(): InventoryItem[] {
    const inventorySize = Math.floor(Math.random() * 5) + 1; // Random inventory size between 1 and 5
    const itemKeys = Array.from(itemsData.keys());
    const inventory = new Set<InventoryItem>();
    while (inventory.size < inventorySize) {
        inventory.add({itemId: getRandomElement(itemKeys), quantity: 1}); // Random quantity between 1 and 3
    }
    return Array.from(inventory);
}

function generateRandomNPC(locs: Location[]): NPC {
    const id = uuidv4();
    const name = getRandomElement(names);
    const role = getRandomElement(roles);
    const personality = getRandomElement(personalities);
    const knowledge = Array.from({ length: 3 }, () => getRandomElement(knowledgePool));
    const location = getRandomElement(locs);
    const x = location.x + Math.floor(Math.random() * (location.width - 40)); // Adjust x to ensure NPC stays within bounds
    const y = location.y + Math.floor(Math.random() * (location.height - 40)); // Adjust y to ensure NPC stays within bounds

    const npc = makeAutoObservable({
        id,
        x,
        y,
        name,
        role,
        personality,
        knowledge,
        background: "Random background",
        relationships: {},
        location,
        environmentKnowledge: {
            localEvents: ["Random event 1", "Random event 2"],
            locationFeatures: ["Random feature 1", "Random feature 2"],
            commonVisitors: ["Random visitor 1", "Random visitor 2"]
        },
        dialogueHistory: [], // Initialize dialogueHistory
        inventory: generateRandomInventory(), // Initialize inventory with random items from itemsData
        gold: Math.floor(Math.random() * 200) // Initialize gold
    });

    location.npcs.push(npc.id);
    return npc;
}

class NPCStore {
    npcs: Record<string, NPC> = {};
    npcIds: string[] = [];
    locations = locations;

    constructor() {
        makeAutoObservable(this);
        this.initializeNPCs();
    }

    initializeNPCs() {
        const generatedNPCs = Array.from({ length: 10 });
        for (const _ of generatedNPCs) {
            const npc = generateRandomNPC(this.locations);
            this.npcs[npc.id] = npc;
        }
        this.npcIds = Object.keys(this.npcs);
    }
    getNpcGreating(npcId: string): string {
        const npc = this.npcs[npcId];
        return `Hello, I am ${npc.name}, the ${npc.role}. How can I help you?`;
    }
}

export const npcStore = new NPCStore();
export { locations }; // Export locations