import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../api';
import { npcStore } from '../models/npcs';
import { observer } from 'mobx-react';
import { gameStore } from '../models/gameStore'; // Import gameStore
import { itemsData } from 'models/itemsData';
import { MessageType } from 'models/npc';

interface DialogueSystemProps {
  npcId: string;
  onClose: () => void;
  position: { top: number; left: number };
  size: { width: number; height: number };
  onTitleMouseDown: (e: React.MouseEvent) => void;
}

const DialogueContainer = styled.div<{ width: number; height: number; top: number; left: number }>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
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
  background-color: ${props => {
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
  color: ${props => (props.$type === MessageType.Action ? '#f4f4f4' : 'white')};
  border-radius: 4px;
  max-width: 80%;
  margin-left: ${props => (props.$type === MessageType.Player ? 'auto' : '0')};
  font-style: ${props => (props.$type === MessageType.Action ? 'italic' : 'normal')};
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

const DialogueSystem: React.FC<DialogueSystemProps> = ({ npcId, onClose, position, size, onTitleMouseDown }) => {
  const npcContext = npcStore.npcs[npcId];
  const [input, setInput] = useState("");
  const messageLogRef = useRef<HTMLDivElement>(null);
  const [shopItems, setShopItems] = useState<{ name: string; price: number }[]>([]);
  const [buyItems, setBuyItems] = useState<{ name: string; price: number }[]>([]);

  useEffect(() => {
    if (!npcContext.dialogueHistory.length) {
      npcContext.addDialogHistory({text: npcStore.getNpcGreating(npcId), type: MessageType.NPC, tokensCount: 20}); // Save to dialogue history
    }
  }, [npcId]);

  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [npcId]);

  const parseItems = (message: string, tag: 'sell' | 'buy') => {
    const items: { name: string; price: number }[] = [];
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`);
    let match = message.match(regex);
    if (match && match[1]) {
      const itemsMatch = match[1].split(';');
      for (const item of itemsMatch) {
        const [name, price] = item.split(',');
        if (itemsData.entries().find(([id, itemData]) => itemData.name === name.trim())) {
          items.push({ name: name.trim(), price: parseFloat(price.trim()) });
        }
      }
    }
    return items;
  };

  const parseShopItems = (message: string) => parseItems(message, 'sell');

  const parseBuyItems = (message: string) => parseItems(message, 'buy');

  const handleBuyItem = (item: { name: string; price: number }) => {
    if (gameStore.player.gold >= item.price) {
      const itemId = itemsData.keys().find(id => itemsData.get(id)?.name === item.name);
      if (itemId) {
        gameStore.player.gold -= item.price;
        setShopItems(shopItems.filter(i => i !== item));
      
        npcContext.removeItem(itemId);
        gameStore.player?.addItemToInventory({ itemId, quantity: 1 });
      }
      npcContext.addDialogHistory({text: `Player bought ${item.name} for ${item.price} gold from ${npcContext.name}`, type: MessageType.Action, tokensCount: 20}); // Save to dialogue history
      console.log(`Bought ${item.name} for ${item.price} gold.`);
    } else {
      console.log('Not enough gold.');
    }
  };

  const handleSellItem = (item: { name: string; price: number }) => { 
    const itemId = itemsData.keys().find(id => itemsData.get(id)?.name === item.name);
    if (itemId) {
      gameStore.player.gold += item.price;
      setBuyItems(buyItems.filter(i => i !== item));
      gameStore.player?.removeItemFromInventory({itemId, quantity: 1});
      npcContext.addItem({ itemId, quantity: 1 });
    }
    npcContext.addDialogHistory({text: `Player sold ${item.name} for ${item.price} gold to ${npcContext.name}`, type: MessageType.Action, tokensCount: 20}); // Save to dialogue history
    console.log(`Sold ${item.name} for ${item.price} gold.`);
  }

  const handleSend = async () => {
    if (input.trim() === "") return;

    // TODO: Will need to calculate tokens count based on the message
    npcContext.dialogueHistory.push({text: input, type: MessageType.Player, tokensCount: 30}); // Save to dialogue history
    setInput("");

    // Send message to API with NPC context
    try {
        const response = await sendMessage(input, npcId);

        if (!response) {
            return;
        }

        const { text, tokensCount } = response;

        npcContext.setState(text.match(/\*(.*?)\*/)?.[1] || npcContext.state);
        // Parse shop items from the response
        const items = parseShopItems(text);
        const buyItems = parseBuyItems(text);
        setBuyItems(buyItems);
        setShopItems(items);
        const message = text.replace(/\*(.*?)\*/g, '')
          .replace(/<sell>.*?<\/sell>/, "")
          .replace(/<buy>.*?<\/buy>/, ""); // Remove state from response
        
        const relationChange = npcContext.getRelationChange(npcContext.state);
        npcContext.changeRelation(relationChange); // Change relation based on response
        npcContext.dialogueHistory.push({text: message, type: MessageType.NPC, tokensCount, relationChange}); // Save to dialogue history
    } catch (error) {
        console.error('Failed to send message:', error);
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
      style={{display: "flex", flexDirection: "column", width: size.width, height: size.height, top: position.top, left: position.left}}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      <NPCHeader onMouseDown={onTitleMouseDown}>{npcContext?.name} {npcContext.role} {npcContext.getPlayerRelation()} {npcContext.state}</NPCHeader>
      <BoxRow>
        <Box style={{flex: "60%"}}>
          <MessageLog ref={messageLogRef}>
            {npcContext.dialogueHistory.map((message, index) => (
              <Message key={index} $type={message.type}>
                {message.text}
              </Message>
            ))}
          </MessageLog>
          <InputContainer>
            <Input
              data-testid="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a message..."
            />
            <Button data-testid="send-message" onClick={handleSend}>Send</Button>
          </InputContainer>
        </Box>
        <Box style={{ flex: "40%", marginLeft: "20px" }}>
          <ShopContainer>
            <div data-testid="items-to-sell">
              <h3>Shop</h3>
              {shopItems.length ? shopItems.map((item, index) => (
                  <ShopItem data-testid="trade-item" key={index}>
                    <span>{item.name}</span>
                    <span>{item.price} gold</span>
                    <ShopButton data-testid="buy-item" onClick={() => handleBuyItem(item)}>Buy</ShopButton>
                  </ShopItem>
                )) : <p>No items available.</p>}
            </div>
            <div data-testid="items-to-buy"></div>
            <h3>Sell</h3>
            {buyItems.length ? buyItems.map((item, index) => (
              <ShopItem key={index}>
                <span>{item.name}</span>
                <span>{item.price} gold</span>
                <ShopButton data-testid="sell-item" onClick={() => handleSellItem(item)}>Sell</ShopButton>
              </ShopItem>
              )) : (
              <p>No items available to sell.</p>
            )}
          </ShopContainer>
        </Box>
      </BoxRow>
      
    </DialogueContainer>
  );
};

export default observer(DialogueSystem);