import { Player } from 'models/Player'; // Import Player from the new file
import { makeAutoObservable } from 'mobx';
import { itemsData } from './itemsData'; // Import itemsData from the new file

class GameStore {
    isDialogueOpen: boolean = false;
    activeNpcId: string | null = null;
    player: Player | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    openDialogue(npcId: string) {
        this.isDialogueOpen = true;
        this.activeNpcId = npcId;
    }

    closeDialogue() {
        this.isDialogueOpen = false;
        this.activeNpcId = null;
    }
}

export const gameStore = new GameStore();
