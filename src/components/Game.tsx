import React, { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import DialogueSystem from './DialogueSystem';
import PlayerCustomization from './PlayerCustomization'; // Import PlayerCustomization

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

interface GameState {
  isDialogueOpen: boolean;
  activeNpcId: string | null;
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isDialogueOpen: false,
    activeNpcId: null,
  });

  const [player, setPlayer] = useState({
    name: '',
    gender: '',
    race: '',
    class: ''
  });

  const handleNpcInteraction = (npcId: string) => {
    setGameState({
      isDialogueOpen: true,
      activeNpcId: npcId,
    });
  };

  const handleCloseDialogue = () => {
    setGameState({
      isDialogueOpen: false,
      activeNpcId: null,
    });
  };

  return (
    <GameContainer>
      {!player.name ? (
        <PlayerCustomization onCustomize={setPlayer} />
      ) : (
        <>
          <Map onNpcInteraction={handleNpcInteraction} player={player} />
          {gameState.isDialogueOpen && (
            <DialogueSystem
              npcId={gameState.activeNpcId!}
              onClose={handleCloseDialogue}
              player={player}
            />
          )}
        </>
      )}
    </GameContainer>
  );
};

export default Game;