import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData';
import { Location } from './location'; // Import related types
import { backgroundsData } from './backgroundsData';
import { Player } from './Player';
import { Vector2 } from '../utils/vector2'; // Import Vector2
import { combatLogStore } from 'components/CombatLog';
import { gameStore } from './gameStore';

interface InventoryItem {
    itemId: string;
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
    position: Vector2;
    name: string;
    speed = 10;
    race: string;
    role: string;
    personality: string;
    knowledge: string[];
    relationships: Record<string, string>;
    location: Location;
    dialogueHistory: Message[];
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

    // utils
    lastUpdateTime: number = Date.now();
    attackReady = 0;

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
        dialogueHistory: Message[] = [],
        state?: string,
        inventory?: InventoryItem[],
        gold: number = 0,
        relation: number = 0,
        health: number = 100,
        attackPower: number = 10,
        defense: number = 5,
        criticalChance: number = 0.1,
        dodgeChance: number = 0.05
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
        this.dialogueHistory = dialogueHistory;
        this.state = state;
        this.inventory = inventory;
        this.gold = gold;
        this.relation = relation;
        this.health = health;
        this.attackPower = attackPower;
        this.defense = defense;
        this.criticalChance = criticalChance;
        this.dodgeChance = dodgeChance;
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
        const knowledge = Array.from({ length: 3 }, () => getRandomElement(knowledgePool));
        const location = getRandomElement(locs);
        const x = location.x + Math.floor(Math.random() * (location.width - 40));
        const y = location.y + Math.floor(Math.random() * (location.height - 40));

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
            [],
            undefined,
            generateRandomInventory(),
            Math.floor(Math.random() * 200),
            Math.floor(Math.random() * 100) + 1
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
            case 'frugality':
                return -3;
            default:
                return 0;
        }
    }

    changeRelation(relationChange: number) {
        this.relation = Math.min(100, Math.max(0, this.relation + relationChange));

        if (this.relation === 0) {
            gameStore.closeDialogue(this.id);
            setTimeout(() => this.changeRelation(1), 10000);
        }
    }

    setState(newState: string | undefined) {
        if (!newState) return;

        this.state = newState;
    }

    addDialogHistory(message: Message) {
        this.dialogueHistory.push(message);
    }

    removeItem({itemId, quantity}: InventoryItem) {
        this.inventory = this.inventory?.filter(item => item.itemId !== itemId);
        if (this.inventory) {
            const item = this.inventory.find(i => i.itemId === itemId);
            if (item) {
                item.quantity -= quantity;
                if (item.quantity <= 0) {
                    this.inventory = this.inventory.filter(i => i.itemId !== itemId);
                }
            }
        }
    }

    addItem({itemId, quantity}: InventoryItem) {
        const item = this.inventory?.find(i => i.itemId === itemId);
        if (item) {
            item.quantity += quantity;
        } else {
            this.inventory?.push({ itemId, quantity });
        }
    }

    attack(target: { takeDamage: (damage: number) => void, name: string }) {
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
        // if a second passed since the last update
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
}
