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

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: auto;
`;

const HelpButton = styled.button`
  position: fixed;
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

const WhatsNewButton = styled.button`
  position: fixed;
  top: 10px;
  left: calc(50% + 160px);
  padding: 10px 20px;
  font-size: 18px;
  background-color: #2a9d8f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218879;
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
      // Player attacks mob
      player.attack(mob);
      combatLogStore.push(`${player.name} attacked ${mob.name}.`);

      if (!mob.isAlive()) {
        player.events.add(`${player.name} defeated some number of ${mob.name}`);
        combatLogStore.push(`${mob.name} has been defeated!`);
        gameStore.updateKillQuest(mob.type);
        setTimeout(
          () => {
            mobStore.removeMob(mob.id);
            mobStore.respawnMob(mob);
          },
          10 * 60 * 1000,
        );
        return;
      }
    } else if (npc) {
      // Player attacks NPC
      player.attack(npc);
      combatLogStore.push(`${player.name} attacked ${npc.background.name}.`);
      player.events.add(`${player.name} attacked ${npc.background.name}`);

      if (!npc.isAlive()) {
        combatLogStore.push(`${npc.background.name} has been defeated!`);
        player.events.add(`${player.name} killed ${npc.background.name}`);
        gameStore.updateKillQuest(npc.background.name, npc.id);
        return;
      }
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
      onMouseUp={handleMouseUp}
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
        </>
      )}
      <HelpButton onClick={toggleHelp}>Help</HelpButton>
      <WhatsNewButton onClick={openWhatsNew}>What&apos;s New</WhatsNewButton>
      {isHelpOpen && <HelpDialog onClose={toggleHelp} />}
    </GameContainer>
  );
};

export default observer(Game);
