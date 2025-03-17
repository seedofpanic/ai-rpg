import { makeAutoObservable } from 'mobx';
import { Vector2 } from '../utils/vector2';
import { Location } from './location';
import { Player } from './Player';
import { v4 as uuidv4 } from 'uuid';
import { itemsData } from './itemsData';

export type MobType = 'wolf' | 'bandit' | 'zombie' | 'skeleton';

// Loot tables for each mob type
const MOB_LOOT: Record<MobType, Array<{
  itemName: string;
  chance: number; // Chance from 0 to 1
  quantity: [number, number]; // [min, max]
}>> = {
  wolf: [
    { itemName: 'Wolf Pelt', chance: 0.8, quantity: [1, 1] },
    { itemName: 'Wolf Fang', chance: 0.6, quantity: [1, 2] },
    { itemName: 'Raw Meat', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Leather', chance: 0.4, quantity: [1, 2] }
  ],
  bandit: [
    { itemName: 'Dagger', chance: 0.4, quantity: [1, 1] },
    { itemName: 'Leather Armor', chance: 0.3, quantity: [1, 1] },
    { itemName: 'Health Potion', chance: 0.5, quantity: [1, 2] },
    { itemName: 'Stolen Goods', chance: 0.6, quantity: [1, 3] }
  ],
  zombie: [
    { itemName: 'Rotten Flesh', chance: 0.9, quantity: [1, 3] },
    { itemName: 'Tattered Cloth', chance: 0.7, quantity: [1, 2] },
    { itemName: 'Bone', chance: 0.5, quantity: [1, 3] },
    { itemName: 'Ancient Coin', chance: 0.2, quantity: [1, 5] }
  ],
  skeleton: [
    { itemName: 'Bone', chance: 0.9, quantity: [2, 4] },
    { itemName: 'Arrow', chance: 0.7, quantity: [5, 15] },
    { itemName: 'Bow', chance: 0.3, quantity: [1, 1] },
    { itemName: 'Ancient Coin', chance: 0.3, quantity: [1, 5] }
  ]
};

export const MOB_STATS: Record<MobType, {
  health: number;
  attackPower: number;
  defense: number;
  speed: number;
  aggroRange: number;
  criticalChance: number;
  dodgeChance: number;
}> = {
  wolf: {
    health: 80,
    attackPower: 15,
    defense: 3,
    speed: 15,
    aggroRange: 150,
    criticalChance: 0.15,
    dodgeChance: 0.1
  },
  bandit: {
    health: 100,
    attackPower: 12,
    defense: 5,
    speed: 10,
    aggroRange: 120,
    criticalChance: 0.1,
    dodgeChance: 0.05
  },
  zombie: {
    health: 120,
    attackPower: 10,
    defense: 8,
    speed: 7,
    aggroRange: 100,
    criticalChance: 0.05,
    dodgeChance: 0.02
  },
  skeleton: {
    health: 90,
    attackPower: 13,
    defense: 4,
    speed: 12,
    aggroRange: 130,
    criticalChance: 0.12,
    dodgeChance: 0.08
  }
};

export class Mob {
  id: string;
  position: Vector2;
  name: string;
  mobType: MobType;
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

  constructor(
    mobType: MobType,
    x: number,
    y: number,
    location: Location
  ) {
    const stats = MOB_STATS[mobType];
    this.id = uuidv4();
    this.mobType = mobType;
    this.name = `${mobType.charAt(0).toUpperCase() + mobType.slice(1)}`;
    this.position = new Vector2(x, y);
    this.patrolPoint = new Vector2(x, y);
    this.location = location;
    
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
    const lootTable = MOB_LOOT[this.mobType];
    this.inventory = [];

    for (const lootEntry of lootTable) {
      if (Math.random() < lootEntry.chance) {
        // Roll for quantity
        const [min, max] = lootEntry.quantity;
        const quantity = Math.floor(Math.random() * (max - min + 1)) + min;

        // Find the item ID by name
        const itemEntry = Array.from(itemsData.entries()).find(
          ([_, item]) => item.name === lootEntry.itemName
        );

        if (itemEntry) {
          this.inventory.push({
            itemId: itemEntry[0],
            quantity
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
  }

  attack(target: Player): void {
    if (!this.isAlive()) return;

    let damage = this.attackPower;
    if (Math.random() < this.criticalChance) {
      damage *= 2; // Critical hit
    }

    target.takeDamage(damage);
  }

  doActions(player: Player, currentTime: number): void {
    if (!this.isAlive()) {
      return;
    }

    const delta = currentTime - this.lastUpdateTime;
    if (delta >= 100) {
      this.lastUpdateTime = currentTime;

      // Calculate distance to player
      const distanceToPlayer = player.position.subtract(this.position).magnitude();
      
      // Check if player is in aggro range
      if (distanceToPlayer <= this.aggroRange) {
        this.isAggressive = true;
        this.state = 'chasing';
        
        // Move towards player
        const direction = player.position.subtract(this.position).normalize();
        const movement = direction.multiply(this.speed);
        this.position = this.position.add(movement);

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

        // Patrol behavior
        const patrolDelta = currentTime - this.lastPatrolTime;
        if (patrolDelta >= 200) { // Change patrol direction every 3 seconds
          this.lastPatrolTime = currentTime;
          const angle = Math.random() * Math.PI * 2;
          const patrolDirection = new Vector2(
            Math.cos(angle),
            Math.sin(angle)
          );
          
          // Stay within patrol radius of spawn point
          const distanceToSpawn = this.position.subtract(this.patrolPoint).magnitude();
          if (distanceToSpawn > this.patrolRadius) {
            // Move back towards spawn point
            const toSpawn = this.patrolPoint.subtract(this.position).normalize();
            this.position = this.position.add(toSpawn.multiply(this.speed));
          } else {
            // Normal patrol movement
            this.position = this.position.add(patrolDirection.multiply(this.speed));
          }
        }
      }
    }
  }

  addItem(item: { itemId: string; quantity: number }): void {
    const existingItem = this.inventory.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.inventory.push({ ...item });
    }
  }

  removeItem(item: { itemId: string; quantity: number }): void {
    const existingItem = this.inventory.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity -= item.quantity;
      if (existingItem.quantity <= 0) {
        this.inventory = this.inventory.filter(i => i.itemId !== item.itemId);
      }
    }
  }

  static generateRandomMob(location: Location): Mob {
    const mobTypes: MobType[] = ['wolf', 'bandit', 'zombie', 'skeleton'];
    const randomType = mobTypes[Math.floor(Math.random() * mobTypes.length)];
    
    const x = location.x + Math.floor(Math.random() * (location.width - 40));
    const y = location.y + Math.floor(Math.random() * (location.height - 40));
    
    return new Mob(randomType, x, y, location);
  }
} 