import { Player } from 'models/Player'; // Import Player from the new file
import { makeAutoObservable } from 'mobx';
import { npcStore } from './npcs';
import { combatLogStore } from 'components/CombatLog';

const keysDown = new Set<string>();

export interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  quantity: number;
  action: string;
  completed: boolean;
  questGiverId: string;
  rewards?: {
    gold?: number;
    items?: string[];
    experience?: number;
  };
}

class GameStore {
  isDialogueOpen: boolean = false;
  activeNpcId: string | null = null;
  player: Player = {} as Player;
  isOver = true;
  questLog: Quest[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addQuest(quest: Quest) {
    this.questLog.push(quest);
  }

  completeQuest(questId: string) {
    const quest = this.questLog.find((q) => q.id === questId);
    if (quest && !quest.completed) {
      quest.completed = true;
      if (quest.rewards) {
        if (quest.rewards.gold) {
          this.player.updateGold(quest.rewards.gold);
        }
        if (quest.rewards.items) {
          quest.rewards.items.forEach((itemId) => {
            this.player.addItemToInventory({ itemId, quantity: 1 });
          });
        }
      }
    }
  }

  startGameActions() {
    if (this.isOver) {
      return;
    }

    if (this.player) {
      const currentTime = Date.now();
      for (const id of npcStore.npcIds) {
        const npc = npcStore.npcs[id];

        npc.doActions(this.player, currentTime);
      }

      this.player.doActions(keysDown, currentTime, this.isDialogueOpen);

      if (!this.player.isAlive()) {
        this.over();
        return;
      }
    }

    setTimeout(() => {
      this.startGameActions();
    }, 100);
  }

  startGame(player: Player) {
    this.player = player;
    this.reset();
    this.startGameActions();
  }

  reset() {
    this.isOver = false;
    combatLogStore.log.length = 0;
  }

  openDialogue(npcId: string) {
    this.isDialogueOpen = true;
    this.activeNpcId = npcId;
  }

  closeDialogue(npcId?: string) {
    if (!npcId || this.activeNpcId == npcId) {
      this.isDialogueOpen = false;
      this.activeNpcId = null;
    }
  }

  over() {
    this.isOver = true;
    alert('YOU DIED');
    window.location.reload();
  }
}

export const gameStore = new GameStore();

// Controls
const handleKeyDown = (e: KeyboardEvent) => {
  keysDown.add(e.code);
};
const handleKeyUp = (e: KeyboardEvent) => {
  keysDown.delete(e.code);
};

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
