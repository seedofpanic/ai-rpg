interface InventorySlot {
  itemId: string;
  quantity: number;
}

export class Player {
  name: string;
  gender: string;
  race: string;
  class: string;
  inventory: InventorySlot[] = [];
  gold: number = 50;

  constructor(name: string, gender: string, race: string, playerClass: string) {
    this.name = name;
    this.gender = gender;
    this.race = race;
    this.class = playerClass;
  }
}
