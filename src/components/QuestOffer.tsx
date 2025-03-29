import React from 'react';
import styled from 'styled-components';
import { Quest } from '../models/Quest';
import { observer } from 'mobx-react';
import { itemsData } from 'models/itemsData';

const QuestOfferContainer = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
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

const QuestRewards = styled.div`
  font-size: 0.8em;
  color: #ffd700;
  margin-top: 5px;
`;

const QuestButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const AcceptButton = styled.button`
  padding: 5px 10px;
  background-color: #2a9d8f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #238677;
  }
`;

const DeclineButton = styled.button`
  padding: 5px 10px;
  background-color: #e76f51;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d05a4b;
  }
`;

interface QuestOfferProps {
  quest: Quest;
  handleAccept: () => void;
  handleDecline: () => void;
}

const QuestOffer: React.FC<QuestOfferProps> = ({
  quest,
  handleAccept,
  handleDecline,
}) => {
  return (
    <QuestOfferContainer data-testid="quest-offer">
      <QuestTitle data-testid="quest-offer-title">{quest.title}</QuestTitle>
      <QuestDescription data-testid="quest-offer-description">
        {quest.description}
      </QuestDescription>
      {quest.rewards && (
        <QuestRewards data-testid="quest-offer-rewards">
          Rewards: {quest.rewards.gold && `${quest.rewards.gold} gold`}
          {quest.rewards.items &&
            quest.rewards.items.length > 0 &&
            `${quest.rewards.items.map((item) => itemsData.get(item)?.name).join(', ')}`}
          {quest.rewards.experience && ` • ${quest.rewards.experience} XP`}
        </QuestRewards>
      )}
      <QuestButtonsContainer data-testid="quest-offer-buttons">
        <AcceptButton onClick={handleAccept} data-testid="accept-quest-button">
          Accept
        </AcceptButton>
        <DeclineButton
          onClick={handleDecline}
          data-testid="decline-quest-button"
        >
          Decline
        </DeclineButton>
      </QuestButtonsContainer>
    </QuestOfferContainer>
  );
};

export default observer(QuestOffer);
