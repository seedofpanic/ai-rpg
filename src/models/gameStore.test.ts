import { describe, it, expect, beforeEach } from 'vitest';
import { gameStore } from './gameStore';
import { Player } from './Player';

describe('GameStore', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('TestPlayer', 'Male', 'Human', 'Warrior');
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
});
