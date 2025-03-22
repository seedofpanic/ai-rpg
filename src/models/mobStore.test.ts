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

    testLocation = new Location({
      name: 'Test Location',
      description: 'A test location',
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'wolf', minQuantity: 1, maxQuantity: 1 },
        { type: 'bandit', minQuantity: 1, maxQuantity: 1 },
      ],
    });

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
      const newMob = mobStore.spawnMob(testLocation, 'wolf');

      expect(newMob).toBeDefined();
      expect(newMob.location).toEqual(testLocation);
      expect(mobStore.mobIds.length).toBe(initialMobCount + 1);
      expect(mobStore.mobs[newMob.id]).toBe(newMob);
    });

    it('should respawn mobs correctly', () => {
      // Create a test location with specific monster templates
      const testLocationWithMonsters = new Location({
        name: 'Test Location With Monsters',
        description: 'A test location with monsters',
        x: 0,
        y: 0,
        width: 1000,
        height: 1000,
        npcsTemplate: [],
        monstersTemplate: [
          { type: 'wolf', minQuantity: 1, maxQuantity: 1 },
          { type: 'bandit', minQuantity: 1, maxQuantity: 1 },
        ],
      });

      // Add a mob to the store
      const initialMob = new Mob('wolf', 100, 100, testLocationWithMonsters);
      mobStore.addMob(initialMob);

      // Kill the mob
      initialMob.takeDamage(initialMob.maxHealth);

      // Respawn the mob
      mobStore.respawnMob(initialMob);

      // Get the newly spawned mob (it should be the last one in the array)
      const newMobId = mobStore.mobIds[mobStore.mobIds.length - 1];
      const newMob = mobStore.getMob(newMobId);

      // Verify the new mob
      expect(newMob).toBeDefined();
      expect(newMob?.id).not.toBe(initialMob.id);
      expect(newMob?.location).toBe(testLocationWithMonsters);
      expect(newMob?.isAlive()).toBe(true);
      expect(newMob?.health).toBe(newMob?.maxHealth);

      // Verify the mob type is from the location's monster template
      const possibleTypes = testLocationWithMonsters.monstersTemplate.map(
        (t) => t.type,
      );
      expect(possibleTypes).toContain(newMob?.type);

      // Clean up
      mobStore.removeMob(initialMob.id);
      mobStore.removeMob(newMobId);
    });
  });
});
