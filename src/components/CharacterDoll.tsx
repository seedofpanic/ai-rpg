import React from 'react';
import styled from 'styled-components';
import { Player } from '../models/Player';
import { itemsData } from '../models/itemsData';

const DollContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin-bottom: 10px;
`;

const DollFigure = styled.div`
  width: 100px;
  height: 150px;
  position: relative;
  background-color: #666;
  border-radius: 8px;
  margin: 10px 0;
`;

const EquipmentSlot = styled.div<{ $hasItem: boolean }>`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: ${props => props.$hasItem ? '#4a4a4a' : '#333'};
  border: 2px solid #666;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$hasItem ? '#666' : '#444'};
  }
`;

const SlotTooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
`;

interface CharacterDollProps {
  player: Player;
}

const CharacterDoll: React.FC<CharacterDollProps> = ({ player }) => {
  const handleSlotClick = (slot: keyof typeof player.equipment) => {
    if (player.equipment[slot]) {
      player.unequipItem(slot);
    }
  };

  const getItemName = (itemId: string | undefined) => {
    if (!itemId) return '';
    return itemsData.get(itemId)?.name || '';
  };

  return (
    <DollContainer>
      <h3>Character</h3>
      <DollFigure>
        {/* Head */}
        <EquipmentSlot
          $hasItem={!!player.equipment.head}
          style={{ top: 10, left: 35 }}
          onClick={() => handleSlotClick('head')}
        >
          {getItemName(player.equipment.head)}
        </EquipmentSlot>

        {/* Chest */}
        <EquipmentSlot
          $hasItem={!!player.equipment.chest}
          style={{ top: 50, left: 35 }}
          onClick={() => handleSlotClick('chest')}
        >
          {getItemName(player.equipment.chest)}
        </EquipmentSlot>

        {/* Weapon */}
        <EquipmentSlot
          $hasItem={!!player.equipment.weapon}
          style={{ top: 70, left: 5 }}
          onClick={() => handleSlotClick('weapon')}
        >
          {getItemName(player.equipment.weapon)}
        </EquipmentSlot>

        {/* Shield */}
        <EquipmentSlot
          $hasItem={!!player.equipment.shield}
          style={{ top: 70, right: 5 }}
          onClick={() => handleSlotClick('shield')}
        >
          {getItemName(player.equipment.shield)}
        </EquipmentSlot>

        {/* Ring */}
        <EquipmentSlot
          $hasItem={!!player.equipment.ring}
          style={{ top: 90, left: 35 }}
          onClick={() => handleSlotClick('ring')}
        >
          {getItemName(player.equipment.ring)}
        </EquipmentSlot>

        {/* Feet */}
        <EquipmentSlot
          $hasItem={!!player.equipment.feet}
          style={{ top: 110, left: 35 }}
          onClick={() => handleSlotClick('feet')}
        >
          {getItemName(player.equipment.feet)}
        </EquipmentSlot>
      </DollFigure>
    </DollContainer>
  );
};

export default CharacterDoll; 