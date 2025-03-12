import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../api';
import { npcStore } from '../models/npcs';
import { observer } from 'mobx-react';

interface DialogueSystemProps {
  npcId: string;
  onClose: () => void;
  player: {
    name: string;
    gender: string;
    race: string;
    class: string;
  };
}

const DialogueContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  background-color: rgba(38, 70, 83, 0.95);
  border-radius: 8px;
  padding: 20px;
  color: white;
`;

const MessageLog = styled.div`
  height: 200px;
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

const DialogueSystem: React.FC<DialogueSystemProps> = ({ npcId, onClose, player }) => {
  const npcContext = npcStore.npcs[npcId];
  const [input, setInput] = useState("");
  const messageLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!npcContext.dialogueHistory.length) {
      npcContext.dialogueHistory.push({text: npcStore.getNpcGreating(npcId), isPlayer: false}); // Save to dialogue history
    }
  }, [npcId]);

  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [npcId]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add player message to chat
    npcContext.dialogueHistory.push({text: input, isPlayer: false}); // Save to dialogue history
    setInput("");

    // Send message to API with NPC context
    try {
        const response = await sendMessage(input, npcId, player);
        npcContext.dialogueHistory.push({text: response, isPlayer: false}); // Save to dialogue history
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
    <DialogueContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <NPCHeader>{npcContext?.name}</NPCHeader>
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
          onKeyPress={handleKeyPress}
          placeholder="Enter a message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </InputContainer>
    </DialogueContainer>
  );
};

export default observer(DialogueSystem);