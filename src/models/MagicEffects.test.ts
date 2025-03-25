import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MagicEffects, Effect } from './MagicEffects';
import { Player } from './Player';
import { combatLogStore } from 'components/CombatLog';

// Mock the combatLogStore
vi.mock('components/CombatLog', () => ({
  combatLogStore: {
    log: [],
    push: vi.fn(),
  },
}));

vi.mock('./itemsData', () => ({
  itemsData: new Map([
    [
      'healthPotion',
      {
        name: 'Health Potion',
        effect: {
          type: 'heal',
          value: 50,
        },
        isUsable: true,
      },
    ],
    [
      'strengthPotion',
      {
        name: 'Strength Potion',
        effect: {
          type: 'buff',
          value: 10,
          duration: 5000,
        },
        isUsable: true,
      },
    ],
  ]),
}));

describe('MagicEffects', () => {
  let player: Player;
  let magicEffects: MagicEffects;

  beforeEach(() => {
    player = new Player('TestPlayer', 'Human', 'warrior', 'Male');
    magicEffects = new MagicEffects(player);
    vi.clearAllMocks();
  });

  describe('getActiveEffects', () => {
    it('should return empty map initially', () => {
      expect(magicEffects.getActiveEffects().size).toBe(0);
    });
  });

  describe('applyEffect', () => {
    it('should add effect to activeEffects map', () => {
      const effect: Effect = {
        type: 'heal',
        value: 50,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);
      const effects = magicEffects.getActiveEffects().get(player.name);

      expect(effects).toBeDefined();
      expect(effects![0].type).toBe('heal');
      expect(effects![0].value).toBe(50);
      expect(effects![0].startTime).toBeDefined();
    });
  });

  describe('healing effects', () => {
    it('should heal player and log the healing', () => {
      player.health = 50;
      const effect: Effect = {
        type: 'heal',
        value: 30,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);

      expect(player.health).toBe(80);
      expect(combatLogStore.push).toHaveBeenCalledWith(
        'TestPlayer healed for 30 HP!',
      );
    });

    it('should not heal beyond max health', () => {
      player.health = 90;
      const effect: Effect = {
        type: 'heal',
        value: 30,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);

      expect(player.health).toBe(100);
    });
  });

  describe('buff effects', () => {
    it('should increase player attack power', () => {
      const initialAP = player.baseAttackPower;
      const effect: Effect = {
        type: 'buff',
        value: 10,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);

      expect(player.baseAttackPower).toBe(initialAP + 10);
      expect(combatLogStore.push).toHaveBeenCalledWith(
        'TestPlayer buffed for 10 AP!',
      );
    });
  });

  describe('debuff effects', () => {
    it('should decrease player attack power', () => {
      const initialAP = player.baseAttackPower;
      const effect: Effect = {
        type: 'debuff',
        value: 5,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);

      expect(player.baseAttackPower).toBe(initialAP - 5);
      expect(combatLogStore.push).toHaveBeenCalledWith(
        'TestPlayer debuffed for 5 AP!',
      );
    });
  });

  describe('damage effects', () => {
    it('should damage the player', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      player.health = 100;
      const effect: Effect = {
        type: 'damage',
        value: 20,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);

      expect(player.health).toBe(85);
    });
  });

  describe('update', () => {
    it('should remove expired effects', () => {
      const effect: Effect = {
        type: 'buff',
        value: 10,
        duration: 1000,
        source: 'Test',
      };

      magicEffects.applyEffect(player.name, effect);
      expect(magicEffects.getActiveEffects().get(player.name)?.length).toBe(1);

      // Fast forward time
      magicEffects.update(Date.now() + 2000);
      expect(magicEffects.getActiveEffects().has(player.name)).toBe(false);
    });
  });

  describe('useItem', () => {
    it('should apply instant effect from item', () => {
      player.health = 50;
      magicEffects.useItem('healthPotion');

      expect(player.health).toBe(100);
    });

    it('should apply duration effect from item', () => {
      const initialAP = player.baseAttackPower;
      magicEffects.useItem('strengthPotion');

      expect(player.baseAttackPower).toBe(initialAP + 10);
      expect(magicEffects.getActiveEffects().get(player.name)?.length).toBe(1);
    });

    it('should return false for non-usable or non-existent items', () => {
      const result = magicEffects.useItem('nonExistentItem');
      expect(result).toBe(false);
    });
  });
});
