import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createContext } from './contextCreator';

// Mock the stores and data
vi.mock('./models/npcs', () => ({
  npcStore: {
    npcs: {
      'test-npc': {
        name: 'Test NPC',
        role: 'Merchant',
        background: 'Test background',
        trueBackground: 'True test background',
        Motivation: 'Test motivation',
        uniqueTrait: 'Test trait',
        beliefs: 'Test beliefs',
        needs: [
          {
            type: 'quest',
            subject: 'Test quest',
            potentialGoldReward: 100,
            priority: 1.0
          }
        ],
        inventory: [
          {
            itemId: 'test-item',
            quantity: 1
          }
        ],
        gold: 1000,
        knowledge: ['Test knowledge'],
        location: {
          name: 'Test Location',
          description: 'Test location description'
        },
        getPlayerRelation: () => "10",
        sellingItems: [],
        buyingItems: [],
      }
    }
  }
}));

vi.mock('./models/gameStore', () => ({
  gameStore: {
    player: {
      name: 'Test Player'
    },
    questLog: [],
  }
}));

vi.mock('./models/itemsData', () => ({
  itemsData: {
    get: (id: string) => ({
      name: 'Test Item',
      price: 100
    })
  },
  itemsDataContext: 'Test Item|test-item|Test description'
}));

vi.mock('./models/loreBook', () => ({
  lore: 'Test lore'
}));

describe('contextCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create context for valid NPC ID', () => {
    const context = createContext('test-npc', 'Hello');
    
    expect(context).toContain('Test NPC');
    expect(context).toContain('Merchant');
    expect(context).toContain('Test background');
    expect(context).toContain('Test motivation');
    expect(context).toContain('Test trait');
    expect(context).toContain('Test beliefs');
    expect(context).toContain('Test quest');
    expect(context).toContain('100');
    expect(context).toContain('Test Item');
    expect(context).toContain('Test knowledge');
    expect(context).toContain('Test location description');
  });

  it('should throw error for invalid NPC ID', () => {
    expect(() => createContext('invalid-npc', 'Hello')).toThrow('NPC not found');
  });

  it('should include system message flag in context', () => {
    const contextWithSystemMessage = createContext('test-npc', 'Hello', true);
    const contextWithoutSystemMessage = createContext('test-npc', 'Hello', false);
    
    expect(contextWithSystemMessage).toBeDefined();
    expect(contextWithoutSystemMessage).toBeDefined();
  });
}); 