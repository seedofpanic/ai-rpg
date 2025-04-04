import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRelationChange, MessageType, NPC } from 'models/npcs/npc';
import { Vector2 } from 'utils/vector2';
import { Location } from 'models/location';
import { locationsStore } from 'models/location';

describe('NPC', () => {
  let npc: NPC;
  let location: Location;

  beforeEach(() => {
    // Clear locations store before each test
    locationsStore.locations = [];

    location = new Location({
      name: 'Market Square',
      description: 'A bustling trading square in the city center.',
      x: 100,
      y: 100,
      width: 500,
      height: 500,
      npcsTemplate: [],
      monstersTemplate: [],
      time: {
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night',
      },
      weather: {
        cloudy: 'cloudy',
        rainy: 'rainy',
        foggy: 'foggy',
        stormy: 'stormy',
        clear: 'clear',
        overcast: 'overcast',
      },
    });

    // Add location to locationsStore
    locationsStore.locations.push(location);

    npc = new NPC(
      150,
      150,
      {
        background: 'A skilled trader.',
        trueBackground: 'A skilled trader.',
        motivation: 'A skilled trader.',
        uniqueTrait: 'A skilled trader.',
        beliefs: 'A skilled trader.',
        name: 'TestNPC',
        title: 'Merchant',
        race: 'human',
        role: 'Merchant',
        relation: 50,
        personality: 'Friendly',
      },
      location,
      [],
      50,
      100,
      10,
      5,
      0.1,
      0.05,
    );
  });

  it('should initialize with default values', () => {
    expect(npc.background.name).toBe('TestNPC');
    expect(npc.health).toBe(100);
    expect(npc.gold).toBe(50);
    expect(npc.position).toEqual(new Vector2(150, 150));
  });

  it('should take damage and reduce health', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    npc.takeDamage(20);
    expect(npc.health).toBe(85); // Considering default defense of 5
  });

  it('should dodge attacks based on dodgeChance', () => {
    npc.dodgeChance = 1; // 100% dodge chance
    npc.takeDamage(20);
    expect(npc.health).toBe(100); // No damage taken
  });

  it('should attack a target and deal damage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const target = {
      health: 100,
      takeDamage: (damage: number) => {
        target.health -= damage;
      },
      name: 'TargetNPC',
    };
    npc.attack(target);
    expect(target.health).toBe(90); // Default attackPower is 10
  });

  it('should add items to inventory', () => {
    npc.addItem({ itemId: 'item-1', quantity: 1 });
    expect(npc.inventory).toHaveLength(1);
    expect(npc.inventory?.[0]).toEqual({ itemId: 'item-1', quantity: 1 });
  });

  it('should remove items from inventory', () => {
    npc.addItem({ itemId: 'item-1', quantity: 2 });
    expect(npc.inventory?.[0]?.quantity).toBe(2);
    npc.removeItem({ itemId: 'item-1', quantity: 1 });
    expect(npc.inventory?.[0]?.quantity).toBe(1);
  });

  it('should move towards the player when hostile', () => {
    const player = {
      position: new Vector2(200, 200),
    };
    npc.relation = 0; // Hostile
    npc.doActions(player as any, Date.now() + 1000);
    expect(npc.position.x).toBeGreaterThan(150);
    expect(npc.position.y).toBeGreaterThan(150);
  });

  it('should not move when not hostile', () => {
    const player = {
      position: new Vector2(200, 200),
    };
    npc.relation = 50; // Neutral
    npc.doActions(player as any, Date.now() + 1000);
    expect(npc.position).toEqual(new Vector2(150, 150));
  });

  it('should change relation based on state', () => {
    npc.setState('friendly');
    npc.changeRelation(getRelationChange(npc.state));
    expect(npc.relation).toBe(52); // Default relation +2 for "friendly"
  });

  it('should return correct player relation description', () => {
    npc.relation = 100;
    expect(npc.getPlayerRelation()).toBe('Very Friendly');
    npc.relation = 0;
    expect(npc.getPlayerRelation()).toBe('Hostile');
  });

  it('should add dialogue history correctly', () => {
    npc.initializeDialogueHistory();
    npc.addDialogHistory({
      text: 'Hello, traveler!',
      type: MessageType.NPC,
    });
    expect(npc.dialogueHistory).toHaveLength(1);
    expect(npc.dialogueHistory?.[0].text).toBe('Hello, traveler!');
  });

  it('should correctly calculate relation change based on state', () => {
    npc.setState('like');
    const relationChange = getRelationChange(npc.state);
    expect(relationChange).toBe(4);
    npc.changeRelation(relationChange);
    expect(npc.relation).toBe(54); // Initial relation 50 + 4
  });

  it('should not exceed relation bounds when changing relation', () => {
    npc.changeRelation(100); // Exceed upper bound
    expect(npc.relation).toBe(100);
    npc.changeRelation(-200); // Exceed lower bound
    expect(npc.relation).toBe(0);
  });

  it('should be aggrasive if attacked', () => {
    npc.takeDamage(10);
    expect(npc.relation).toBe(0);
  });

  it('should update location when NPC moves to a new location', () => {
    // Create a new location
    const newLocation = new Location({
      name: 'New Area',
      description: 'A new area for testing.',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      npcsTemplate: [],
      monstersTemplate: [],
      weather: {
        cloudy: 'cloudy',
        rainy: 'rainy',
        foggy: 'foggy',
        stormy: 'stormy',
        clear: 'clear',
        overcast: 'overcast',
      },
      time: {
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night',
      },
    });

    // Add new location to locationsStore
    locationsStore.locations.push(newLocation);

    // Move NPC to new location's position
    npc.position = new Vector2(5, 5);

    // Store initial location reference
    const initialLocation = npc.location;

    // Call updateLocation
    npc.updateLocation();

    // Verify NPC was removed from initial location
    expect(initialLocation.npcs).not.toContain(npc);

    // Verify NPC was added to new location
    expect(newLocation.npcs).toContain(npc);

    // Verify NPC's location property was updated
    expect(npc.location).toBe(newLocation);
  });

  it('should not update location when NPC is not within any new location bounds', () => {
    // Store initial location reference
    const initialLocation = npc.location;

    // Move NPC to position outside any location
    npc.position = new Vector2(1000, 1000);

    // Call updateLocation
    npc.updateLocation();

    // Verify NPC's location remained unchanged
    expect(npc.location).toBe(initialLocation);

    // Verify NPC is still in initial location's NPCs array
    expect(initialLocation.npcs).toContain(npc);
  });
});
