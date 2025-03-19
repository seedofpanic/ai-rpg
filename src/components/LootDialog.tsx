import React from 'react';
import styled from 'styled-components';
import { NPC } from '../models/npc';
import { Mob } from '../models/mob';
import { Player } from '../models/Player';
import { observer } from 'mobx-react';
import { itemsData } from 'models/itemsData';

const DialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  z-index: 1000;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #ffd700;
`;

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 10px 0;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LootButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #666;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: #ff4444;
  }
`;

interface LootDialogProps {
  target: NPC | Mob;
  player: Player;
  onClose: () => void;
}

const LootDialog: React.FC<LootDialogProps> = observer(
  ({ target, player, onClose }) => {
    const handleLootItem = (itemId: string, quantity: number) => {
      // Transfer item from target to player
      target.removeItem({ itemId, quantity });
      player.addItemToInventory({ itemId, quantity });
      checkIfEmpty();
    };

    const handleLootAll = () => {
      // Transfer all items from target to player
      target.inventory?.forEach((item) => {
        player.addItemToInventory({
          itemId: item.itemId,
          quantity: item.quantity,
        });
      });
      target.setInventory([]);
      checkIfEmpty();
    };

    const checkIfEmpty = () => {
      if (target.inventory && target.inventory.length === 0) {
        onClose();
      }
    };

    return (
      <DialogContainer data-testid="loot-dialog">
        <Title>{target.name}&apos;s Loot</Title>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <ItemList>
          {target.inventory && target.inventory.length > 0 ? (
            target.inventory.map((item, index) => {
              const itemData = itemsData.get(item.itemId);
              return (
                <ItemRow key={index}>
                  <span>
                    {itemData?.name} (x{item.quantity})
                  </span>
                  <LootButton
                    onClick={() => handleLootItem(item.itemId, item.quantity)}
                    data-testid="loot-item-button"
                  >
                    Take
                  </LootButton>
                </ItemRow>
              );
            })
          ) : (
            <p>No items to loot.</p>
          )}
        </ItemList>

        {target.inventory && target.inventory.length > 0 && (
          <LootButton
            onClick={handleLootAll}
            style={{ width: '100%', marginTop: '10px' }}
            data-testid="loot-all-button"
          >
            Take All
          </LootButton>
        )}
      </DialogContainer>
    );
  },
);

export default LootDialog;
