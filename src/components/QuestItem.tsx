import React from 'react';
import styled from 'styled-components';
import { Quest } from '../models/Quest';
import { observer } from 'mobx-react';
import { gameStore } from 'models/gameStore';
import { itemsData } from 'models/itemsData';

interface QuestItemProps {
  $completed: boolean;
}

const QuestItemContainer = styled.div<QuestItemProps>`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$completed ? 'rgba(46, 196, 182, 0.1)' : 'rgba(231, 111, 81, 0.1)'};
  border-left: 4px solid
    ${(props) => (props.$completed ? '#2ec4b6' : '#e76f51')};
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

const QuestProgress = styled.div`
  font-size: 0.8em;
  color: #adb5bd;
  margin-top: 5px;
  padding: 2px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const QuestFrom = styled.div`
  font-size: 0.8em;
  color: #adb5bd;
  margin-top: 5px;
  padding: 2px 0;
`;

interface QuestItemComponentProps {
  quest: Quest;
  npcName: string | null;
}

const QuestItem: React.FC<QuestItemComponentProps> = ({ quest, npcName }) => {
  const getProgress = () => {
    if (quest.action === 'kill') {
      return `${quest.killCount}/${quest.quantity} ${quest.subject} killed`;
    } else if (quest.action === 'bring') {
      return `${gameStore.player.inventory.find((slot) => slot.itemId === quest.subject)?.quantity || 0}/${quest.quantity} ${itemsData.get(quest.subject)?.name || ''} collected`;
    } else if (quest.action === 'find') {
      return `In progress`;
    }
    return 'Unknown action';
  };

  return (
    <QuestItemContainer $completed={quest.completed} data-testid="quest-item">
      <QuestStatus $completed={quest.completed} data-testid="quest-status">
        {quest.completed ? 'Completed' : 'Active'}
      </QuestStatus>
      <QuestTitle data-testid="quest-title">{quest.title}</QuestTitle>
      <QuestFrom>
        {npcName ? (
          <QuestGiver data-testid="quest-giver">(from {npcName})</QuestGiver>
        ) : (
          'Main Quest'
        )}
      </QuestFrom>
      <QuestDescription data-testid="quest-description">
        {quest.description}
      </QuestDescription>
      {!quest.completed && (
        <QuestProgress data-testid="quest-progress">
          Progress: {getProgress()}
        </QuestProgress>
      )}
      {quest.rewards && (
        <QuestRewards data-testid="quest-rewards">
          Rewards: {quest.rewards.gold && `${quest.rewards.gold} gold`}
          {quest.rewards.items &&
            quest.rewards.items.length > 0 &&
            ` • ${quest.rewards.items.length} item${quest.rewards.items.length > 1 ? 's' : ''}`}
          {quest.rewards.experience && ` • ${quest.rewards.experience} XP`}
        </QuestRewards>
      )}
    </QuestItemContainer>
  );
};

export default observer(QuestItem);
