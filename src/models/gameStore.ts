import { Player } from './Player';
import { makeAutoObservable } from 'mobx';
import { npcStore } from './npcs';
import { combatLogStore } from 'components/CombatLog';
import { itemsData } from './itemsData';
import { mobStore } from './mobStore';
import { keysDown } from 'utils/keyboard';

export interface Quest {
  killCount: number;
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

export class GameStore {
  isDialogueOpen: boolean = false;
  activeNpcId: string | null = null;
  currentNpcId: string | null = null;
  player: Player = {} as Player;
  isOver = true;
  questLog: Quest[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addQuest(quest: Quest) {
    if (this.questLog.find((q) => q.title === quest.title)) {
      return false;
    }

    makeAutoObservable(quest);
    this.questLog.push(quest);
    return true;
  }

  completeQuest(questId: string) {
    const quest = this.questLog.find((q) => q.id === questId);
    if (quest && !quest.completed) {
      if (quest.action.toLowerCase() === 'bring') {
        const itemId = itemsData
          .keys()
          .find(
            (id) =>
              itemsData.get(id)?.name.toLowerCase() ===
              quest.subject.toLowerCase(),
          );
        if (itemId) {
          this.player.removeItemFromInventory({
            itemId: itemId || quest.subject,
            quantity: quest.quantity,
          });
          // add this item to the quest giver inventory
          const questGiver = npcStore.npcs[quest.questGiverId];
          if (questGiver) {
            questGiver.addItem({
              itemId: quest.subject,
              quantity: quest.quantity,
            });
          }
        }
      }

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

      // Process NPC actions
      for (const id of npcStore.npcIds) {
        const npc = npcStore.npcs[id];
        npc.doActions(this.player, currentTime);
      }

      // Process mob actions
      for (const id of mobStore.mobIds) {
        const mob = mobStore.mobs[id];
        mob.doActions(this.player, currentTime);
      }

      // Process player actions
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

  setDialogueOpen(isOpen: boolean) {
    this.isDialogueOpen = isOpen;
  }

  setCurrentNpcId(npcId: string | null) {
    this.currentNpcId = npcId;
  }

  openDialogue(npcId: string) {
    this.isDialogueOpen = true;
    this.currentNpcId = npcId;
    this.activeNpcId = npcId;
  }

  closeDialogue() {
    this.isDialogueOpen = false;
    this.currentNpcId = null;
    this.activeNpcId = null;
  }

  over() {
    this.isOver = true;
    alert('YOU DIED');
    window.location.reload();
  }
}

export const gameStore = new GameStore();
