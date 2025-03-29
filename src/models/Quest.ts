import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
export class Quest {
  killCount = 0;
  id: string;
  title: string;
  description: string;
  subject: string;
  quantity: number;
  action: string;
  completed = false;
  questGiverId: string | null;
  rewards?: {
    gold?: number;
    items?: string[];
    experience?: number;
  };

  constructor(
    quest: Omit<
      Quest,
      'id' | 'killCount' | 'completed' | 'completeQuest' | 'updateKillCount'
    >,
  ) {
    this.id = uuidv4();
    this.title = quest.title;
    this.description = quest.description;
    this.subject = quest.subject;
    this.quantity = quest.quantity;
    this.action = quest.action;
    this.questGiverId = quest.questGiverId;
    this.rewards = quest.rewards;

    makeAutoObservable(this);
  }

  completeQuest() {
    this.completed = true;
  }

  updateKillCount(count: number) {
    this.killCount += count;
  }
}
