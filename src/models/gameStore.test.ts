import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStore } from './gameStore';
import { Player } from './Player';

describe('GameStore', () => {
  let gameStore: GameStore;
  let player: Player;

  beforeEach(() => {
    gameStore = new GameStore();
    player = new Player('TestPlayer', 'Human', 'Warrior');
    gameStore.startGame(player);
  });

  it('should initialize the game correctly', () => {
    expect(gameStore.player).toBe(player);
    expect(gameStore.isOver).toBe(false);
  });

  it('should open and close dialogue correctly', () => {
    gameStore.openDialogue('npc-1');
    expect(gameStore.isDialogueOpen).toBe(true);
    expect(gameStore.activeNpcId).toBe('npc-1');
    gameStore.closeDialogue('npc-1');
    expect(gameStore.isDialogueOpen).toBe(false);
    expect(gameStore.activeNpcId).toBeNull();
  });

  it('should end the game when the player dies', () => {
    player.health = 0;
    gameStore.startGameActions();
    expect(gameStore.isOver).toBe(true);
  });

  it('should add a quest to the quest log', () => {
    const quest = {
      id: 'quest-1',
      title: 'Test Quest',
      description: 'A test quest',
      subject: 'test-item',
      quantity: 1,
      action: 'bring',
      completed: false,
      questGiverId: 'npc-1'
    };
    gameStore.addQuest(quest);
    expect(gameStore.questLog).toContainEqual(quest);
  });

  it('should complete a bring quest and handle rewards correctly', () => {
    // Setup player inventory
    player.addItemToInventory({ itemId: 'test-item', quantity: 1 });
    const initialGold = player.gold;

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
        items: ['reward-item']
      }
    };

    gameStore.addQuest(quest);
    gameStore.completeQuest('quest-1');

    expect(gameStore.questLog[0].completed).toBe(true);
    expect(player.gold).toBe(initialGold + 100);
    expect(player.inventory.some(item => item.itemId === 'reward-item')).toBe(true);
  });

  it('should not complete an already completed quest', () => {
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
        gold: 100
      }
    };

    const initialGold = player.gold;
    gameStore.addQuest(quest);
    gameStore.completeQuest('quest-1');
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
      questGiverId: 'npc-1'
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
    gameStore.openDialogue('npc-1');
    expect(gameStore.activeNpcId).toBe('npc-1');
    
    // Opening dialogue with another NPC while one is active
    gameStore.openDialogue('npc-2');
    expect(gameStore.activeNpcId).toBe('npc-2');
    
    // Closing dialogue with wrong NPC ID should not close current dialogue
    gameStore.closeDialogue('npc-1');
    expect(gameStore.isDialogueOpen).toBe(true);
    expect(gameStore.activeNpcId).toBe('npc-2');
    
    // Closing dialogue with correct NPC ID should work
    gameStore.closeDialogue('npc-2');
    expect(gameStore.isDialogueOpen).toBe(false);
    expect(gameStore.activeNpcId).toBeNull();
  });

  it('should handle game over correctly', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const reloadMock = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
    
    gameStore.over();
    
    expect(gameStore.isOver).toBe(true);
    expect(alertMock).toHaveBeenCalledWith('YOU DIED');
    expect(reloadMock).toHaveBeenCalled();
    
    alertMock.mockRestore();
    reloadMock.mockRestore();
  });
});
