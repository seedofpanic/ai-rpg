import { combatLogStore } from 'components/CombatLog';
import { makeAutoObservable } from 'mobx';
import { Vector2 } from 'utils/vector2';

interface InventorySlot {
  itemId: string;
  quantity: number;
}

export class Player {
  speed = 20;
  position: Vector2;
  name: string;
  race: string;
  class: string;
  gold: number;
  inventory: InventorySlot[] = [];
  health: number;
  attackPower: number;
  defense: number; // New attribute
  criticalChance: number; // New attribute
  dodgeChance: number; // New attribute

  // utils
  lastUpdateTime = Date.now();
  combatMode = false;

  constructor(name: string, race: string, playerClass: string) {
    this.position = new Vector2(50, 50);
    this.name = name;
    this.race = race;
    this.class = playerClass;
    this.gold = 100; // Default gold amount
    this.health = 100; // Default health
    this.attackPower = 15; // Default attack power
    this.defense = 5; // Default defense
    this.criticalChance = 0.1; // 10% critical chance
    this.dodgeChance = 0.05; // 5% dodge chance
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

  takeDamage(amount: number) {
    const isDodged = Math.random() < this.dodgeChance;

    if (isDodged) {
      console.log(`${this.name} dodged the attack!`);
      combatLogStore.push(`${this.name} dodged the attack!`);
      return;
    }

    const reducedDamage = Math.max(0, amount - this.defense);
    this.health = Math.max(0, this.health - reducedDamage);
    console.log(`${this.name} took ${reducedDamage} damage.`);
    combatLogStore.push(`${this.name} took ${reducedDamage} damage.`);
  }

  isCloseTo(position: Vector2) {
    const distance = this.position.subtract(position).magnitude();

    return distance <= 70;
  }

  attack(target: { takeDamage: (damage: number) => void; position: Vector2 }) {
    if (!this.isCloseTo(target.position)) {
      // Assuming 100 is the maximum attack range
      console.log(`${this.name} is too far away to attack.`);
      combatLogStore.push(`${this.name} is too far away to attack.`);
      return;
    }

    const isCritical = Math.random() < this.criticalChance;
    const damage = isCritical ? this.attackPower * 2 : this.attackPower;
    target.takeDamage(damage);
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.position = new Vector2(x, y);
  }

  toggleCombatMode() {
    this.combatMode = !this.combatMode;
  }

  doActions(
    keysDown: Set<string>,
    currentTime: number,
    dialogIsAcitve: boolean,
  ) {
    const delta = currentTime - this.lastUpdateTime;

    if (!dialogIsAcitve) {
      this.updateMovement(keysDown, delta);
    }
  }

  updateMovement(keysDown: Set<string>, delta: number) {
    let moveX = 0;
    let moveY = 0;
    if (delta >= 100) {
      if (keysDown.has('KeyW')) {
        moveY = -1;
      }
      if (keysDown.has('KeyA')) {
        moveX = -1;
      }
      if (keysDown.has('KeyS')) {
        moveY = 1;
      }
      if (keysDown.has('KeyD')) {
        moveX = 1;
      }
      if (keysDown.has('KeyC')) {
        this.toggleCombatMode();
      }
    }

    if (moveX || moveY) {
      this.position = this.position.add(
        new Vector2(moveX, moveY).normalize().multiply(this.speed),
      );
    }
  }
}
