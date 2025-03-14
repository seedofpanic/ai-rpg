import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData';
import { Location } from './location'; // Import related types

interface InventoryItem {
    itemId: string;
    quantity: number;
}

interface Message {
    text: string;
    isPlayer: boolean;
    tokensCount: number;
    relationChange?: number;
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

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomInventory(): InventoryItem[] {
    const inventorySize = Math.floor(Math.random() * 5) + 1;
    const itemKeys = Array.from(itemsData.keys());
    const inventory = new Set<InventoryItem>();
    while (inventory.size < inventorySize) {
        inventory.add({ itemId: getRandomElement(itemKeys), quantity: 1 });
    }
    return Array.from(inventory);
}

export class NPC {
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
    dialogueHistory: Message[];
    state?: string;
    inventory?: InventoryItem[];
    gold: number;
    relation: number;

    constructor(
        id: string,
        x: number,
        y: number,
        name: string,
        role: string,
        personality: string,
        knowledge: string[],
        background: string,
        relationships: Record<string, string>,
        location: Location,
        environmentKnowledge: {
            localEvents: string[];
            locationFeatures: string[];
            commonVisitors: string[];
        },
        dialogueHistory: Message[] = [],
        state?: string,
        inventory?: InventoryItem[],
        gold: number = 0,
        relation: number = 0
    ) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.role = role;
        this.personality = personality;
        this.knowledge = knowledge;
        this.background = background;
        this.relationships = relationships;
        this.location = location;
        this.environmentKnowledge = environmentKnowledge;
        this.dialogueHistory = dialogueHistory;
        this.state = state;
        this.inventory = inventory;
        this.gold = gold;
        this.relation = relation;
        makeAutoObservable(this);
    }

    static generateRandomNPC(locs: Location[]): NPC {
        const id = uuidv4();
        const name = getRandomElement(names);
        const role = getRandomElement(roles);
        const personality = getRandomElement(personalities);
        const knowledge = Array.from({ length: 3 }, () => getRandomElement(knowledgePool));
        const location = getRandomElement(locs);
        const x = location.x + Math.floor(Math.random() * (location.width - 40));
        const y = location.y + Math.floor(Math.random() * (location.height - 40));

        const npc = new NPC(
            id,
            x,
            y,
            name,
            role,
            personality,
            knowledge,
            "Random background",
            {},
            location,
            {
                localEvents: ["Random event 1", "Random event 2"],
                locationFeatures: ["Random feature 1", "Random feature 2"],
                commonVisitors: ["Random visitor 1", "Random visitor 2"]
            },
            [],
            undefined,
            generateRandomInventory(),
            Math.floor(Math.random() * 200),
            Math.floor(Math.random() * 101)
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
        } else {
            return 'Hostile';
        }
    };

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
            default:
                return 0;
        }
    }

    changeRelation(relationChange: number) {
        this.relation = Math.min(100, Math.max(0, this.relation + relationChange));
    }

    setState(newState: string | undefined) {
        if (!newState) return;

        this.state = newState;
    }

    addDialogHistory(message: { text: string; isPlayer: boolean; tokensCount: number; }) {
        this.dialogueHistory.push(message);
    }

    removeItem(itemId: string) {
        this.inventory = this.inventory?.filter(item => item.itemId !== itemId);
    }
}
