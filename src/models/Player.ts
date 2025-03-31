import { combatLogStore } from 'components/CombatLog';
import { makeAutoObservable } from 'mobx';
import { Vector2 } from 'utils/vector2';
import { Equipment, itemsData } from './itemsData';
import { MagicEffects } from './MagicEffects';
import { Projectile } from './Projectile';
import { projectileStore } from './projectileStore';
import { Mob } from './mobs/mob';
import { NPC } from './npcs/npc';

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
  speed = 0.3;
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

  private movementCooldown: number = 0;

  // Attack timing variables
  private _isAttacking: boolean = false;
  private _attackTimer: number = 0;
  private _attackCooldown: number = 500; // 500ms (0.5 seconds) between attacks
  private _attackDamagePoint: number = 250; // Damage happens at 250ms (0.25 seconds) into the cycle
  private currentTarget: Mob | NPC | null = null;
  private _attackDoneThisCycle: boolean = false;
  private _arrowTarget: Vector2 | null = null;

  get attackDoneThisCycle(): boolean {
    return this._attackDoneThisCycle;
  }

  // Getters for attack visualization
  get isAttacking(): boolean {
    return this._isAttacking;
  }

  get attackTimer(): number {
    return this._attackTimer;
  }

  get attackCooldown(): number {
    return this._attackCooldown;
  }

  get attackDamagePoint(): number {
    return this._attackDamagePoint;
  }

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
  combatMode: 'melee' | 'ranged' = 'melee';
  lastShotTime: number = 0;
  shotCooldown: number = 500; // 500ms between shots

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

  updateArrowTarget(target: Vector2) {
    this._arrowTarget = target;
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

    const weapon = this.equipment['weapon']
      ? itemsData.get(this.equipment['weapon'])
      : null;

    if (weapon) {
      this.combatMode = weapon.mode || 'melee';
    }
  }

  addItemToInventory(item: InventorySlot) {
    const existingItem = this.inventory.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.inventory.push(item);
    }
  }

  addGold(amount: number) {
    this.gold += amount;
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

  meleeAttack(target: Mob | NPC) {
    if (!this.isCloseTo(target.position)) {
      console.log(`${this.name} is too far away to attack.`);
      combatLogStore.push(`${this.name} is too far away to attack.`);
      return;
    }

    this.currentTarget = target;
    this.attack();
  }

  rangedAttack(target: Vector2) {
    this._arrowTarget = target;
    this.attack();
  }

  attack() {
    // Store the target and start the attack process
    this._isAttacking = true;
    this._attackTimer = 0;
  }

  // Start attacking
  startAttack(target?: Mob | NPC | Vector2) {
    if (this.combatMode === 'ranged' && target instanceof Vector2) {
      this.rangedAttack(target);
    } else if (target instanceof Mob || target instanceof NPC) {
      this.meleeAttack(target);
    }
  }

  // Stop attacking when mouse button is released
  stopAttack() {
    this._isAttacking = false;
    this.currentTarget = null;
    this._attackTimer = 0;
  }

  // Execute a single attack against the stored target
  private executeAttack() {
    const currentTarget = this.currentTarget;

    if (!currentTarget) return;

    if (!this.isCloseTo(currentTarget.position)) {
      console.log(`${this.name} is too far away to attack.`);
      combatLogStore.push(`${this.name} is too far away to attack.`);
      return;
    }

    const isCritical = Math.random() < this.criticalChance;
    const damage = isCritical ? this.attackPower * 2 : this.attackPower;
    currentTarget.takeDamage(damage);
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  setPosition({ x, y }: { x: number; y: number }) {
    this.position = new Vector2(x, y);
  }

  setCombatMode(combatMode: 'melee' | 'ranged') {
    this.combatMode = combatMode;
  }

  doActions(keysDown: Set<string>, delta: number, dialogIsAcitve: boolean) {
    if (!dialogIsAcitve) {
      this.updateMovement(keysDown, delta);
      this.magicEffects.update(delta);
      this.updateAttack(delta);
    }
  }

  updateMovement(keysDown: Set<string>, delta: number) {
    let moveX = 0;
    let moveY = 0;
    // this.movementCooldown += ;
    // console.log(this.movementCooldown);

    // while (this.movementCooldown >= 100) {
    //   this.movementCooldown -= 100;

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
    // }

    if (moveX || moveY) {
      const moveVector = new Vector2(moveX, moveY)
        .normalize()
        .multiply(this.speed * delta);
      this.position = this.position.add(moveVector);
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

  private shootArrow() {
    if (!this._arrowTarget) return;

    const projectile = new Projectile(
      this.position,
      this._arrowTarget,
      0.5, // speed
      this.attackPower * 1.5, // damage based on attack power
      500, // range
    );

    projectileStore.addProjectile(projectile);
  }

  private updateAttack(delta: number) {
    if (!this._isAttacking) return;

    this._attackTimer += delta;

    // Apply damage at the damage point (0.25 seconds)
    if (
      !this._attackDoneThisCycle &&
      this._attackTimer >= this._attackDamagePoint &&
      this._attackTimer < this._attackCooldown
    ) {
      if (this.combatMode === 'melee' && !!this.currentTarget) {
        this.executeAttack();
      }

      console.log(this.combatMode, this._arrowTarget);
      if (this.combatMode === 'ranged' && !!this._arrowTarget) {
        this.shootArrow();
      }
      this._attackDoneThisCycle = true;
    }

    // Reset the timer when we reach the full cooldown (0.5 seconds)
    if (this._attackTimer >= this._attackCooldown) {
      this._attackTimer -= this._attackCooldown;
      this._attackDoneThisCycle = false;
    }
  }
}
