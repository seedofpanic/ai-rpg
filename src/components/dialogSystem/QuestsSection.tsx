import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { gameStore } from '../../models/gameStore';
import { dialogController } from '../../models/dialogController';
import QuestItem from 'components/QuestItem';
import QuestOffer from 'components/QuestOffer';

const QuestSection = styled.div`
  flex: 0.5;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  overflow: auto;
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

interface QuestsSectionProps {
  npcId: string;
  setInput: (text: string) => void;
}

const QuestsSection: React.FC<QuestsSectionProps> = ({ npcId, setInput }) => {
  const npcContext = dialogController.npcContext;
  if (!npcContext) return null;

  const acceptedQuests = gameStore.acceptedQuests.filter(
    (quest) => quest.questGiverId === npcId,
  );
  const offeredQuests = npcContext.offeredQuests;

  const handleAccept = (questId: string) => {
    gameStore.acceptQuest(questId, npcContext);
  };

  const handleDecline = (questId: string) => {
    gameStore.declineQuest(questId, npcContext);
  };

  return (
    <QuestSection data-testid="dialog-quest-section">
      <h3 data-testid="offered-quests-header">Offered Quests</h3>
      {offeredQuests.length > 0 ? (
        <>
          {offeredQuests.map((quest) => (
            <QuestOffer
              handleAccept={() => handleAccept(quest.id)}
              handleDecline={() => handleDecline(quest.id)}
              key={quest.id}
              quest={quest}
              data-testid={`offered-quest-${quest.id}`}
            />
          ))}
        </>
      ) : (
        <Button
          onClick={() => {
            setInput('Do you have a task for me?');
          }}
          data-testid="ask-for-quest-button"
        >
          Ask for a quest
        </Button>
      )}

      {acceptedQuests.length > 0 && (
        <>
          <h3 data-testid="available-quests-header">Active Quests</h3>
          {acceptedQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              npcName={npcContext.background.name}
              data-testid={`available-quest-${quest.id}`}
            />
          ))}
        </>
      )}

      {gameStore.completedQuests.length > 0 && (
        <>
          <h3 data-testid="completed-quests-header">Completed Quests</h3>
          {gameStore.completedQuests
            .filter((quest) => quest.questGiverId === npcId && quest.completed)
            .map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                npcName={npcContext.background.name}
                data-testid={`completed-quest-${quest.id}`}
              />
            ))}
        </>
      )}
    </QuestSection>
  );
};

export default observer(QuestsSection);
