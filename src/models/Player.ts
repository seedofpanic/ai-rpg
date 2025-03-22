import { combatLogStore } from 'components/CombatLog';
import { makeAutoObservable } from 'mobx';
import { Vector2 } from 'utils/vector2';
import { Equipment, itemsData } from './itemsData';
import { MagicEffects } from './MagicEffects';

interface InventorySlot {
  itemId: string;
  quantity: number;
}

interface EquipmentStats {
  attackPower: number;
  defense: number;
  criticalChance: number;
  dodgeChance: number;
  health: number;
}

export class Player {
  speed = 20;
  position: Vector2;
  name: string;
  race: string;
  class: string;
  type: string;
  gold: number;
  inventory: InventorySlot[] = [];
  equipment: Equipment = {};
  baseHealth: number;
  health: number;
  baseAttackPower: number;
  baseDefense: number;
  baseCriticalChance: number;
  baseDodgeChance: number;
  private cachedEquipmentStats: EquipmentStats;
  magicEffects: MagicEffects;
  events = new Set<string>();
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
    wisdom: number;
    constitution: number;
    charisma: number;
  } = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    wisdom: 0,
    constitution: 0,
    charisma: 0,
  };

  // Computed stats (including equipment)
  get maxHealth(): number {
    return this.baseHealth + this.cachedEquipmentStats.health;
  }

  get attackPower(): number {
    return this.baseAttackPower + this.cachedEquipmentStats.attackPower;
  }

  get defense(): number {
    return this.baseDefense + this.cachedEquipmentStats.defense;
  }

  get criticalChance(): number {
    return this.baseCriticalChance + this.cachedEquipmentStats.criticalChance;
  }

  get dodgeChance(): number {
    return this.baseDodgeChance + this.cachedEquipmentStats.dodgeChance;
  }

  // utils
  lastUpdateTime = Date.now();
  combatMode = false;

  constructor(name: string, race: string, playerClass: string, type: string) {
    this.position = new Vector2(800, 550);
    this.name = name;
    this.race = race;
    this.class = playerClass;
    this.type = type;
    this.gold = 300;
    this.baseHealth = 100;
    this.baseAttackPower = 15;
    this.baseDefense = 5;
    this.baseCriticalChance = 0.1;
    this.baseDodgeChance = 0.05;
    this.cachedEquipmentStats = this.calculateEquipmentStats();
    const healthPotion = Array.from(itemsData).find(
      ([_, item]) => item.name === 'Health Potion',
    )?.[0];
    if (healthPotion) {
      this.addItemToInventory({
        itemId: healthPotion,
        quantity: 1,
      });
    }
    this.health = this.maxHealth;
    this.magicEffects = new MagicEffects(this);

    makeAutoObservable(this);
  }

  private calculateEquipmentStats(): EquipmentStats {
    const stats: EquipmentStats = {
      attackPower: 0,
      defense: 0,
      criticalChance: 0,
      dodgeChance: 0,
      health: 0,
    };

    // Calculate stats from all equipped items
    Object.values(this.equipment).forEach((itemId) => {
      const item = itemsData.get(itemId);
      if (!item?.stats) return;

      // Add all stats from the item
      Object.entries(item.stats).forEach(([stat, value]) => {
        if (value !== undefined) {
          stats[stat as keyof EquipmentStats] += value;
        }
      });
    });

    return stats;
  }

  private updateEquipmentStats() {
    this.cachedEquipmentStats = this.calculateEquipmentStats();
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

  setCombatMode(combatMode: boolean) {
    this.combatMode = combatMode;
  }

  doActions(
    keysDown: Set<string>,
    currentTime: number,
    dialogIsAcitve: boolean,
  ) {
    const delta = currentTime - this.lastUpdateTime;

    if (!dialogIsAcitve) {
      this.updateMovement(keysDown, delta);
      this.magicEffects.update(currentTime);
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
    }

    if (moveX || moveY) {
      this.position = this.position.add(
        new Vector2(moveX, moveY).normalize().multiply(this.speed),
      );
    }
  }

  updateGold(price: number) {
    this.gold += price;
  }

  equipItem(itemId: string) {
    const item = itemsData.get(itemId);
    if (!item) return false;

    // Check if item is equipment
    if (!item.equippableSlot) return false;

    // Get the slot type for this item
    const slot = item.equippableSlot;

    this.removeItemFromInventory({ itemId, quantity: 1 });

    // Unequip current item in that slot if any
    if (this.equipment[slot]) {
      this.unequipItem(slot);
    }

    // Equip the new item
    this.equipment[slot] = itemId;
    this.updateEquipmentStats();
    return true;
  }

  unequipItem(slot: keyof Equipment) {
    if (this.equipment[slot]) {
      const itemId = this.equipment[slot];
      this.equipment[slot] = undefined;
      this.addItemToInventory({ itemId, quantity: 1 });
      this.updateEquipmentStats();
    }
  }

  useItem(itemId: string) {
    const item = itemsData.get(itemId);
    this.magicEffects.useItem(itemId);
    if (item?.isUsable === 'single') {
      this.removeItemFromInventory({ itemId, quantity: 1 });
    }
  }

  getIntellectLevel() {
    if (this.stats.intelligence > 9) {
      return 'high intelligence';
    } else if (this.stats.intelligence > 7) {
      return 'medium intelligence';
    } else if (this.stats.intelligence > 5) {
      return 'low intelligence';
    } else if (this.stats.intelligence > 3) {
      return 'very low intelligence';
    } else if (this.stats.intelligence > 0) {
      return `can't speak`;
    } else {
      return '';
    }
  }
}
