import { makeAutoObservable } from 'mobx';
import { combatLogStore } from 'components/CombatLog';
import { Player } from './Player';
import { itemsData } from './itemsData';

export interface Effect {
  type: 'heal' | 'buff' | 'debuff' | 'damage';
  value: number;
  duration?: number; // in milliseconds
  startTime?: number;
  source: string;
}

export class MagicEffects {
  private activeEffects: Map<string, Effect[]> = new Map();
  private player: Player;

  constructor(player: Player) {
    this.player = player;
    makeAutoObservable(this);
  }

  applyEffect(targetId: string, effect: Effect) {
    if (!this.activeEffects.has(targetId)) {
      this.activeEffects.set(targetId, []);
    }

    const effects = this.activeEffects.get(targetId)!;
    effects.push({
      ...effect,
      startTime: Date.now(),
    });

    this.processEffect(targetId, effect);
  }

  private processEffect(targetId: string, effect: Effect) {
    switch (effect.type) {
      case 'heal':
        this.handleHeal(targetId, effect);
        break;
      case 'buff':
        this.handleBuff(targetId, effect);
        break;
      case 'debuff':
        this.handleDebuff(targetId, effect);
        break;
      case 'damage':
        this.handleDamage(targetId, effect);
        break;
    }
  }

  private handleHeal(targetId: string, effect: Effect) {
    if (targetId === this.player.name) {
      const healAmount = effect.value;
      this.player.baseHealth = Math.min(
        this.player.health + healAmount,
        this.player.health,
      );
      combatLogStore.push(`${this.player.name} healed for ${healAmount} HP!`);
    }
  }

  private handleBuff(targetId: string, effect: Effect) {
    if (targetId === this.player.name) {
      this.player.baseAttackPower += effect.value;
      combatLogStore.push(`${this.player.name} buffed for ${effect.value} AP!`);
    }
  }

  private handleDebuff(targetId: string, effect: Effect) {
    if (targetId === this.player.name) {
      this.player.baseAttackPower -= effect.value;
      combatLogStore.push(
        `${this.player.name} debuffed for ${effect.value} AP!`,
      );
    }
  }

  private handleDamage(targetId: string, effect: Effect) {
    if (targetId === this.player.name) {
      this.player.takeDamage(effect.value);
    }
  }

  update(currentTime: number) {
    this.activeEffects.forEach((effects, targetId) => {
      effects.forEach((effect, index) => {
        if (effect.duration && effect.startTime) {
          const elapsed = currentTime - effect.startTime;
          if (elapsed >= effect.duration) {
            effects.splice(index, 1);
          }
        }
      });

      if (effects.length === 0) {
        this.activeEffects.delete(targetId);
      }
    });
  }

  useItem(itemId: string) {
    const item = itemsData.get(itemId);
    if (!item?.effect || !item.isUsable) {
      return false;
    }

    this.applyEffect(this.player.name, {
      type: item.effect.type,
      value: item.effect.value,
      source: item.name,
    });
  }
}
