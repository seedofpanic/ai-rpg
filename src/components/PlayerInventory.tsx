import React from 'react';
import styled from 'styled-components';
import { Player } from '../models/Player';
import { observer } from 'mobx-react';
import { itemsData } from 'models/itemsData';

const InventoryContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 250px;
`;

const InventoryItem = styled.div`
  margin: 5px 0;
`;

interface PlayerInventoryProps {
  player: Player;
}

const PlayerInventory: React.FC<PlayerInventoryProps> = ({ player }) => {
  return (
    <InventoryContainer>
      <h3>Inventory</h3>
      <p>Gold: {player.gold}</p>
      {player.inventory.length > 0 ? (
        player.inventory.map(({itemId}, index) => {
          const item = itemsData.get(itemId);
          if (!item) return null;

          return <InventoryItem key={index}>
            {item.name} - {item.description}
          </InventoryItem>
        })
      ) : (
        <p>No items in inventory.</p>
      )}
    </InventoryContainer>
  );
};

export default observer(PlayerInventory);
