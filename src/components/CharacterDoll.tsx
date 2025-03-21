import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../models/Player';
import { itemsData } from '../models/itemsData';
import { observer } from 'mobx-react';

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
  background-color: ${(props) => (props.$hasItem ? '#4a4a4a' : '#333')};
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
    background-color: ${(props) => (props.$hasItem ? '#666' : '#444')};
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

const EffectsContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

const EffectItem = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 3px;
  font-size: 12px;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'heal':
        return 'rgba(76, 175, 80, 0.3)';
      case 'buff':
        return 'rgba(33, 150, 243, 0.3)';
      case 'debuff':
        return 'rgba(244, 67, 54, 0.3)';
      case 'damage':
        return 'rgba(255, 152, 0, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
`;

const EffectValue = styled.span`
  font-weight: bold;
`;

interface CharacterDollProps {
  player: Player;
}

const CharacterDoll: React.FC<CharacterDollProps> = observer(({ player }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    x: number;
    y: number;
  }>({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  const handleSlotClick = (slot: keyof typeof player.equipment) => {
    if (player.equipment[slot]) {
      player.unequipItem(slot);
    }
  };

  const handleSlotHover = (
    event: React.MouseEvent<HTMLDivElement>,
    itemId: string | undefined,
  ) => {
    const itemName = getItemName(itemId);
    if (itemName) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        text: itemName,
        x: rect.left + rect.width / 2,
        y: rect.top - 25,
      });
    }
  };

  const handleSlotLeave = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  const getItemName = (itemId: string | undefined) => {
    if (!itemId) return '';
    return itemsData.get(itemId)?.name || '';
  };

  return (
    <DollContainer data-testid="character-doll">
      <h3>Character</h3>
      <DollFigure>
        {/* Head */}
        <EquipmentSlot
          data-testid="equipment-slot-head"
          $hasItem={!!player.equipment.head}
          style={{ top: 10, left: 35 }}
          onClick={() => handleSlotClick('head')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.head)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.head)}
        </EquipmentSlot>

        {/* Chest */}
        <EquipmentSlot
          data-testid="equipment-slot-chest"
          $hasItem={!!player.equipment.chest}
          style={{ top: 50, left: 35 }}
          onClick={() => handleSlotClick('chest')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.chest)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.chest)}
        </EquipmentSlot>

        {/* Weapon */}
        <EquipmentSlot
          data-testid="equipment-slot-weapon"
          $hasItem={!!player.equipment.weapon}
          style={{ top: 70, left: 5 }}
          onClick={() => handleSlotClick('weapon')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.weapon)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.weapon)}
        </EquipmentSlot>

        {/* Shield */}
        <EquipmentSlot
          data-testid="equipment-slot-shield"
          $hasItem={!!player.equipment.shield}
          style={{ top: 70, right: 5 }}
          onClick={() => handleSlotClick('shield')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.shield)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.shield)}
        </EquipmentSlot>

        {/* Ring */}
        <EquipmentSlot
          data-testid="equipment-slot-ring"
          $hasItem={!!player.equipment.ring}
          style={{ top: 90, left: 35 }}
          onClick={() => handleSlotClick('ring')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.ring)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.ring)}
        </EquipmentSlot>

        {/* Feet */}
        <EquipmentSlot
          data-testid="equipment-slot-feet"
          $hasItem={!!player.equipment.feet}
          style={{ top: 110, left: 35 }}
          onClick={() => handleSlotClick('feet')}
          onMouseEnter={(e) => handleSlotHover(e, player.equipment.feet)}
          onMouseLeave={handleSlotLeave}
        >
          {getItemName(player.equipment.feet)}
        </EquipmentSlot>
      </DollFigure>
      {tooltip.visible && (
        <SlotTooltip
          data-testid="equipment-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.text}
        </SlotTooltip>
      )}
      <EffectsContainer data-testid="effects-container">
        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
          Active Effects
        </h4>
        {Array.from(player.magicEffects.getActiveEffects().entries()).map(
          ([targetId, effects]) =>
            effects.map((effect, index) => (
              <EffectItem
                key={`${targetId}-${index}`}
                $type={effect.type}
                data-testid={`effect-item-${effect.type}-${index}`}
              >
                <span data-testid={`effect-source-${index}`}>
                  {effect.source}
                </span>
                <EffectValue data-testid={`effect-value-${index}`}>
                  {effect.type === 'heal' && `+${effect.value} HP`}
                  {effect.type === 'buff' && `+${effect.value} AP`}
                  {effect.type === 'debuff' && `-${effect.value} AP`}
                  {effect.type === 'damage' && `-${effect.value} HP`}
                </EffectValue>
              </EffectItem>
            )),
        )}
        {player.magicEffects.getActiveEffects().size === 0 && (
          <div
            data-testid="no-effects-message"
            style={{
              textAlign: 'center',
              color: '#888',
              fontSize: '12px',
              padding: '5px',
            }}
          >
            No active effects
          </div>
        )}
      </EffectsContainer>
    </DollContainer>
  );
});

export default CharacterDoll;
