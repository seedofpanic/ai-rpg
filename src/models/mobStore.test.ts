import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mobStore as MobStoreInstance } from './mobStore';
import { Mob } from './mob';
import { Location } from './location';

describe('MobStore', () => {
  let mobStore: typeof MobStoreInstance;
  let testLocation: Location;

  beforeEach(() => {
    // Mock the environment variable to ensure consistent testing
    vi.stubEnv('VITE_CI', 'true');

    testLocation = {
      name: 'Test Location',
      description: 'A test location',
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      npcs: [],
    };

    mobStore = MobStoreInstance;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // don't test VITE_CI mode

  describe('Mob Management', () => {
    it('should add a new mob correctly', () => {
      const newMob = new Mob('wolf', 100, 100, testLocation);
      const initialMobCount = mobStore.mobIds.length;

      mobStore.addMob(newMob);

      expect(mobStore.mobs[newMob.id]).toBe(newMob);
      expect(mobStore.mobIds.length).toBe(initialMobCount + 1);
      expect(mobStore.mobIds).toContain(newMob.id);
    });

    it('should remove a mob correctly', () => {
      const mobId = mobStore.mobIds[0];
      const initialMobCount = mobStore.mobIds.length;

      mobStore.removeMob(mobId);

      expect(mobStore.mobs[mobId]).toBeUndefined();
      expect(mobStore.mobIds.length).toBe(initialMobCount - 1);
      expect(mobStore.mobIds).not.toContain(mobId);
    });

    it('should get a mob by id', () => {
      const mobId = mobStore.mobIds[0];
      const mob = mobStore.getMob(mobId);

      expect(mob).toBeDefined();
      expect(mob?.id).toBe(mobId);
    });

    it('should return undefined for non-existent mob id', () => {
      const mob = mobStore.getMob('non-existent-id');
      expect(mob).toBeUndefined();
    });
  });

  describe('Mob Spawning', () => {
    it('should spawn a new mob in the specified location', () => {
      const initialMobCount = mobStore.mobIds.length;
      const newMob = mobStore.spawnMob(testLocation);

      expect(newMob).toBeDefined();
      expect(newMob.location).toEqual(testLocation);
      expect(mobStore.mobIds.length).toBe(initialMobCount + 1);
      expect(mobStore.mobs[newMob.id]).toBe(newMob);
    });

    it('should respawn mobs correctly', () => {
      const initialMobIds = [...mobStore.mobIds];

      // Kill all mobs
      initialMobIds.forEach((id) => {
        const mob = mobStore.getMob(id);
        if (mob) {
          mob.takeDamage(mob.maxHealth);
        }
      });

      mobStore.mobIds.length = 0;
      mobStore.respawnMobs();

      // Check that new mobs were spawned
      expect(mobStore.mobIds.length).toBeGreaterThan(0);
      // Verify that the new mobs are different from the old ones
      expect(mobStore.mobIds).not.toEqual(initialMobIds);
    });
  });
});
