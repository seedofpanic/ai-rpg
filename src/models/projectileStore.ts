import { makeAutoObservable } from 'mobx';
import { Projectile } from './Projectile';

let timer: NodeJS.Timeout | null = null;
let lastUpdateTime = Date.now();

export class ProjectileStore {
  projectiles = new Set<Projectile>();

  constructor() {
    makeAutoObservable(this);
  }

  addProjectile(projectile: Projectile) {
    this.projectiles.add(projectile);
  }

  updateProjectiles(delta: number) {
    this.projectiles.forEach((projectile) => {
      if (projectile.update(delta) || projectile.hasReachedMaxRange()) {
        this.projectiles.delete(projectile);
      }
    });
  }

  startTimer() {
    timer = setInterval(() => {
      const currentTime = Date.now();
      const delta = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;

      this.updateProjectiles(delta);
    }, 30);
  }

  reset() {
    if (timer) {
      clearInterval(timer);
    }
    this.projectiles.clear();
  }
}

export const projectileStore = new ProjectileStore();
