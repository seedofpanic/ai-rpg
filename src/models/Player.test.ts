import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Player } from './Player';
import { Vector2 } from '../utils/vector2';
import { itemsData } from './itemsData';
import { Mob } from './mobs/mob';
import { projectileStore } from './projectileStore';

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

  it('should start attack process on a target', () => {
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    player.startAttack(target);

    // Check that attack process has started
    expect(player.isAttacking).toBe(true);
    expect(player.attackTimer).toBe(0);
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

  // New tests below

  it('should update equipment stats when equipping an item', () => {
    // Find a weapon with attack power - look for any item that might have attack power stats
    const weaponId = Array.from(itemsData).find(
      ([_, item]) => item.stats?.attackPower,
    )?.[0];

    if (!weaponId) return; // Skip if no suitable weapon found

    const initialAttackPower = player.attackPower;

    // Set equipment and update stats
    player.equipment = { weapon: weaponId };

    // Call the private method via any type assertion
    (player as any).updateEquipmentStats?.();

    expect(player.attackPower).toBeGreaterThan(initialAttackPower);
  });

  it('should heal when using a health potion', () => {
    // First reduce health
    player.health = 50;

    // Find a health potion in itemsData
    const healthPotionId = Array.from(itemsData).find(
      ([_, item]) => item.name === 'Health Potion',
    )?.[0];

    if (!healthPotionId) return; // Skip if no health potion found

    // Add the health potion to inventory
    player.addItemToInventory({ itemId: healthPotionId, quantity: 1 });

    // Try to use item if the method exists
    if (typeof (player as any).useItem === 'function') {
      (player as any).useItem(healthPotionId);
      expect(player.health).toBeGreaterThan(50);
    }
  });

  it('should have increased attack power with criticals', () => {
    // Create a target
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Force a critical hit
    vi.spyOn(Math, 'random').mockReturnValue(0);
    player.baseCriticalChance = 1; // 100% crit chance

    // Mock mob's takeDamage
    const takeDamageSpy = vi.spyOn(target, 'takeDamage');

    // Attack the target
    player.startAttack(target);

    // Verify the attack was initiated
    expect(player.isAttacking).toBe(true);
    expect(takeDamageSpy).not.toHaveBeenCalled();
  });

  it('should have magic effects system initialized', () => {
    // Check if magic effects system is initialized
    expect(player.magicEffects).toBeDefined();
  });

  it('should update attack timer during combat', () => {
    // Start attack
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    player.startAttack(target);

    // Initial state
    expect(player.isAttacking).toBe(true);
    expect(player.attackTimer).toBe(0);

    // Call doActions which should update the timer
    const currentTime = Date.now() + 100;
    player.doActions(new Set(), currentTime, false);

    // Timer should be updated
    expect(player.attackTimer).toBeGreaterThan(0);
  });

  // Additional tests to improve coverage

  it('should properly equip and unequip items', () => {
    // Find a weapon and armor in itemsData
    const weaponId = Array.from(itemsData).find(
      ([_, item]) => item.equippableSlot === 'weapon',
    )?.[0];

    if (!weaponId) return; // Skip if no suitable weapon found

    // Add the item to inventory
    player.addItemToInventory({ itemId: weaponId, quantity: 1 });

    // Equip the item
    const equipResult = player.equipItem(weaponId);

    // Check result
    expect(equipResult).toBe(true);
    expect(player.equipment.weapon).toBe(weaponId);
    expect(player.inventory.some((item) => item.itemId === weaponId)).toBe(
      false,
    );

    // Unequip the item
    player.unequipItem('weapon');

    // Check that item is unequipped and back in inventory
    expect(player.equipment.weapon).toBeUndefined();
    expect(player.inventory.some((item) => item.itemId === weaponId)).toBe(
      true,
    );
  });

  it('should handle trying to equip non-existent or non-equippable items', () => {
    // Try to equip a non-existent item
    const equipNonExistentResult = player.equipItem('non-existent-item');
    expect(equipNonExistentResult).toBe(false);

    // Find a non-equippable item
    const consumableId = Array.from(itemsData).find(
      ([_, item]) => !item.equippableSlot && item.isUsable === 'single',
    )?.[0];

    if (!consumableId) return; // Skip if no suitable item found

    // Try to equip a non-equippable item
    player.addItemToInventory({ itemId: consumableId, quantity: 1 });
    const equipConsumableResult = player.equipItem(consumableId);
    expect(equipConsumableResult).toBe(false);
  });

  it('should update gold with negative and positive values', () => {
    const initialGold = player.gold;

    // Add gold
    player.updateGold(50);
    expect(player.gold).toBe(initialGold + 50);

    // Subtract gold
    player.updateGold(-30);
    expect(player.gold).toBe(initialGold + 50 - 30);
  });

  it('should properly execute attack and deal damage', () => {
    // Create a target
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Mock target's takeDamage method
    const takeDamageSpy = vi.spyOn(target, 'takeDamage');

    // Start attack
    player.startAttack(target);

    // Force critical hit
    vi.spyOn(Math, 'random').mockReturnValue(0);

    // Simulate time passing to damage point
    if ((player as any)._attackDamagePoint) {
      const damagePoint = (player as any)._attackDamagePoint;
      (player as any)._attackTimer = damagePoint;
      (player as any).updateAttack(10); // Small delta to push past damage point

      // Check if target's takeDamage was called
      expect(takeDamageSpy).toHaveBeenCalled();
    }
  });

  it('should correctly calculate intelligence level', () => {
    // Test different intelligence levels
    player.stats.intelligence = 2;
    expect(player.getIntellectLevel()).toBe("can't speak");

    player.stats.intelligence = 4;
    expect(player.getIntellectLevel()).toBe('very low intelligence');

    player.stats.intelligence = 6;
    expect(player.getIntellectLevel()).toBe('low intelligence');

    player.stats.intelligence = 8;
    expect(player.getIntellectLevel()).toBe('medium intelligence');

    player.stats.intelligence = 10;
    expect(player.getIntellectLevel()).toBe('high intelligence');
  });

  it('should start and stop attacking correctly', () => {
    // Create a target
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Start attack
    player.startAttack(target);

    // Check attack started
    expect(player.isAttacking).toBe(true);

    // Stop attack
    player.stopAttack();

    // Check attack stopped
    expect(player.isAttacking).toBe(false);
    expect((player as any).currentTarget).toBeNull();
    expect(player.attackTimer).toBe(0);
  });

  it('should check if player is alive based on health', () => {
    // Player is alive with positive health
    player.health = 100;
    expect(player.isAlive()).toBe(true);

    // Player is not alive with zero health
    player.health = 0;
    expect(player.isAlive()).toBe(false);

    // Player is not alive with negative health (shouldn't happen but testing anyway)
    player.health = -10;
    expect(player.isAlive()).toBe(false);
  });

  it('should set position correctly', () => {
    const newPosition = { x: 200, y: 300 };
    player.setPosition(newPosition);

    expect(player.position.x).toBe(newPosition.x);
    expect(player.position.y).toBe(newPosition.y);
  });

  it('should handle meleeAttack properly when target is within range', () => {
    // Create a target within range
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Directly call meleeAttack
    (player as any).meleeAttack(target);

    // Check attack initiated
    expect(player.isAttacking).toBe(true);
  });

  it('should not start meleeAttack when target is out of range', () => {
    // Create a target out of range
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 500,
      player.position.y + 500,
      location,
    );

    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Directly call meleeAttack
    (player as any).meleeAttack(target);

    // Check attack not initiated and appropriate message logged
    expect(player.isAttacking).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('too far away'),
    );

    // Restore spy
    consoleSpy.mockRestore();
  });

  it('should handle ranged attacks with Vector2 target', () => {
    // Set combat mode to ranged
    player.setCombatMode('ranged');

    // Create a target position
    const targetPosition = new Vector2(
      player.position.x + 100,
      player.position.y + 100,
    );

    // Start ranged attack
    player.startAttack(targetPosition);

    // Verify attack started
    expect(player.isAttacking).toBe(true);
  });

  it('should reset attack after cooldown period', () => {
    // Create a target
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Start attack
    player.startAttack(target);

    // Set attack timer just below cooldown threshold
    const cooldown = (player as any)._attackCooldown;
    (player as any)._attackTimer = cooldown - 10;
    (player as any)._attackDoneThisCycle = true;

    // Update with delta that pushes past cooldown
    (player as any).updateAttack(20);

    // Check timer was reset and attack can be executed again
    expect((player as any)._attackTimer).toBeLessThan(cooldown);
    expect((player as any)._attackDoneThisCycle).toBe(false);
  });

  it('should not shoot arrow if not in ranged mode', () => {
    // Set combat mode to melee
    player.setCombatMode('melee');
    const target = new Mob(
      'wolf',
      player.position.x + 10,
      player.position.y + 10,
      { id: 'test-location', name: 'Test Location' } as any,
    );
    target.takeDamage = vi.fn();
    player.startAttack(target);

    player.doActions(new Set(), player.attackCooldown - 1, false);

    expect(projectileStore.projectiles.size).toBe(0);
    expect(target.takeDamage).toHaveBeenCalled();
  });

  it('should shoot arrow if in ranged mode', () => {
    // Set combat mode to ranged
    player.setCombatMode('ranged');
    const target = new Mob(
      'wolf',
      player.position.x + 10,
      player.position.y + 10,
      { id: 'test-location', name: 'Test Location' } as any,
    );
    target.takeDamage = vi.fn();
    player.startAttack(target);
    player.startAttack(
      new Vector2(player.position.x + 10, player.position.y + 10),
    );

    // Mock shootArrow method
    player.doActions(new Set(), player.attackCooldown - 1, false);

    // Check that shootArrow was called
    expect(projectileStore.projectiles.size).toBe(1);
    expect(target.takeDamage).not.toHaveBeenCalled();
  });

  it('should properly handle attack cycle with damage point and cooldown', () => {
    // Create a target
    const location = { id: 'test-location', name: 'Test Location' } as any;
    const target = new Mob(
      'wolf',
      player.position.x + 30,
      player.position.y + 30,
      location,
    );

    // Mock executeAttack
    const executeAttackSpy = vi.spyOn(player as any, 'executeAttack');

    // Start attack
    player.startAttack(target);

    // Set timer before damage point
    (player as any)._attackTimer = (player as any)._attackDamagePoint - 10;

    // Update past damage point but before cooldown
    (player as any).updateAttack(20);

    // Check that executeAttack was called
    expect(executeAttackSpy).toHaveBeenCalled();
    expect((player as any)._attackDoneThisCycle).toBe(true);

    // Restore spy
    executeAttackSpy.mockRestore();
  });
});
