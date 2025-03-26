import { Vector2 } from 'utils/vector2';
import { makeAutoObservable } from 'mobx';
import { mobStore } from './mobStore';
import { npcStore } from './npcStore';

let nextId = 0;

export class Projectile {
  id: number;
  position: Vector2;
  direction: Vector2;
  speed: number;
  damage: number;
  range: number;
  distanceTraveled: number = 0;

  constructor(
    position: Vector2,
    targetPosition: Vector2,
    speed: number = 0.01,
    damage: number = 20,
    range: number = 500,
  ) {
    this.id = nextId++;
    this.position = position;
    this.direction = targetPosition.subtract(position).normalize();
    this.speed = speed;
    this.damage = damage;
    this.range = range;
    makeAutoObservable(this);
  }

  update(delta: number) {
    const distance = this.speed * delta;
    const movement = this.direction.multiply(distance);
    this.position = this.position.add(movement);
    this.distanceTraveled += distance;

    const element = document.elementFromPoint(this.position.x, this.position.y);
    const type = element?.getAttribute('data-type');

    if (type === 'mob') {
      const mob = mobStore.mobs[element?.getAttribute('id') as string];
      if (mob) {
        mob.takeDamage(this.damage);

        return true;
      }
    }

    if (type === 'npc') {
      const npc = npcStore.npcs[element?.getAttribute('id') as string];
      if (npc) {
        npc.takeDamage(this.damage);

        return true;
      }
    }
    return false;
  }

  hasReachedMaxRange(): boolean {
    return this.distanceTraveled >= this.range;
  }
}
