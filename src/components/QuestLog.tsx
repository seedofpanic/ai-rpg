import React, { useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore';
import { npcStore } from '../models/npcStore';
import QuestItem from './QuestItem';

const QuestLogContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 300px;
  background-color: rgba(38, 70, 83, 0.95);
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const QuestLogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #e76f51;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;

  &:hover {
    color: #f4a261;
  }
`;

const QuestLog: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <QuestLogContainer>
      <QuestLogHeader>
        <h2>Quest Log</h2>
        <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '▼' : '▲'}
        </ToggleButton>
      </QuestLogHeader>
      {!isCollapsed && (
        <>
          {gameStore.questLog.length === 0 ? (
            <p>No active quests</p>
          ) : (
            gameStore.questLog.map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                npcName={
                  quest.questGiverId
                    ? npcStore.npcs[quest.questGiverId]?.background.name
                    : null
                }
              />
            ))
          )}
        </>
      )}
    </QuestLogContainer>
  );
};

export default observer(QuestLog);
