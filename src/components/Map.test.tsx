import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import Map from './Map';
import { Player } from '../models/Player';

// Mock the stores and dependencies
vi.mock('../models/npcs', () => ({
  npcStore: {
    npcIds: ['npc1', 'npc2'],
    npcs: {
      npc1: {
        id: 'npc1',
        name: 'Test NPC 1',
        position: { x: 100, y: 100 },
        health: 100,
        role: 'merchant',
        location: 'town',
        race: 'human',
        personality: 'friendly',
        relation: 'neutral',
        isAlive: () => true
      },
      npc2: {
        id: 'npc2',
        name: 'Test NPC 2',
        position: { x: 200, y: 200 },
        health: 50,
        role: 'guard',
        location: 'castle',
        race: 'elf',
        personality: 'stern',
        relation: 'friendly',
        isAlive: () => true
      }
    }
  }
}));

vi.mock('../models/mobStore', () => ({
  mobStore: {
    mobIds: ['mob1'],
    mobs: {
      mob1: {
        id: 'mob1',
        name: 'Test Mob',
        position: { x: 300, y: 300 },
        type: 'goblin',
        health: 50,
        isAggressive: true,
        isAlive: () => true
      }
    }
  }
}));

vi.mock('../models/location', () => ({
  locations: [
    {
      name: 'Test Town',
      x: 50,
      y: 50,
      width: 200,
      height: 200
    }
  ]
}));

vi.mock('../models/mob', () => ({
  MOB_STATS: {
    goblin: {
      health: 100
    }
  }
}));

describe('Map Component', () => {
  const mockPlayer = {
    position: { x: 150, y: 150 },
    speed: 5,
    name: 'Test Player',
    race: 'human',
    class: 'warrior',
    type: 'player',
    level: 1,
    experience: 0,
    health: 100,
    maxHealth: 100,
    mana: 100,
    maxMana: 100,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    baseHealth: 100,
    baseAttackPower: 10,
    baseDefense: 10,
    baseMana: 100,
    baseStrength: 10,
    baseDexterity: 10,
    baseIntelligence: 10,
    attackPower: 10,
    defense: 10,
    criticalChance: 0.05,
    criticalDamage: 1.5,
    dodgeChance: 0.05,
    blockChance: 0.05,
    blockValue: 5,
    hitChance: 0.95,
    movementSpeed: 5,
    attackSpeed: 1,
    castSpeed: 1,
    healingPower: 1,
    manaRegeneration: 1,
    healthRegeneration: 1,
    inventory: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    gold: 0,
    quests: [],
    completedQuests: [],
    skills: [],
    effects: [],
    isAlive: () => true,
    canMove: () => true,
    move: () => {},
    attack: () => {},
    receiveDamage: () => {},
    heal: () => {},
    gainExperience: () => {},
    levelUp: () => {},
    addGold: () => {},
    removeGold: () => {},
    addToInventory: () => {},
    removeFromInventory: () => {},
    equipItem: () => {},
    unequipItem: () => {},
    addQuest: () => {},
    completeQuest: () => {},
    addSkill: () => {},
    useSkill: () => {},
    addEffect: () => {},
    removeEffect: () => {},
    save: () => {},
    load: () => {}
  } as unknown as Player;

  const mockProps = {
    onNpcInteraction: vi.fn(),
    onNpcHover: vi.fn(),
    player: mockPlayer
  };

  it('renders locations correctly', () => {
    render(<Map {...mockProps} />);
    expect(screen.getByText('Test Town')).toBeInTheDocument();
  });

  it('renders player at correct position', () => {
    render(<Map {...mockProps} />);
    const playerElement = screen.getByTestId('player-view');
    expect(playerElement).toHaveStyle({
      left: '150px',
      top: '150px'
    });
  });

  it('renders NPCs correctly', () => {
    render(<Map {...mockProps} />);
    expect(screen.getByText('Test NPC 1')).toBeInTheDocument();
    expect(screen.getByText('Test NPC 2')).toBeInTheDocument();
  });

  it('renders mobs correctly', () => {
    render(<Map {...mockProps} />);
    expect(screen.getByText('Test Mob')).toBeInTheDocument();
  });

  it('handles NPC interaction', () => {
    render(<Map {...mockProps} />);
    const npc = screen.getByTestId("npc-view-npc1");
    fireEvent.click(npc);
    expect(mockProps.onNpcInteraction).toHaveBeenCalledWith('npc1');
  });

  it('handles NPC hover events', () => {
    render(<Map {...mockProps} />);
    const npc = screen.getByText('Test NPC 1');
    
    fireEvent.mouseEnter(npc);
    expect(mockProps.onNpcHover).toHaveBeenCalledWith('npc1');
    
    fireEvent.mouseLeave(npc);
    expect(mockProps.onNpcHover).toHaveBeenCalledWith(null);
  });

  it('handles mob interaction', () => {
    render(<Map {...mockProps} />);
    const mob = screen.getByTestId('mob-view-mob1');
    fireEvent.click(mob);
    expect(mockProps.onNpcInteraction).toHaveBeenCalledWith('mob1');
  });
});
