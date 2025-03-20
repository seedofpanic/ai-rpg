import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import QuestItem from './QuestItem';
import { Quest } from '../models/Quest';
import { gameStore } from '../models/gameStore';
import { itemsData } from '../models/itemsData';

// Mock the stores
vi.mock('../models/gameStore', () => ({
  gameStore: {
    player: {
      inventory: []
    }
  }
}));

vi.mock('../models/itemsData', () => ({
  itemsData: {
    get: (id: string) => ({ name: 'Test Item' })
  }
}));

describe('QuestItem Component', () => {
  const baseQuest: Quest = {
    id: '1',
    title: 'Test Quest',
    description: 'Test Description',
    action: 'kill',
    subject: 'goblin',
    quantity: 5,
    killCount: 0,
    completed: false,
    questGiverId: 'npc1',
    rewards: {
      gold: 100,
      experience: 200,
      items: ['item1', 'item2']
    }
  };

  it('renders basic quest information', () => {
    render(<QuestItem quest={baseQuest} npcName="Test NPC" />);
    
    expect(screen.getByTestId('quest-title')).toHaveTextContent('Test Quest');
    expect(screen.getByTestId('quest-description')).toHaveTextContent('Test Description');
    expect(screen.getByTestId('quest-giver')).toHaveTextContent('(from Test NPC)');
  });

  it('shows correct status for active quest', () => {
    render(<QuestItem quest={baseQuest} npcName="Test NPC" />);
    
    expect(screen.getByTestId('quest-status')).toHaveTextContent('Active');
    expect(screen.getByTestId('quest-progress')).toHaveTextContent('0/5 goblin killed');
  });

  it('shows correct status for completed quest', () => {
    const completedQuest = { ...baseQuest, completed: true };
    render(<QuestItem quest={completedQuest} npcName="Test NPC" />);
    
    expect(screen.getByTestId('quest-status')).toHaveTextContent('Completed');
    expect(screen.queryByTestId('quest-progress')).not.toBeInTheDocument();
  });

  it('displays quest rewards correctly', () => {
    render(<QuestItem quest={baseQuest} npcName="Test NPC" />);
    
    const rewardsElement = screen.getByTestId('quest-rewards');
    expect(rewardsElement).toHaveTextContent('100 gold');
    expect(rewardsElement).toHaveTextContent('2 items');
    expect(rewardsElement).toHaveTextContent('200 XP');
  });

  it('handles collect quest type correctly', () => {
    const collectQuest = {
      ...baseQuest,
      action: 'collect',
      subject: 'herb1'
    };
    
    gameStore.player.inventory = [{ itemId: 'herb1', quantity: 2 }];
    
    render(<QuestItem quest={collectQuest} npcName="Test NPC" />);
    expect(screen.getByTestId('quest-progress')).toHaveTextContent('2/5 Test Item collected');
  });
}); 