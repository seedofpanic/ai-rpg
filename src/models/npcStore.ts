import { makeAutoObservable } from 'mobx';
import { NPC } from './npc'; // Import NPC from npc.ts
import { Location } from './location';
import { BackgroundTemplate } from './backgroundsData';

const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

class NPCStore {
  npcs: Record<string, NPC> = {};
  npcIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  assignKillNeeds() {
    const npcArray = Object.values(this.npcs);
    for (const npc of npcArray) {
      // Get a random NPC that isn't the current one
      if (Math.random() < 0.2) {
        const otherNpcs = npcArray.filter((other) => other.id !== npc.id);
        if (otherNpcs.length > 0) {
          const targetNpc = getRandomElement(otherNpcs);
          npc.addKillNeed(targetNpc.name);
        }
      }
    }
  }

  getNpcGreating(npcId: string): string {
    const npc = this.npcs[npcId];
    return `Hello, I am ${npc.name}, the ${npc.role}. How can I help you?`;
  }

  generateRandomNPC(loc: Location, background?: BackgroundTemplate): NPC {
    const npc = NPC.generateRandomNPC(loc, background);
    this.npcs[npc.id] = npc;
    this.npcIds.push(npc.id);
    return npc;
  }

  reset() {
    this.npcs = {};
    this.npcIds = [];
  }
}

export const npcStore = new NPCStore();
