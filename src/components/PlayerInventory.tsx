import React from 'react';
import styled from 'styled-components';
import { Player } from '../models/Player';
import { observer } from 'mobx-react';
import { itemsData } from 'models/itemsData';
import CharacterDoll from './CharacterDoll';
import { ItemData } from 'models/itemsData';

const InventoryContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 250px;
  max-height: 80vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const InventoryItem = styled.div`
  margin: 5px 0;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    background-color: #666;
  }
`;

const StatContainer = styled.div`
  margin: 5px 0;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
`;

const StatValue = styled.span<{ $bonus?: number }>`
  color: ${(props) => (props.$bonus && props.$bonus > 0 ? '#4CAF50' : 'white')};
`;

interface PlayerInventoryProps {
  player: Player;
}

const PlayerInventory: React.FC<PlayerInventoryProps> = ({ player }) => {
  const handleEquip = (itemId: string) => {
    player.equipItem(itemId);
  };

  const handleUse = (itemId: string) => {
    player.useItem(itemId);
  };

  const isUsableItem = (item: ItemData): boolean => {
    return item.isUsable || false;
  };

  const getStatBonus = (base: number, total: number) => {
    const bonus = total - base;
    return bonus > 0 ? `+${bonus}` : '';
  };

  return (
    <InventoryContainer data-testid="player-inventory">
      <h3>Player stats</h3>
      <StatContainer>
        <StatRow>
          <span>Life:</span>
          <StatValue $bonus={player.health - player.baseHealth}>
            {player.health} {getStatBonus(player.baseHealth, player.health)}
          </StatValue>
        </StatRow>
        <StatRow>
          <span>Attack:</span>
          <StatValue $bonus={player.attackPower - player.baseAttackPower}>
            {player.attackPower}{' '}
            {getStatBonus(player.baseAttackPower, player.attackPower)}
          </StatValue>
        </StatRow>
        <StatRow>
          <span>Defense:</span>
          <StatValue $bonus={player.defense - player.baseDefense}>
            {player.defense} {getStatBonus(player.baseDefense, player.defense)}
          </StatValue>
        </StatRow>
        <StatRow>
          <span>Crit Chance:</span>
          <StatValue $bonus={player.criticalChance - player.baseCriticalChance}>
            {(player.criticalChance * 100).toFixed(1)}%{' '}
            {getStatBonus(player.baseCriticalChance, player.criticalChance)}
          </StatValue>
        </StatRow>
        <StatRow>
          <span>Dodge:</span>
          <StatValue $bonus={player.dodgeChance - player.baseDodgeChance}>
            {(player.dodgeChance * 100).toFixed(1)}%{' '}
            {getStatBonus(player.baseDodgeChance, player.dodgeChance)}
          </StatValue>
        </StatRow>
      </StatContainer>
      <CharacterDoll player={player} />
      <h3>Inventory</h3>
      <p>Gold: {player.gold}</p>
      {player.inventory.length > 0 ? (
        player.inventory.map(({ itemId, quantity }, index) => {
          const item = itemsData.get(itemId);
          if (!item) return null;

          const isEquipment = !!item.equippableSlot;
          const usable = isUsableItem(item);

          return (
            <InventoryItem data-testid="item-view" key={index}>
              <span>
                {item.name} (x{quantity})
              </span>
              <div>
                {isEquipment && (
                  <ItemButton
                    onClick={() => handleEquip(itemId)}
                    data-testid="equip-button"
                  >
                    Equip
                  </ItemButton>
                )}
                {usable && (
                  <ItemButton
                    onClick={() => handleUse(itemId)}
                    data-testid="use-button"
                  >
                    Use
                  </ItemButton>
                )}
              </div>
            </InventoryItem>
          );
        })
      ) : (
        <p>No items in inventory.</p>
      )}
    </InventoryContainer>
  );
};

export default observer(PlayerInventory);
