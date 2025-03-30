import { makeAutoObservable } from 'mobx';
import { Vector2 } from '../../utils/vector2';
import { Location } from '../location';
import { Player } from '../Player';
import { v4 as uuidv4 } from 'uuid';
import { itemsData } from '../itemsData';
import { MOB_STATS } from './mobStats';

export type MobType =
  | 'wolf'
  | 'bandit'
  | 'zombie'
  | 'skeleton'
  | 'ghost'
  | 'goblin'
  | 'boar'
  | 'spider'
  | 'bat';

// Loot tables for each mob type
const MOB_LOOT: Record<
  MobType,
  Array<{
    itemName: string;
    chance: number; // Chance from 0 to 1
    quantity: [number, number]; // [min, max]
  }>
> = {
  wolf: [
    { itemName: 'Wolf Pelt', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Wolf Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] },
  ],
  bandit: [
    { itemName: 'Dagger', chance: 0.4, quantity: [1, 1] },
    { itemName: 'Leather Armor', chance: 0.3, quantity: [1, 1] },
    { itemName: 'Health Potion', chance: 0.5, quantity: [1, 2] },
    { itemName: 'Stolen Goods', chance: 0.6, quantity: [1, 3] },
  ],
  zombie: [
    { itemName: 'Rotten Flesh', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Tattered Cloth', chance: 0.7, quantity: [1, 2] },
    { itemName: 'Bone', chance: 0.5, quantity: [1, 3] },
    { itemName: 'Ancient Coin', chance: 0.2, quantity: [1, 5] },
  ],
  skeleton: [
    { itemName: 'Bone', chance: 0.9, quantity: [2, 4] },
    { itemName: 'Arrow', chance: 0.7, quantity: [5, 15] },
    { itemName: 'Bow', chance: 0.3, quantity: [1, 1] },
    { itemName: 'Ancient Coin', chance: 0.3, quantity: [1, 5] },
  ],
  ghost: [
    { itemName: 'Ghostly Essence', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Spirit Stone', chance: 0.5, quantity: [1, 2] },
    { itemName: 'Ghostly Potion', chance: 0.7, quantity: [1, 2] },
  ],
  goblin: [
    { itemName: 'Goblin Pelt', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Goblin Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] },
  ],
  boar: [
    { itemName: 'Boar Pelt', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Boar Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] },
  ],
  spider: [
    { itemName: 'Spider Silk', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Spider Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] },
  ],
  bat: [
    { itemName: 'Bat Wing', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Bat Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] },
  ],
};

export const mobTypes: MobType[] = [
  'wolf',
  'bandit',
  'zombie',
  'skeleton',
  'ghost',
  'goblin',
  'boar',
  'spider',
  'bat',
];

export class Mob {
  id: string;
  position: Vector2;
  name: string;
  type: MobType;
  health: number;
  maxHealth: number;
  attackPower: number;
  defense: number;
  speed: number;
  aggroRange: number;
  criticalChance: number;
  dodgeChance: number;
  isAggressive: boolean = false;
  lastUpdateTime: number = Date.now();
  lastPatrolTime: number = Date.now();
  patrolPoint: Vector2;
  patrolRadius: number = 100;
  attackReady: number = 0;
  state: 'patrolling' | 'chasing' | 'attacking' = 'patrolling';
  location: Location;
  inventory: { itemId: string; quantity: number }[] = [];

  private actionCooldown: number = 0;
  private patrolDirection: Vector2 = new Vector2(0, 0);
  private patrolPoints: Vector2[] = [];
  private currentPatrolIndex: number = 0;
  private patrolPointReachedThreshold: number = 10; // Distance at which we consider a patrol point reached
  constructor(mobType: MobType, x: number, y: number, location: Location) {
    const stats = MOB_STATS[mobType];
    this.id = uuidv4();
    this.type = mobType;
    this.name = `${mobType.charAt(0).toUpperCase() + mobType.slice(1)}`;
    this.position = new Vector2(x, y);
    this.patrolPoint = new Vector2(x, y);
    this.location = location;
    this.generatePatrolPoints();

    // Initialize stats
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.attackPower = stats.attackPower;
    this.defense = stats.defense;
    this.speed = stats.speed;
    this.aggroRange = stats.aggroRange;
    this.criticalChance = stats.criticalChance;
    this.dodgeChance = stats.dodgeChance;

    // Generate initial loot
    this.generateLoot();

    makeAutoObservable(this);
  }

