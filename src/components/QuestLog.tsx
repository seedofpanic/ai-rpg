import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore';
import { npcStore } from '../models/npcs';

const QuestLogContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(38, 70, 83, 0.95);
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const QuestTitle = styled.h3`
  margin: 0;
  color: #e76f51;
  font-size: 1.2em;
`;

const QuestDescription = styled.p`
  margin: 5px 0 15px 0;
  font-size: 0.9em;
  color: #e9ecef;
`;

interface QuestItemProps {
  $completed: boolean;
}

const QuestItem = styled.div<QuestItemProps>`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$completed ? 'rgba(46, 196, 182, 0.1)' : 'rgba(231, 111, 81, 0.1)'};
  border-left: 4px solid
    ${(props) => (props.$completed ? '#2ec4b6' : '#e76f51')};
`;

interface QuestStatusProps {
  $completed: boolean;
}

const QuestStatus = styled.span<QuestStatusProps>`
  font-size: 0.8em;
  color: ${(props) => (props.$completed ? '#2ec4b6' : '#e76f51')};
  float: right;
`;

const QuestRewards = styled.div`
  font-size: 0.8em;
  color: #ffd700;
  margin-top: 5px;
`;

const QuestGiver = styled.span`
  font-size: 0.8em;
  color: #adb5bd;
  margin-left: 5px;
`;

const QuestLog: React.FC = () => {
  return (
    <QuestLogContainer>
      <h2>Quest Log</h2>
      {gameStore.questLog.length === 0 ? (
        <p>No active quests</p>
      ) : (
        gameStore.questLog.map((quest) => (
          <QuestItem key={quest.id} $completed={quest.completed}>
            <QuestStatus $completed={quest.completed}>
              {quest.completed ? 'Completed' : 'Active'}
            </QuestStatus>
            <QuestTitle>
              {quest.title}
              <QuestGiver>
                (from {npcStore.npcs[quest.questGiverId]?.name || 'Unknown'})
              </QuestGiver>
            </QuestTitle>
            <QuestDescription>{quest.description}</QuestDescription>
            {quest.rewards && (
              <QuestRewards>
                Rewards: {quest.rewards.gold && `${quest.rewards.gold} gold`}
                {quest.rewards.items &&
                  quest.rewards.items.length > 0 &&
                  ` • ${quest.rewards.items.length} item${quest.rewards.items.length > 1 ? 's' : ''}`}
                {quest.rewards.experience &&
                  ` • ${quest.rewards.experience} XP`}
              </QuestRewards>
            )}
          </QuestItem>
        ))
      )}
    </QuestLogContainer>
  );
};

export default observer(QuestLog);
