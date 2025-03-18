import { makeAutoObservable } from 'mobx';
import { NPC } from './npc'; // Import NPC from npc.ts
import { locations } from './location'; // Import locations from location.ts
import { Vector2 } from 'utils/vector2';

const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

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
    if (import.meta.env.VITE_CI) {
      const npc = NPC.generateRandomNPC(this.locations);
      npc.position = new Vector2(820, 570);
      this.npcs[npc.id] = npc;
    } else {
      for (const _ of generatedNPCs) {
        const npc = NPC.generateRandomNPC(this.locations);
        this.npcs[npc.id] = npc;
      }
    }
    this.npcIds = Object.keys(this.npcs);

    // After all NPCs are created, assign kill needs
    this.assignKillNeeds();
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
}

export const npcStore = new NPCStore();
