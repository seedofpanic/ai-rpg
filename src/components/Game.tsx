import React, { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import DialogueSystem from './DialogueSystem';
import PlayerCustomization from './PlayerCustomization';
import PlayerInventory from './PlayerInventory'; // Import PlayerInventory
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore'; // Import gameStore
import CombatLog, { combatLogStore } from './CombatLog'; // Import CombatLog
import { npcStore } from 'models/npcs';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: auto;
`;

const HelpButton = styled.button`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 18px;
  background-color: #e76f51;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e76f51;
  }
`;

const HelpDialog = styled.div`
  line-height: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: rgba(38, 70, 83, 0.95);
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Game: React.FC = () => {
  const [dialoguePosition, setDialoguePosition] = useState({ top: 50, left: 550 });
  const [dialogueSize, setDialogueSize] = useState({ width: 900, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
    if (!npcStore.npcs[npcId].isAlive()) {
      return;
    }

    if (gameStore.player?.combatMode) {
      handleCombat(npcId);
    } else {
      gameStore.openDialogue(npcId);
    }
  };

  const handleCloseDialogue = () => {
    gameStore.closeDialogue();
  };

  const handleCombat = (npcId: string) => {
    const npc = npcStore.npcs[npcId];
    const player = gameStore.player;

    if (!player || !npc) return;

    // Player attacks NPC
    player.attack(npc);
    combatLogStore.push(`${player.name} attacked ${npc.name}.`);

    if (!npc.isAlive()) {
      combatLogStore.push(`${npc.name} has been defeated!`);
      return;
    }
  };

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <GameContainer
      data-testid="game-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {!gameStore.player ? (
        <PlayerCustomization/>
      ) : (
        <>
          <div>{gameStore.player?.combatMode ? 'Combat Mode' : 'Exploration Mode'} press 'C' to switch</div>
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
          <CombatLog/>
        </>
      )}
      <HelpButton onClick={toggleHelp}>Help</HelpButton>
      {isHelpOpen && (
        <>
          <Overlay onClick={toggleHelp} />
          <HelpDialog>
            <h2>Game Help</h2>
            <p><strong>W/A/S/D:</strong> Move the player.</p>
            <p><strong>C:</strong> Toggle combat mode.</p>
            <p><strong>Click NPC:</strong> Interact or attack (in combat mode).</p>
            <p><strong>Inventory:</strong> Manage your items.</p>
            <p><strong>Dialogue:</strong> Communicate with NPCs.</p>
            <button onClick={toggleHelp} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
          </HelpDialog>
        </>
      )}
    </GameContainer>
  );
};

export default observer(Game);