import { Player } from './Player';
import { makeAutoObservable } from 'mobx';
import { npcStore } from './npcStore';
import { combatLogStore } from 'components/CombatLog';
import { itemsData } from './itemsData';
import { mobStore } from './mobStore';
import { keysDown } from 'utils/keyboard';
import { Quest } from './Quest';
import { locationsStore } from './location';
import { BackgroundTemplate, getBackgroundsData } from './backgroundsData';
import { Vector2 } from 'utils/vector2';
import { buildStory } from './scenarios/scenarioBuilder';
import { researchersCampBuilder } from './scenarios/researchersCampBuilder';

type DayTime = 'morning' | 'afternoon' | 'evening' | 'night';
type Weather =
  | 'clear sky'
  | 'cloudy'
  | 'rainy'
  | 'foggy'
  | 'stormy'
  | 'clear'
  | 'overcast';
const weather: Weather[] = [
  'clear sky',
  'cloudy',
  'rainy',
  'foggy',
  'stormy',
  'clear',
  'overcast',
];

let dayTimeTimer: NodeJS.Timeout | null = null;

export class GameStore {
  isDialogueOpen: boolean = false;
  activeNpcId: string | null = null;
  currentNpcId: string | null = null;
  player: Player = {} as Player;
  isOver = true;
  questLog: Quest[] = [];
  hoveredNpcId: string | null = null;
  api: 'gemini' | 'proxy' = 'gemini';
  backgroundsData: BackgroundTemplate[] = [];
  dayTime: DayTime = 'morning';
  weather: Weather = 'clear sky';
  possibleReplies: Record<string, string[]> = {};
  constructor() {
    makeAutoObservable(this);
  }

  updateWeather() {
    this.weather = weather[Math.floor(Math.random() * weather.length)];
  }

  setPossibleReplies(npcId: string, replies: string[]) {
    this.possibleReplies[npcId] = replies;
  }

  startDayTime() {
    if (dayTimeTimer) {
      clearTimeout(dayTimeTimer);
    }

    dayTimeTimer = setTimeout(
      () => {
        if (this.dayTime === 'morning') {
          this.dayTime = 'afternoon';
        } else if (this.dayTime === 'afternoon') {
          this.dayTime = 'evening';
        } else if (this.dayTime === 'evening') {
          this.dayTime = 'night';
        } else if (this.dayTime === 'night') {
          this.dayTime = 'morning';
        }
        this.updateWeather();
      },
      1000 * 60 * 10,
    );
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
          if (quest.questGiverId) {
            const questGiver = npcStore.npcs[quest.questGiverId];
            if (questGiver) {
              questGiver.addItem({
                itemId: quest.subject,
                quantity: quest.quantity,
              });
            }
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

      return quest;
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
    locationsStore.generateLocations();
    buildStory();
    researchersCampBuilder();
    this.startGameActions();
    this.startDayTime();
    if (import.meta.env.VITE_CI) {
      mobStore.initializeMobs();
      const npc = npcStore.generateRandomNPC(locationsStore.locations[0]);
      npc.position = new Vector2(
        this.player.position.x + 30,
        this.player.position.y + 30,
      );
      npcStore.npcs[npc.id] = npc;
      npcStore.npcIds.push(npc.id);
    }
  }

  reset() {
    this.questLog.length = 0;
    this.isOver = false;
    combatLogStore.log.length = 0;
    locationsStore.reset();
    mobStore.reset();
    npcStore.reset();
    this.backgroundsData = getBackgroundsData();
    this.dayTime = 'night';
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

  setHoveredNpcId(npcId: string | null) {
    this.hoveredNpcId = npcId;
  }

  updateControls(keyDown: string) {
    if (keyDown === 'KeyE' && this.hoveredNpcId) {
      const npc = npcStore.npcs[this.hoveredNpcId];
      if (npc?.isAlive() && this.player.isCloseTo(npc.position)) {
        this.setCurrentNpcId(this.hoveredNpcId);
        this.setDialogueOpen(true);
      }
    }
  }

  updateQuest(subject: string, questGiverId?: string) {
    for (const quest of this.questLog) {
      if (quest.subject.toLowerCase() === subject.toLowerCase()) {
        if (quest.questGiverId) {
          quest.killCount++;
        } else {
          this.completeQuest(quest.id);
        }
      }
    }

    if (questGiverId) {
      this.questLog = this.questLog.filter(
        (q) => q.questGiverId !== questGiverId,
      );
    }
  }
}

export const gameStore = new GameStore();
