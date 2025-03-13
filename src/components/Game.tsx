import React, { useState } from 'react';
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
  const [dialoguePosition, setDialoguePosition] = useState({ top: 200, left: 500 });
  const [dialogueSize, setDialogueSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDialoguePosition({
        top: e.clientY - 20,
        left: e.clientX + 100,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNpcInteraction = (npcId: string) => {
    gameStore.openDialogue(npcId);
  };

  const handleCloseDialogue = () => {
    gameStore.closeDialogue();
  };

  return (
    <GameContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {!gameStore.player ? (
        <PlayerCustomization onCustomize={(player) => gameStore.setPlayer(player)} />
      ) : (
        <>
          <Map onNpcInteraction={handleNpcInteraction} player={gameStore.player} />
          {gameStore.isDialogueOpen && (
            <DialogueSystem
              onTitleMouseDown={handleMouseDown}
              npcId={gameStore.activeNpcId!}
              onClose={handleCloseDialogue}
              player={gameStore.player}
              position={dialoguePosition}
              size={dialogueSize}
            />
          )}
        </>
      )}
    </GameContainer>
  );
};

export default observer(Game);