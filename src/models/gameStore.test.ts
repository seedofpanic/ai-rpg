import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStore } from './gameStore';
import { Player } from './Player';

describe('GameStore', () => {
  let gameStore: GameStore;
  let player: Player;

  beforeEach(() => {
    // Initialize a fresh game store and player for each test
    gameStore = new GameStore();
    player = new Player('TestPlayer', 'Human', 'Warrior');
    gameStore.startGame(player);
  });

  it('should initialize the game correctly', () => {
    // Verify initial game state
    expect(gameStore.player).toBe(player);
    expect(gameStore.isOver).toBe(false);
  });

  it('should open and close dialogue correctly', () => {
    // Open dialogue with an NPC
    gameStore.openDialogue('npc-1');
    expect(gameStore.isDialogueOpen).toBe(true);
    expect(gameStore.activeNpcId).toBe('npc-1');
    
    // Close dialogue - no need to specify NPC ID
    gameStore.closeDialogue();
    expect(gameStore.isDialogueOpen).toBe(false);
    expect(gameStore.activeNpcId).toBeNull();
  });

  it('should end the game when the player dies', () => {
    // Simulate player death
    player.baseHealth = 0;
    gameStore.startGameActions();
    expect(gameStore.isOver).toBe(true);
  });

  it('should add a quest to the quest log', () => {
    // Create a sample quest
    const quest = {
      id: 'quest-1',
      title: 'Test Quest',
      description: 'A test quest',
      subject: 'test-item',
      quantity: 1,
      action: 'bring',
      completed: false,
      questGiverId: 'npc-1',
    };
    // Add quest and verify it's in the log
    gameStore.addQuest(quest);
    expect(gameStore.questLog).toContainEqual(quest);
  });

  it('should not add a quest to the quest log if it already exists', () => {
    // Create a sample quest
    const quest = {
      id: 'quest-1',
      title: 'Test Quest',
      description: 'A test quest',
      subject: 'test-item',
      quantity: 1,
      action: 'bring',
      completed: false,
      questGiverId: 'npc-1',
    };
    // Try to add the same quest twice
    gameStore.addQuest(quest);
    gameStore.addQuest(quest);
    // Verify quest was only added once
    expect(gameStore.questLog.length).toBe(1);
  });

  it('should complete a bring quest and handle rewards correctly', () => {
    // Setup player inventory
    player.addItemToInventory({ itemId: 'test-item', quantity: 1 });
    const initialGold = player.gold;

    // Create a quest with rewards
    const quest = {
      id: 'quest-1',
      title: 'Bring Quest',
      description: 'Bring an item',
      subject: 'test-item',
      quantity: 1,
      action: 'bring',
      completed: false,
      questGiverId: 'npc-1',
      rewards: {
        gold: 100,
        items: ['reward-item'],
      },
    };

    // Add and complete the quest
    gameStore.addQuest(quest);
    gameStore.completeQuest('quest-1');

    // Verify quest completion and rewards
    expect(gameStore.questLog[0].completed).toBe(true);
    expect(player.gold).toBe(initialGold + 100);
    expect(player.inventory.some((item) => item.itemId === 'reward-item')).toBe(true);
  });

  it('should not complete an already completed quest', () => {
    // Create a completed quest
    const quest = {
      id: 'quest-1',
      title: 'Test Quest',
      description: 'A test quest',
      subject: 'test-item',
      quantity: 1,
      action: 'bring',
      completed: true,
      questGiverId: 'npc-1',
      rewards: {
        gold: 100,
      },
    };

    // Try to complete an already completed quest
    const initialGold = player.gold;
    gameStore.addQuest(quest);
    gameStore.completeQuest('quest-1');
    // Verify no rewards were given
    expect(player.gold).toBe(initialGold);
  });

  it('should not complete a quest if requirements are not met', () => {
    const quest = {
      id: 'quest-1',
      title: 'Bring Quest',
      description: 'Bring an item',
      subject: 'missing-item',
      quantity: 1,
      action: 'bring',
      completed: false,
      questGiverId: 'npc-1',
    };

    gameStore.addQuest(quest);
    expect(gameStore.questLog[0].completed).toBe(false);
    gameStore.completeQuest('quest-1');
    expect(gameStore.questLog[0].completed).toBe(true);
  });

  it('should handle game reset correctly', () => {
    gameStore.reset();
    expect(gameStore.isOver).toBe(false);
    expect(gameStore.player).toBeDefined();
  });

  it('should handle dialogue with multiple NPCs correctly', () => {
    // Open dialogue with first NPC
    gameStore.openDialogue('npc-1');
    expect(gameStore.activeNpcId).toBe('npc-1');

    // Opening dialogue with another NPC while one is active
    gameStore.openDialogue('npc-2');
    expect(gameStore.activeNpcId).toBe('npc-2');
    
    // Closing dialogue should work correctly
    gameStore.closeDialogue();
    expect(gameStore.isDialogueOpen).toBe(false);
    expect(gameStore.activeNpcId).toBeNull();
  });

  it('should handle game over correctly', () => {
    // Mock window.alert and location.reload
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const reloadMock = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    // Trigger game over
    gameStore.over();

    // Verify game over behavior
    expect(gameStore.isOver).toBe(true);
    expect(alertMock).toHaveBeenCalledWith('YOU DIED');
    expect(reloadMock).toHaveBeenCalled();

    // Clean up mocks
    alertMock.mockRestore();
    reloadMock.mockRestore();
  });
});
