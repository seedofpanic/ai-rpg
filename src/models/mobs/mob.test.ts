import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mob } from 'models/mobs/mob';
import { Location } from 'models/location';
import { Player } from 'models/Player';
import { Vector2 } from 'utils/vector2';

describe('Mob', () => {
  let testLocation: Location;
  let testMob: Mob;
  let player: Player;

  beforeEach(() => {
    // Mock location
    testLocation = new Location({
      name: 'Test Location',
      description: 'A test location',
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      npcsTemplate: [],
      monstersTemplate: [],
    });

    // Create a test mob
    testMob = new Mob('wolf', 100, 100, testLocation);
    testMob.lastUpdateTime = Date.now() - 1000;

    // Create a test player
    player = new Player('TestPlayer', 'Human', 'Warrior', 'Male');
    player.position = new Vector2(150, 150);
  });

  describe('Initialization', () => {
    it('should create a mob with correct properties', () => {
      expect(testMob.type).toBe('wolf');
      expect(testMob.position).toEqual(new Vector2(100, 100));
      expect(testMob.location).toEqual(testLocation);
      expect(testMob.isAlive()).toBe(true);
      expect(testMob.state).toBe('patrolling');
    });

    it('should generate a random mob correctly', () => {
      const randomMob = Mob.generateRandomMob(testLocation, 'wolf');
      expect(randomMob).toBeInstanceOf(Mob);
      expect(['wolf', 'bandit', 'zombie', 'skeleton']).toContain(
        randomMob.type,
      );
      expect(randomMob.position.x).toBeGreaterThanOrEqual(0);
      expect(randomMob.position.x).toBeLessThanOrEqual(testLocation.width);
      expect(randomMob.position.y).toBeGreaterThanOrEqual(0);
      expect(randomMob.position.y).toBeLessThanOrEqual(testLocation.height);
    });
  });

  describe('Combat', () => {
    it('should take damage correctly', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const initialHealth = testMob.health;
      testMob.takeDamage(10);
      expect(testMob.health).toBe(initialHealth - 10 + testMob.defense);
    });

    it('should die when health reaches 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      testMob.defense = 0;
      testMob.takeDamage(testMob.maxHealth);
      expect(testMob.isAlive()).toBe(false);
    });

    it('should attack player and deal damage', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const initialPlayerHealth = player.health;
      testMob.attack(player);
      expect(player.health).toBeLessThan(initialPlayerHealth);
    });

    it('should be aggrasive if attacked', () => {
      testMob.takeDamage(10);
      expect(testMob.isAggressive).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should change state based on player distance', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      // Place player within aggro range
      player.position = new Vector2(
        testMob.position.x + testMob.aggroRange / 2,
        testMob.position.y,
      );
      testMob.doActions(player, Date.now());
      expect(testMob.state).toBe('chasing');

      // Move player far away
      player.position = new Vector2(
        testMob.position.x + testMob.aggroRange * 6,
        testMob.position.y,
      );
      testMob.doActions(player, Date.now() + 200);
      expect(testMob.state).toBe('patrolling');
    });
  });

  describe('Inventory and Loot', () => {
    it('should add and remove items correctly', () => {
      const testItem = { itemId: 'test-item', quantity: 1 };
      testMob.addItem(testItem);
      expect(testMob.inventory).toContainEqual(testItem);

      testMob.removeItem(testItem);
      expect(testMob.inventory).not.toContainEqual(testItem);
    });

    it('should generate loot when dying', () => {
      testMob.takeDamage(testMob.maxHealth);
      expect(testMob.inventory.length).toBeGreaterThan(0);
    });
  });

  describe('Movement', () => {
    it('should update patrol point periodically', () => {
      const initialPosition = testMob.position;

      player.position = new Vector2(
        testMob.position.x + testMob.aggroRange + 10,
        testMob.position.y,
      );

      // Fast forward time to trigger patrol update
      testMob.doActions(player, Date.now() + 1000);

      expect(testMob.position).not.toEqual(initialPosition);
    });

    it('should move towards player when chasing', () => {
      // Place player within aggro range
      player.position = new Vector2(
        testMob.position.x + testMob.aggroRange / 2,
        testMob.position.y,
      );

      const initialPosition = new Vector2(
        testMob.position.x,
        testMob.position.y,
      );
      testMob.doActions(player, Date.now());

      expect(testMob.position).not.toEqual(initialPosition);
      const distanceToPlayerBefore = Math.sqrt(
        Math.pow(initialPosition.x - player.position.x, 2) +
          Math.pow(initialPosition.y - player.position.y, 2),
      );
      const distanceToPlayerAfter = Math.sqrt(
        Math.pow(testMob.position.x - player.position.x, 2) +
          Math.pow(testMob.position.y - player.position.y, 2),
      );
      expect(distanceToPlayerAfter).toBeLessThan(distanceToPlayerBefore);
    });
  });
});
