import { makeAutoObservable, makeObservable } from "mobx";

interface InventorySlot {
  itemId: string;
  quantity: number;
}

export class Player {
  name: string;
  gender: string;
  race: string;
  class: string;
  gold: number;
  inventory: InventorySlot[] = [];

  constructor(name: string, gender: string, race: string, playerClass: string) {
    this.name = name;
    this.gender = gender;
    this.race = race;
    this.class = playerClass;
    this.gold = 100; // Default gold amount
    makeAutoObservable(this);
  }

  addItemToInventory(item: InventorySlot) {
    this.inventory.push(item);
  }

  spendGold(amount: number) {
    if (this.gold >= amount) {
      this.gold -= amount;
    }
  }

  earnGold(amount: number) {
    this.gold += amount;
  }
}
