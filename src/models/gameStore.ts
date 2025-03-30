import { Player } from './Player';
import { makeAutoObservable } from 'mobx';
import { npcStore } from './npcs/npcStore';
import { combatLogStore } from 'components/CombatLog';
import { itemsData } from './itemsData';
import { mobStore } from './mobs/mobStore';
import { keysDown } from 'utils/keyboard';
import { Quest } from './Quest';
import { locationsStore } from './location';
import { BackgroundTemplate, getBackgroundsData } from './npcs/backgroundsData';
import { Vector2 } from 'utils/vector2';
import { buildStory } from './scenarios/scenarioBuilder';
import { researchersCampBuilder } from './scenarios/researchersCampBuilder';
import { Mob, MobType } from './mobs/mob';
import { projectileStore } from './projectileStore';
import { villageBuilder } from './scenarios/villageBuilder';
import { NPC, MessageType } from './npcs/npc';
import { Weather, DayTime } from './location';

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

let lastUpdateTime = Date.now();
let gameLoopTimer: NodeJS.Timeout | null = null;

export class GameStore {
  isDialogueOpen: boolean = false;
  activeNpcId: string | null = null;
  currentNpcId: string | null = null;
  player: Player = {} as Player;
  isOver = true;
  hoveredNpcId: string | null = null;
  api: 'gemini' | 'proxy' = 'gemini';
  backgroundsData: BackgroundTemplate[] = [];
  dayTime: DayTime = 'morning';
  weather: Weather = 'clear sky';
  acceptedQuests: Quest[] = [];
  completedQuests: Quest[] = [];
  possibleReplies: Record<string, string[]> = {};
  lastMessageError: string | null = null;

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

    this.updateDayTimeAndWeather();

    dayTimeTimer = setTimeout(
      () => {
        this.startDayTime();
      },
      1000 * 60 * 10,
    );
  }

  updateDayTimeAndWeather() {
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
  }

  addQuest(quest: Quest) {
    this.acceptedQuests.push(quest);
  }

  acceptQuest(questId: string, npc: NPC) {
    const quest = npc.removeOfferedQuest(questId);
    if (quest) {
      gameStore.addQuest(quest);

      if (npc) {
        npc.addDialogHistory({
          text: `You accepted the quest: ${quest.title}`,
          type: MessageType.Action,
        });
      }
    }
  }

  declineQuest(questId: string, npc: NPC) {
    const declinedQuest = npc.removeOfferedQuest(questId);
    if (declinedQuest && npc) {
      npc.addDialogHistory({
        text: `You declined the quest: ${declinedQuest.title}`,
        type: MessageType.Action,
      });
    }
  }

  completeQuest(questId: string) {
    const quest = this.acceptedQuests.splice(
      this.acceptedQuests.findIndex((q) => q.id === questId),
      1,
    )[0];
    if (quest && !quest.completed) {
      this.completedQuests.push(quest);
      if (quest.action.toLowerCase() === 'bring') {
        if (itemsData.has(quest.subject)) {
          this.player.removeItemFromInventory({
            itemId: quest.subject,
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

    const currentTime = Date.now();
    const delta = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    if (this.player) {
      // Process NPC actions
      for (const id of npcStore.npcIds) {
        const npc = npcStore.npcs[id];
        npc.doActions(this.player, delta);
      }

      // Process mob actions
      for (const id of mobStore.mobIds) {
        const mob = mobStore.mobs[id];
        mob.doActions(this.player, delta);
      }

      // Process player actions
      this.player.doActions(keysDown, delta, this.isDialogueOpen);

      if (!this.player.isAlive()) {
        this.over();
        return;
      }
    }

    gameLoopTimer = setTimeout(() => {
      this.startGameActions();
    }, 100);
  }

  startGame(player: Player) {
    this.player = player;
    this.reset();
    locationsStore.generateLocations();
    buildStory();
    researchersCampBuilder();
    villageBuilder();
    this.startGameActions();
    projectileStore.startTimer();
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
    if (gameLoopTimer) {
      clearTimeout(gameLoopTimer);
    }

    projectileStore.reset();

    this.acceptedQuests.length = 0;
    this.completedQuests.length = 0;
    this.isOver = false;
    combatLogStore.log.length = 0;
    locationsStore.reset();
    mobStore.reset();
    npcStore.reset();
    projectileStore.reset();
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

  updateKillQuest(subject: string, questGiverId?: string) {
    for (const quest of this.acceptedQuests) {
      if (quest.subject.toLowerCase() === subject.toLowerCase()) {
        if (quest.questGiverId) {
          quest.killCount++;
        }
      }
    }

    if (questGiverId) {
      this.acceptedQuests = this.acceptedQuests.filter(
        (q) => q.questGiverId !== questGiverId,
      );
    }
  }

  setMessageError(lastMessage: string | null) {
    this.lastMessageError = lastMessage;
  }

  spawnMonster(monsterType: string, quantity: number, locationName: string) {
    const location = locationsStore.locations.find(
      (l) => l.name === locationName,
    );
    if (location) {
      const x = Math.random() * location.width + location.x;
      const y = Math.random() * location.height + location.y;

      for (let i = 0; i < quantity; i++) {
        const mob = new Mob(monsterType as MobType, x, y, location);
        mobStore.addMob(mob);
      }
    }
  }
}

export const gameStore = new GameStore();
