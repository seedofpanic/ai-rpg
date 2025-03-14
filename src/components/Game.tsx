import React, { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import DialogueSystem from './DialogueSystem';
import PlayerCustomization from './PlayerCustomization';
import PlayerInventory from './PlayerInventory'; // Import PlayerInventory
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore'; // Import gameStore

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: auto;
`;

const Game: React.FC = () => {
  const [dialoguePosition, setDialoguePosition] = useState({ top: 50, left: 550 });
  const [dialogueSize, setDialogueSize] = useState({ width: 900, height: 600 });
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
      data-testid="game-container"
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
              position={dialoguePosition}
              size={dialogueSize}
            />
          )}
          <PlayerInventory player={gameStore.player} /> {/* Add PlayerInventory */}
        </>
      )}
    </GameContainer>
  );
};

export default observer(Game);