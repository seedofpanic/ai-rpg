import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../../api';
import { npcStore } from '../../models/npcs';
import { observer } from 'mobx-react';
import { gameStore } from '../../models/gameStore'; // Import gameStore
import { itemsData } from '../../models/itemsData';
import { MessageType, NPC, TradeItem } from '../../models/npc';
import { parseNpcMessage } from './parseNpcMessage';

interface DialogueSystemProps {
  npcId: string;
  onClose: () => void;
  position: { top: number; left: number };
  size: { width: number; height: number };
  onTitleMouseDown: (e: React.MouseEvent) => void;
}

const DialogueContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(38, 70, 83, 0.95);
  border-radius: 8px;
  padding: 20px;
  color: white;
  resize: both;
  overflow: auto;
`;

const MessageLog = styled.div`
  min-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const Message = styled.div<{ $type?: MessageType }>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${(props) => {
    switch (props.$type) {
      case MessageType.Player:
        return '#e76f51';
      case MessageType.NPC:
        return '#2a9d8f';
      case MessageType.Action:
        return '#264653';
      default:
        return '#6c757d';
    }
  }};
  color: ${(props) =>
    props.$type === MessageType.Action ? '#f4f4f4' : 'white'};
  border-radius: 4px;
  max-width: 80%;
  margin-left: ${(props) =>
    props.$type === MessageType.Player ? 'auto' : '0'};
  font-style: ${(props) =>
    props.$type === MessageType.Action ? 'italic' : 'normal'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #e76f51;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4a261;
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
    color: #f4a261;
  }
`;

const NPCHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const ShopContainer = styled.div`
  height: 100%;
  background-color: rgba(38, 70, 83, 0.95);
  border-radius: 8px;
  padding: 20px;
  color: white;
  overflow-y: auto;
`;

const QuestSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const QuestItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(42, 157, 143, 0.5);
  border-radius: 4px;
`;

const QuestTitle = styled.div`
  font-weight: bold;
  color: #e76f51;
  margin-bottom: 5px;
`;

const QuestDescription = styled.div`
  font-size: 0.9em;
  margin-bottom: 5px;
`;

const QuestReward = styled.div`
  font-size: 0.8em;
  color: #ffd700;
`;

const ShopItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #2a9d8f;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShopButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #e76f51;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #f4a261;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BoxRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const LoadingDots = styled.div`
  display: inline-block;
  &:after {
    content: '.';
    animation: dots 1.5s steps(5, end) infinite;
  }

  @keyframes dots {
    0%,
    20% {
      content: '.';
    }
    40% {
      content: '..';
    }
    60% {
      content: '...';
    }
    80%,
    100% {
      content: '';
    }
  }
