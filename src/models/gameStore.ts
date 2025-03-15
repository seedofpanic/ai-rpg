import { Player } from 'models/Player'; // Import Player from the new file
import { makeAutoObservable } from 'mobx';
import { npcStore } from './npcs';
import { combatLogStore } from 'components/CombatLog';

const keysDown = new Set<string>();

class GameStore {
  isDialogueOpen: boolean = false;
  activeNpcId: string | null = null;
  player: Player = {} as Player;
  isOver = true;

  constructor() {
    makeAutoObservable(this);
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
