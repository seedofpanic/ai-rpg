import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../api';
import { npcStore } from '../models/npcs';
import { observer } from 'mobx-react';
import { gameStore } from '../models/gameStore'; // Import gameStore
import { itemsData } from 'models/itemsData';
import { t } from '../localization';

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

const Message = styled.div<{ $isPlayer?: boolean }>`
  margin: 5px 0;
  padding: 5px 10px;
  background-color: ${props => props.$isPlayer ? '#e76f51' : '#2a9d8f'};
  border-radius: 4px;
  max-width: 80%;
  margin-left: ${props => props.$isPlayer ? 'auto' : '0'};
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

  useEffect(() => {
    if (!npcContext.dialogueHistory.length) {
      npcContext.addDialogHistory({text: npcStore.getNpcGreating(npcId), isPlayer: false, tokensCount: 20}); // Save to dialogue history
    }
  }, [npcId]);

  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [npcId]);

  const parseShopItems = (message: string) => {
    const items: { name: string; price: number }[] = [];
    const regex = /<sell>(.*?)<\/sell>/;
    let match = message.match(regex);
    if (match && match[1]) {
      const itemsMatch = match[1].split(';');
      for (const item of itemsMatch) {
        const [name, price] = item.split(',');
        items.push({ name: name.trim(), price: parseFloat(price.trim()) });
      }
    }
    return items;
  };

  const handleBuyItem = (item: { name: string; price: number }) => {
    if (gameStore.player.gold >= item.price) {
      const itemId = itemsData.keys().find(id => itemsData.get(id)?.name === item.name);
      if (itemId) {
        gameStore.player.gold -= item.price;
        setShopItems(shopItems.filter(i => i !== item));
      
        npcContext.removeItem(itemId);
        gameStore.player?.addItemToInventory({ itemId, quantity: 1 });
      }
      console.log(`${t("boughtItem", { itemName: item.name, itemPrice: item.price })}`);
    } else {
      console.log(t("notEnoughGold"));
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    // TODO: Will need to calculate tokens count based on the message
    npcContext.dialogueHistory.push({text: input, isPlayer: true, tokensCount: 30}); // Save to dialogue history
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
        setShopItems(items);
        const message = text.replace(/\*(.*?)\*/g, '').replace(/<sell>.*?<\/sell>/, ""); // Remove state from response
        
        const relationChange = npcContext.getRelationChange(npcContext.state);
        npcContext.changeRelation(relationChange); // Change relation based on response
        npcContext.dialogueHistory.push({text: message, isPlayer: false, tokensCount, relationChange}); // Save to dialogue history
    } catch (error) {
        console.error(t("failedToSendMessage"), error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <DialogueContainer
      style={{display: "flex", flexDirection: "column", width: size.width, height: size.height, top: position.top, left: position.left}}
    >
      <CloseButton onClick={onClose}>{t("close")}</CloseButton>
      <NPCHeader onMouseDown={onTitleMouseDown}>{npcContext?.name} {npcContext.role} {npcContext.getPlayerRelation()} {npcContext.state}</NPCHeader>
      <BoxRow>
        <Box style={{flex: "60%"}}>
          <MessageLog ref={messageLogRef}>
            {npcContext.dialogueHistory.map((message, index) => (
              <Message key={index} $isPlayer={message.isPlayer}>
                {message.text}
              </Message>
            ))}
          </MessageLog>
          <InputContainer>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("enterMessage")}
            />
            <Button onClick={handleSend}>{t("send")}</Button>
          </InputContainer>
        </Box>
        <Box style={{ flex: "40%", marginLeft: "20px" }}>
          <ShopContainer>
            <h3>{t("shop")}</h3>
            {shopItems.length > 0 ? (
              shopItems.map((item, index) => (
                <ShopItem key={index}>
                  <span>{item.name}</span>
                  <span>{item.price} {t("gold")}</span>
                  <ShopButton onClick={() => handleBuyItem(item)}>{t("buy")}</ShopButton>
                </ShopItem>
              ))
            ) : (
              <p>{t("noItemsAvailable")}</p>
            )}
          </ShopContainer>
        </Box>
      </BoxRow>
      
    </DialogueContainer>
  );
};

export default observer(DialogueSystem);