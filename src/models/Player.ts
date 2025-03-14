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
    const existingItem = this.inventory.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.inventory.push(item);
    }
  }

  removeItemFromInventory(item: InventorySlot) {
    const existingItem = this.inventory.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity -= item.quantity;
      if (existingItem.quantity <= 0) {
        this.inventory = this.inventory.filter((i) => i.itemId !== item.itemId);
      }
    }
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
