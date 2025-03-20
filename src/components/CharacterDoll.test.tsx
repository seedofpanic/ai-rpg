import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterDoll from './CharacterDoll';
import { Player } from '../models/Player';
import { itemsData } from '../models/itemsData';
import { MagicEffects } from '../models/MagicEffects';

// Mock the itemsData
vi.mock('../models/itemsData', () => ({
  itemsData: new Map([
    ['sword', { name: 'Steel Sword' }],
    ['shield', { name: 'Wooden Shield' }],
    ['armor', { name: 'Leather Armor' }],
  ]),
}));

describe('CharacterDoll', () => {
  const mockPlayer = new Player('Test Player', 'Human', 'Warrior', 'player');
  mockPlayer.equipment = {
    head: 'helmet',
    chest: 'armor',
    weapon: 'sword',
    shield: 'shield',
    ring: 'ring',
    feet: 'boots',
  };

  // Create a proper MagicEffects instance
  const mockMagicEffects = new MagicEffects(mockPlayer);
  mockMagicEffects.applyEffect('player', { type: 'heal', value: 10, source: 'Potion' });
  mockMagicEffects.applyEffect('player', { type: 'buff', value: 5, source: 'Spell' });
  mockPlayer.magicEffects = mockMagicEffects;

  it('renders all equipment slots', () => {
    render(<CharacterDoll player={mockPlayer} />);
    
    // Check if all equipment slots are rendered with correct content
    expect(screen.getByTestId('equipment-slot-weapon')).toHaveTextContent('Steel Sword');
    expect(screen.getByTestId('equipment-slot-shield')).toHaveTextContent('Wooden Shield');
    expect(screen.getByTestId('equipment-slot-chest')).toHaveTextContent('Leather Armor');
  });

  it('shows tooltip on hover', () => {
    render(<CharacterDoll player={mockPlayer} />);
    
    const weaponSlot = screen.getByTestId('equipment-slot-weapon');
    fireEvent.mouseEnter(weaponSlot);
    
    // Check if tooltip appears with correct content
    const tooltip = screen.getByTestId('equipment-tooltip');
    expect(tooltip).toHaveTextContent('Steel Sword');
  });

  it('hides tooltip on mouse leave', () => {
    render(<CharacterDoll player={mockPlayer} />);
    
    const weaponSlot = screen.getByTestId('equipment-slot-weapon');
    fireEvent.mouseEnter(weaponSlot);
    fireEvent.mouseLeave(weaponSlot);
    
    // Check if tooltip is removed
    expect(screen.queryByTestId('equipment-tooltip')).not.toBeInTheDocument();
  });

  it('displays active effects', () => {
    render(<CharacterDoll player={mockPlayer} />);
    
    // Check if active effects are displayed with correct content
    expect(screen.getByTestId('effect-value-0')).toHaveTextContent('+10 HP');
    expect(screen.getByTestId('effect-value-1')).toHaveTextContent('+5 AP');
    expect(screen.getByTestId('effect-source-0')).toHaveTextContent('Potion');
    expect(screen.getByTestId('effect-source-1')).toHaveTextContent('Spell');
  });

  it('shows empty state when no active effects', () => {
    const playerWithoutEffects = new Player('Test Player', 'Human', 'Warrior', 'player');
    playerWithoutEffects.magicEffects = new MagicEffects(playerWithoutEffects);
    
    render(<CharacterDoll player={playerWithoutEffects} />);
    
    // Check if empty state message is shown
    expect(screen.getByTestId('no-effects-message')).toHaveTextContent('No active effects');
  });

  it('calls unequipItem when clicking an equipped slot', () => {
    const unequipSpy = vi.spyOn(mockPlayer, 'unequipItem');
    render(<CharacterDoll player={mockPlayer} />);
    
    const weaponSlot = screen.getByTestId('equipment-slot-weapon');
    fireEvent.click(weaponSlot);
    
    expect(unequipSpy).toHaveBeenCalledWith('weapon');
  });
}); 