`;

const LoadingMessage = styled(Message)`
  background-color: #2a9d8f;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DialogueSystem: React.FC<DialogueSystemProps> = ({
  npcId,
  onClose,
  position,
  size,
  onTitleMouseDown,
}) => {
  const npcContext = npcStore.npcs[npcId] as NPC;
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!npcContext.dialogueHistory.length) {
      npcContext.addDialogHistory({
        text: npcStore.getNpcGreating(npcId),
        type: MessageType.NPC,
        tokensCount: 20,
      }); // Save to dialogue history
    }
  }, [npcContext, npcId]);

  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [npcId]);

  const handleBuyItem = (item: TradeItem) => {
    if (gameStore.player.gold >= item.price) {
      const itemData = itemsData.get(item.itemId);

      if (!itemData) {
        return;
      }

      gameStore.player.updateGold(-item.price);
      npcContext.updateGold(item.price);
      npcContext.setShopItems(
        npcContext.sellingItems.filter((i) => i !== item),
      );

      npcContext.removeItem({ itemId: item.itemId, quantity: 1 });
      gameStore.player?.addItemToInventory({
        itemId: item.itemId,
        quantity: 1,
      });
      npcContext.addDialogHistory({
        text: `Player bought ${itemData.name} for ${item.price} gold from ${npcContext.name}`,
        type: MessageType.Action,
        tokensCount: 20,
      }); // Save to dialogue history
      console.log(`Bought ${itemData.name} for ${item.price} gold.`);
    } else {
      console.log('Not enough gold.');
    }
  };

  const handleSellItem = (item: TradeItem) => {
    if (npcContext.gold >= item.price) {
      const itemData = itemsData.get(item.itemId);

      if (!itemData) {
        return;
      }

      gameStore.player.updateGold(item.price);
      npcContext.updateGold(-item.price);
      npcContext.setBuyItems(npcContext.buyingItems.filter((i) => i !== item));
      gameStore.player?.removeItemFromInventory({
        itemId: item.itemId,
        quantity: 1,
      });
      npcContext.addItem({ itemId: item.itemId, quantity: 1 });
      npcContext.addDialogHistory({
        text: `Player sold ${itemData.name} for ${item.price} gold to ${npcContext.name}`,
        type: MessageType.Action,
        tokensCount: 20,
      }); // Save to dialogue history
      console.log(`Sold ${itemData.name} for ${item.price} gold.`);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    // Send message to API with NPC context
    try {
      npcContext.addDialogHistory({
        text: userMessage,
        type: MessageType.Player,
        tokensCount: 30,
      }); // Save to dialogue history

      const response = await sendMessage(userMessage, npcId);

      if (!response) {
        return;
      }

      const { text, tokensCount } = response;
      parseNpcMessage(text, tokensCount, npcContext);
    } catch (error) {
      console.error('Failed to send message:', error);
      npcContext.addDialogHistory({
        text: "Sorry, I couldn't process that message. Please try again.",
        type: MessageType.NPC,
        tokensCount: 20,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <DialogueContainer
      data-testid="dialog-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: size.width,
        height: size.height,
        top: position.top,
        left: position.left,
      }}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      <NPCHeader onMouseDown={onTitleMouseDown}>
        {npcContext?.name} {npcContext.role} {npcContext.getPlayerRelation()}{' '}
        {npcContext.state}
      </NPCHeader>
      <BoxRow>
        <Box style={{ flex: '60%' }}>
          <MessageLog ref={messageLogRef}>
            {npcContext.dialogueHistory.map((message, index) => (
              <Message key={index} $type={message.type}>
                {message.text}
              </Message>
            ))}
            {isLoading && (
              <LoadingMessage>
                <span>{npcContext.name} is thinking</span>
                <LoadingDots />
              </LoadingMessage>
            )}
          </MessageLog>
          <InputContainer>
            <Input
              data-testid="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a message..."
              disabled={isLoading}
            />
            <Button
              data-testid="send-message"
              onClick={handleSend}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </InputContainer>
        </Box>
        <Box style={{ flex: '40%', marginLeft: '20px' }}>
          <ShopContainer>
            <div data-testid="items-to-sell">
              <h3>Shop</h3>
              {npcContext.sellingItems.length ? (
                npcContext.sellingItems.map((item, index) => (
                  <ShopItem data-testid="trade-item" key={index}>
                    <span>{itemsData.get(item.itemId)?.name}</span>
                    <span>{item.price} gold</span>
                    <ShopButton
                      data-testid="buy-item"
                      onClick={() => handleBuyItem(item)}
                    >
                      Buy
                    </ShopButton>
                  </ShopItem>
                ))
              ) : (
                <p>No items available.</p>
              )}
            </div>
            <div data-testid="items-to-buy">
              <h3>Sell</h3>
              {npcContext.buyingItems.length ? (
                npcContext.buyingItems.map((item, index) => {
                  const hasItem = gameStore.player?.inventory.some(
                    (invItem) =>
                      invItem.itemId === item.itemId && invItem.quantity > 0,
                  );
                  return (
                    <ShopItem key={index}>
                      <span>{itemsData.get(item.itemId)?.name}</span>
                      <span>{item.price} gold</span>
                      <ShopButton
                        data-testid="sell-item"
                        onClick={() => handleSellItem(item)}
                        disabled={!hasItem}
                        style={{
                          opacity: hasItem ? 1 : 0.5,
                          cursor: hasItem ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Sell
                      </ShopButton>
                    </ShopItem>
                  );
                })
              ) : (
                <p>No items available to sell.</p>
              )}
            </div>
            <QuestSection>
              <h3>Available Quests</h3>
              {gameStore.questLog
                .filter(
                  (quest) => quest.questGiverId === npcId && !quest.completed,
                )
                .map((quest) => (
                  <QuestItem key={quest.id}>
                    <QuestTitle>{quest.title}</QuestTitle>
                    <QuestDescription>{quest.description}</QuestDescription>
                    {quest.rewards && (
                      <QuestReward>
                        Rewards:{' '}
                        {quest.rewards.gold && `${quest.rewards.gold} gold`}
                        {quest.rewards.items &&
                          quest.rewards.items.length > 0 &&
                          ` • ${quest.rewards.items.join(', ')}`}
                        {quest.rewards.experience &&
                          ` • ${quest.rewards.experience} XP`}
                      </QuestReward>
                    )}
                  </QuestItem>
                ))}
              <h3>Completed Quests</h3>
              {gameStore.questLog
                .filter(
                  (quest) => quest.questGiverId === npcId && quest.completed,
                )
                .map((quest) => (
                  <QuestItem key={quest.id}>
                    <QuestTitle>{quest.title} (Completed)</QuestTitle>
                  </QuestItem>
                ))}
            </QuestSection>
          </ShopContainer>
        </Box>
      </BoxRow>
    </DialogueContainer>
  );
};

export default observer(DialogueSystem);
