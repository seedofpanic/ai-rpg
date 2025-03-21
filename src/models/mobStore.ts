import { makeAutoObservable } from 'mobx';
import { Mob, MobType, mobTypes } from './mob';
import { locationsStore, Location } from './location';

class MobStore {
  mobs: Record<string, Mob> = {};
  mobIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeMobs();
  }

  initializeMobs() {
    // Generate 5 random mobs initially
    if (import.meta.env.VITE_CI) {
      const randomMobType =
        mobTypes[Math.floor(Math.random() * mobTypes.length)];
      const mob = Mob.generateRandomMob(
        locationsStore.locations[0],
        randomMobType,
      );
      this.mobs[mob.id] = mob;
    }
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
  spawnMob(location = locationsStore.locations[0], mobType: MobType) {
    const mob = Mob.generateRandomMob(location, mobType);
    this.addMob(mob);
    return mob;
  }

  // Respawn mobs periodically if there are fewer than the initial count
  respawnMob(mob: Mob) {
    const location = mob.location;
    const possibleMobTypes = location.monstersTemplate.map(
      (template) => template.type,
    );
    const randomMobType =
      possibleMobTypes[Math.floor(Math.random() * possibleMobTypes.length)];
    this.spawnMob(location, randomMobType);
  }

  generateRandomMob(loc: Location, mobType: MobType): Mob {
    const mob = Mob.generateRandomMob(loc, mobType);
    this.addMob(mob);
    return mob;
  }

  reset() {
    this.mobs = {};
    this.mobIds = [];
  }
}

export const mobStore = new MobStore();