  private generateLoot(): void {
    const lootTable = MOB_LOOT[this.type];
    this.inventory = [];

    for (const lootEntry of lootTable) {
      if (Math.random() < lootEntry.chance) {
        // Roll for quantity
        const [min, max] = lootEntry.quantity;
        const quantity = Math.floor(Math.random() * (max - min + 1)) + min;

        // Find the item ID by name
        const itemEntry = Array.from(itemsData).find(
          ([_, item]) => item.name === lootEntry.itemName,
        );

        if (itemEntry) {
          this.inventory.push({
            itemId: itemEntry[0],
            quantity,
          });
        }
      }
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  takeDamage(damage: number): void {
    if (Math.random() < this.dodgeChance) {
      return; // Attack dodged
    }

    const actualDamage = Math.max(1, damage - this.defense);
    this.health = Math.max(0, this.health - actualDamage);
    this.isAggressive = true;
  }

  attack(target: Player): void {
    if (!this.isAlive()) return;

    let damage = this.attackPower;
    if (Math.random() < this.criticalChance) {
      damage *= 2; // Critical hit
    }

    target.takeDamage(damage);
  }

  doActions(player: Player, delta: number): void {
    if (!this.isAlive()) {
      return;
    }

    this.actionCooldown += delta;
    if (this.actionCooldown >= 120) {
      this.actionCooldown -= 120;

      // Calculate distance to player
      const distanceToPlayer = player.position
        .subtract(this.position)
        .magnitude();

      // Check if player is in aggro range
      if (
        distanceToPlayer <=
        (this.isAggressive ? this.aggroRange * 5 : this.aggroRange)
      ) {
        this.isAggressive = true;
        this.state = 'chasing';

        if (distanceToPlayer > 50) {
          // Move towards player
          const direction = player.position.subtract(this.position).normalize();
          const movement = direction.multiply(this.speed * 4.5);
          this.position = this.position.add(movement);
        }

        // Attack if in range
        if (distanceToPlayer <= 50) {
          if (this.attackReady === 0) {
            this.attack(player);
            this.attackReady = 5;
          } else {
            this.attackReady--;
          }
        }
      } else {
        // Reset aggression if player is far away
        if (this.isAggressive) {
          this.isAggressive = false;
          this.state = 'patrolling';
        }

        if (this.state === 'patrolling') {
          this.updatePatrolDirection();
          // Normal patrol movement
          this.position = this.position.add(
            this.patrolDirection.multiply(this.speed),
          );
        }
      }
    }
  }

  private generatePatrolPoints(): void {
    this.patrolPoints = [];
    const numPoints = 3 + Math.floor(Math.random() * 3); // 3-5 patrol points

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = this.patrolRadius * (0.5 + Math.random() * 0.5); // Random radius between 50% and 100% of patrolRadius
      const x = this.patrolPoint.x + Math.cos(angle) * radius;
      const y = this.patrolPoint.y + Math.sin(angle) * radius;

      // Ensure patrol points stay within location bounds
      const boundedX = Math.max(
        this.location.x,
        Math.min(this.location.x + this.location.width - 40, x),
      );
      const boundedY = Math.max(
        this.location.y,
        Math.min(this.location.y + this.location.height - 40, y),
      );

      this.patrolPoints.push(new Vector2(boundedX, boundedY));
    }
  }

  private updatePatrolDirection(): void {
    if (this.patrolPoints.length === 0) {
      this.generatePatrolPoints();
    }

    const currentTarget = this.patrolPoints[this.currentPatrolIndex];
    const distanceToTarget = this.position.subtract(currentTarget).magnitude();

    if (distanceToTarget < this.patrolPointReachedThreshold) {
      // Move to next patrol point
      this.currentPatrolIndex =
        (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      return;
    }

    // Calculate direction to next patrol point
    this.patrolDirection = currentTarget.subtract(this.position).normalize();
  }

  addItem(item: { itemId: string; quantity: number }): void {
    const existingItem = this.inventory.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.inventory.push({ ...item });
    }
  }

  removeItem(item: { itemId: string; quantity: number }): void {
    const existingItem = this.inventory.find((i) => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity -= item.quantity;
      if (existingItem.quantity <= 0) {
        this.inventory = this.inventory.filter((i) => i.itemId !== item.itemId);
      }
    }
  }

  static generateRandomMob(location: Location, mobType: MobType): Mob {
    const x = location.x + Math.floor(Math.random() * (location.width - 40));
    const y = location.y + Math.floor(Math.random() * (location.height - 40));

    return new Mob(mobType, x, y, location);
  }

  setInventory(inventory: { itemId: string; quantity: number }[]): void {
    this.inventory = inventory;
  }
}
