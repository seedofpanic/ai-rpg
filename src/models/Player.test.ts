import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from './Player';
import { Vector2 } from '../utils/vector2';
import { itemsData } from './itemsData';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('TestPlayer', 'Human', 'Warrior', 'Female');
    player.gold = 100;
  });

  it('should initialize with default values', () => {
    expect(player.name).toBe('TestPlayer');
    expect(player.race).toBe('Human');
    expect(player.class).toBe('Warrior');
    expect(player.health).toBe(100);
    expect(player.gold).toBe(100);
    expect(player.position).toEqual(new Vector2(800, 550));
  });

  it('should add items to inventory', () => {
    const baseInventoryLength = player.inventory.length;
    const itemId = Array.from(itemsData).find(
      ([_, item]) => item.name === 'Sword',
    )?.[0];
    if (!itemId) {
      throw new Error('Sword not found');
    }
    player.addItemToInventory({ itemId, quantity: 1 });
    expect(player.inventory).toHaveLength(baseInventoryLength + 1);
    expect(player.inventory).toEqual(
      expect.arrayContaining([{ itemId, quantity: 1 }]),
    );
  });

  it('should remove items from inventory', () => {
    player.addItemToInventory({ itemId: 'sword', quantity: 2 });
    player.removeItemFromInventory({ itemId: 'sword', quantity: 1 });
    expect(player.inventory[0].quantity).toBe(1);
  });

  it('should spend gold', () => {
    player.spendGold(50);
    expect(player.gold).toBe(50);
  });

  it('should not spend gold if insufficient', () => {
    player.spendGold(150);
    expect(player.gold).toBe(100);
  });

  it('should earn gold', () => {
    player.earnGold(50);
    expect(player.gold).toBe(150);
  });

  it('should take damage and reduce health', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    player.takeDamage(20);
    expect(player.health).toBe(85); // Considering default defense of 5
  });

  it('should dodge attacks based on dodgeChance', () => {
    player.baseDodgeChance = 1; // 100% dodge chance
    player.takeDamage(20);
    expect(player.health).toBe(100); // No damage taken
  });

  it('should attack a target and deal damage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const target = {
      health: 100,
      takeDamage: (damage: number) => {
        target.health -= damage;
      },
      position: new Vector2(player.position.x + 30, player.position.y + 30),
    };
    player.attack(target);
    expect(target.health).toBe(85); // Default attackPower is 10
  });

  it('should move based on keys pressed', () => {
    player.position = new Vector2(50, 50);
    const keysDown = new Set(['KeyW', 'KeyD']);
    const currentTime = Date.now() + 200; // Simulate time passed
    player.doActions(keysDown, currentTime, false);
    expect(player.position.x).toBeGreaterThan(50);
    expect(player.position.y).toBeLessThan(50);
  });

  it('should correctly determine if the player is close to a position', () => {
    player.position = new Vector2(50, 50);
    const position = new Vector2(60, 60);
    expect(player.isCloseTo(position)).toBe(true); // Within range
    const farPosition = new Vector2(200, 200);
    expect(player.isCloseTo(farPosition)).toBe(false); // Out of range
  });

  it('should toggle combat mode correctly', () => {
    expect(player.combatMode).toBe('melee');
    player.setCombatMode('ranged');
    expect(player.combatMode).toBe('ranged');
    player.setCombatMode('melee');
    expect(player.combatMode).toBe('melee');
  });

  it('should handle movement based on keys pressed', () => {
    player.position = new Vector2(50, 50);
    const keysDown = new Set(['KeyW', 'KeyD']);
    const currentTime = Date.now() + 200; // Simulate time passed
    player.doActions(keysDown, currentTime, false);
    expect(player.position.x).toBeGreaterThan(50);
    expect(player.position.y).toBeLessThan(50);
  });

  it('should not move if no keys are pressed', () => {
    player.position = new Vector2(50, 50);
    const keysDown = new Set<string>();
    const currentTime = Date.now() + 200; // Simulate time passed
    player.doActions(keysDown, currentTime, false);
    expect(player.position).toEqual(new Vector2(50, 50));
  });

  it('should not move if dialog is open', () => {
    player.position = new Vector2(50, 50);
    const keysDown = new Set<string>(['KeyW', 'KeyD']);
    const currentTime = Date.now() + 200; // Simulate time passed
    player.doActions(keysDown, currentTime, true);
    expect(player.position).toEqual(new Vector2(50, 50));
  });
});
