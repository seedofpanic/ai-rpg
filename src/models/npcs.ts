import { makeAutoObservable } from 'mobx';
import { NPC } from './npc'; // Import NPC from npc.ts
import { locations } from './location'; // Import locations from location.ts

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
      const npc = NPC.generateRandomNPC(this.locations);
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
