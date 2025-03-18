import { makeAutoObservable } from 'mobx';
import { Mob } from './mob';
import { locations } from './location';

class MobStore {
  mobs: Record<string, Mob> = {};
  mobIds: string[] = [];
  locations = locations;

  constructor() {
    makeAutoObservable(this);
    this.initializeMobs();
  }

  initializeMobs() {
    // Generate 5 random mobs initially
    const generatedMobs = Array.from({ length: 5 });

    if (import.meta.env.VITE_CI) {
      const mob = Mob.generateRandomMob(this.locations[0]);
      this.mobs[mob.id] = mob;
    } else {
      for (const _ of generatedMobs) {
        // Randomly select a location for each mob
        const location =
          this.locations[Math.floor(Math.random() * this.locations.length)];
        const mob = Mob.generateRandomMob(location);
        this.mobs[mob.id] = mob;
      }
    }

    this.mobIds = Object.keys(this.mobs);
  }

  addMob(mob: Mob) {
    this.mobs[mob.id] = mob;
    this.mobIds.push(mob.id);
  }

  removeMob(mobId: string) {
    delete this.mobs[mobId];
    this.mobIds = this.mobIds.filter((id) => id !== mobId);
  }

  getMob(mobId: string): Mob | undefined {
    return this.mobs[mobId];
  }

  // Spawn a new mob in a specific location
  spawnMob(location = this.locations[0]) {
    const mob = Mob.generateRandomMob(location);
    this.addMob(mob);
    return mob;
  }

  // Respawn mobs periodically if there are fewer than the initial count
  respawnMobs() {
    const minMobs = 5;
    if (this.mobIds.length < minMobs) {
      const location =
        this.locations[Math.floor(Math.random() * this.locations.length)];
      this.spawnMob(location);
    }
  }
}

export const mobStore = new MobStore();
