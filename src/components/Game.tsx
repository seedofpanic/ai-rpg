import React from 'react';
import styled from 'styled-components';
import Map from './Map';
import DialogueSystem from './DialogueSystem';
import PlayerCustomization from './PlayerCustomization';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore'; // Import gameStore

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Game: React.FC = () => {
  const handleNpcInteraction = (npcId: string) => {
    gameStore.openDialogue(npcId);
  };

  const handleCloseDialogue = () => {
    gameStore.closeDialogue();
  };

  return (
    <GameContainer>
      {!gameStore.player ? (
        <PlayerCustomization onCustomize={(player) => gameStore.setPlayer(player)} />
      ) : (
        <>
          <Map onNpcInteraction={handleNpcInteraction} player={gameStore.player} />
          {gameStore.isDialogueOpen && (
            <DialogueSystem
              npcId={gameStore.activeNpcId!}
              onClose={handleCloseDialogue}
              player={gameStore.player}
            />
          )}
        </>
      )}
    </GameContainer>
  );
};

export default observer(Game);