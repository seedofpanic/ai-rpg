import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import DialogueSystem from './dialogSystem/DialogueSystem';
import PlayerCustomization from './PlayerCustomization';
import PlayerInventory from './PlayerInventory'; // Import PlayerInventory
import QuestLog from './QuestLog';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore'; // Import gameStore
import CombatLog, { combatLogStore } from './CombatLog'; // Import CombatLog
import { npcStore } from 'models/npcs/npcStore';
import LootDialog from './LootDialog';
import { mobStore } from 'models/mobs/mobStore';
import HelpDialog from './HelpDialog';
import { Vector2 } from '../utils/vector2';
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: auto;
`;

const ButtonsBox = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  align-items: center;
`;

const WeatherTimeDisplay = styled.div`
  position: fixed;
  top: 60px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
`;

const HelpButton = styled.button`
  padding: 10px 20px;
  font-size: 24px;
  background-color: #e76f51;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e76f51;
  }
`;

const GithubButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4a4a4a;
  color: white;

  &:hover {
    background-color: #6a6a6a;
  }
`;

const WhatsNewButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background-color: #1a6b61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #145048;
  }
`;

const Game: React.FC = () => {
  const [dialoguePosition, setDialoguePosition] = useState({
    top: 400,
    left: 550,
  });
  const [dialogueSize] = useState({ width: 900, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lootingNpcId, setLootingNpcId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Calculate the offset between mouse position and dialog position
    setDragOffset({
      x: e.clientX - dialoguePosition.left,
      y: e.clientY - dialoguePosition.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDialoguePosition({
        top: e.clientY - dragOffset.y,
        left: e.clientX - dragOffset.x,
      });
    }
    gameStore.player?.updateArrowTarget(new Vector2(e.clientX, e.clientY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNpcInteraction = (npcId: string) => {
    const npc = npcStore.npcs[npcId];
    const mob = mobStore.mobs[npcId];

    if (mob) {
      if (!mob.isAlive()) {
        setLootingNpcId(npcId);
        return;
      }

      handleCombat(npcId);
    } else if (npc) {
      if (!npc.isAlive()) {
        setLootingNpcId(npcId);
        return;
      }

      handleCombat(npcId);
    }
  };

  const handleCloseDialogue = () => {
    gameStore.closeDialogue();
  };

  const handleCloseLoot = () => {
    setLootingNpcId(null);
  };

  const handleCombat = (targetId: string) => {
    const npc = npcStore.npcs[targetId];
    const mob = mobStore.mobs[targetId];
    const player = gameStore.player;

    if (!player) return;

    if (mob) {
      // Start continuous attack on mouse down
      player.startAttack(mob);
      combatLogStore.push(`${player.name} is attacking ${mob.name}.`);
    } else if (npc) {
      // Start continuous attack on mouse down
      player.startAttack(npc);
      combatLogStore.push(
        `${player.name} is attacking ${npc.background.name}.`,
      );
      player.events.add(`${player.name} attacked ${npc.background.name}`);
    }
  };

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const openWhatsNew = () => {
    window.open('/ai-rpg/what-s-new.html', '_blank');
  };

  const npcContext = gameStore.activeNpcId
    ? npcStore.npcs[gameStore.activeNpcId]
    : null;

  useEffect(() => {
    if (npcContext?.relation === 0 && gameStore.isDialogueOpen) {
      gameStore.closeDialogue();
    }
  }, [npcContext?.relation]);

  return (
    <GameContainer
      data-testid="game-container"
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => {
        if (gameStore.player) {
          gameStore.player.startAttack(new Vector2(e.clientX, e.clientY));
        }
      }}
      onMouseUp={() => {
        handleMouseUp();
        // Stop attacks when mouse is released
        if (gameStore.player) {
          gameStore.player.stopAttack();
        }
      }}
    >
      {!gameStore.player || gameStore.isOver ? (
        <PlayerCustomization />
      ) : (
        <>
          <Map
            onNpcInteraction={handleNpcInteraction}
            player={gameStore.player}
            onNpcHover={(npcId) => gameStore.setHoveredNpcId(npcId)}
          />
          <PlayerInventory player={gameStore.player} />{' '}
          {/* Add PlayerInventory */}
          <CombatLog />
          <QuestLog />
          {lootingNpcId && (
            <LootDialog
              target={
                mobStore.mobs[lootingNpcId] || npcStore.npcs[lootingNpcId]
              }
              player={gameStore.player}
              onClose={handleCloseLoot}
            />
          )}
          {gameStore.isDialogueOpen && gameStore.currentNpcId && (
            <DialogueSystem
              onTitleMouseDown={handleMouseDown}
              npcId={gameStore.currentNpcId}
              onClose={handleCloseDialogue}
              position={dialoguePosition}
              size={dialogueSize}
            />
          )}
          {gameStore.player && (
            <WeatherTimeDisplay>
              <div>Time: {gameStore.dayTime}</div>
              <div>Weather: {gameStore.weather}</div>
            </WeatherTimeDisplay>
          )}
        </>
      )}
      <ButtonsBox>
        <WhatsNewButton onClick={openWhatsNew}>What&apos;s New</WhatsNewButton>
        <HelpButton onClick={toggleHelp}>Help</HelpButton>
        <GithubButton
          onClick={() =>
            window.open('https://github.com/seedofpanic/ai-rpg', '_blank')
          }
        >
          GitHub
        </GithubButton>
      </ButtonsBox>
      {isHelpOpen && <HelpDialog onClose={toggleHelp} />}
    </GameContainer>
  );
};

export default observer(Game);
