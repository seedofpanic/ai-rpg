import { makeAutoObservable } from 'mobx';
import { NPC } from './npc'; // Import NPC from npc.ts
import { locations } from './location'; // Import locations from location.ts
import { t } from '../localization'; // Import localization function

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
        return t('npcGreeting', { name: npc.name, role: npc.role });
    }
}

export const npcStore = new NPCStore();