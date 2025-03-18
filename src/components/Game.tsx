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
import { npcStore } from 'models/npcs';
import LootDialog from './LootDialog';
import { mobStore } from '../models/mobStore';

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

const HelpDialog = styled.div`
  line-height: 2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
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
  const [dialoguePosition, setDialoguePosition] = useState({
    top: 50,
    left: 550,
  });
  const [dialogueSize] = useState({ width: 900, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lootingNpcId, setLootingNpcId] = useState<string | null>(null);

  const handleMouseDown = () => {
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

  const updateQuest = (target: { name: string }) => {
    const quest = gameStore.questLog.find(
      (quest) => quest.subject.toLowerCase() === target.name.toLowerCase(),
    );
    if (quest) {
      quest.killCount++;
    }
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
        combatLogStore.push(`${mob.name} has been defeated!`);
        updateQuest(mob);
        return;
      }
    } else if (npc) {
      // Player attacks NPC
      player.attack(npc);
      combatLogStore.push(`${player.name} attacked ${npc.name}.`);

      if (!npc.isAlive()) {
        combatLogStore.push(`${npc.name} has been defeated!`);
        updateQuest(npc);
        return;
      }
    }
  };

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const npcContext = gameStore.activeNpcId
    ? npcStore.npcs[gameStore.activeNpcId]
    : null;

  useEffect(() => {
    if (npcContext?.relation === 0 && gameStore.isDialogueOpen) {
      gameStore.closeDialogue();
    }
  }, [npcContext?.relation]);

  // Add mob respawn effect
  useEffect(() => {
    const respawnInterval = setInterval(() => {
      mobStore.respawnMobs();
    }, 30000); // Check for respawns every 30 seconds

    return () => clearInterval(respawnInterval);
  }, []);

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
          {gameStore.isDialogueOpen && gameStore.currentNpcId && (
            <DialogueSystem
              onTitleMouseDown={handleMouseDown}
              npcId={gameStore.currentNpcId}
              onClose={handleCloseDialogue}
              position={dialoguePosition}
              size={dialogueSize}
            />
          )}
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
        </>
      )}
      <HelpButton onClick={toggleHelp}>Help</HelpButton>
      {isHelpOpen && (
        <>
          <Overlay onClick={toggleHelp} />
          <HelpDialog>
            <h2>Game Controls</h2>
            <p>WASD or Arrow Keys - Move character</p>

            <h2>Combat</h2>
            <p>Click on NPCs or mobs to initiate combat</p>
            <p>Click on dead NPCs or mobs to loot their inventory</p>
            <h2>Interaction</h2>
            <p>Click on NPCs to start conversations</p>
            <p>When talking to NPCs, you can:</p>
            <p>• Ask about their background and knowledge</p>
            <p>• Trade items with them</p>
            <p>• Receive and complete quests</p>
            <p>• Learn about the world and its lore</p>

            <h2>Game Features</h2>
            <p>• Quest Log - Track your active quests</p>
            <p>• Inventory - Manage your items and equipment</p>
            <p>• Combat Log - View your combat history</p>
            <p>• Dialogue System - Interact with NPCs through text</p>

            <h2>Tips</h2>
            <p>
              • Pay attention to NPC relationships - they affect quest rewards
            </p>
            <p>• Some NPCs may lie or have hidden agendas</p>
            <p>• Explore the world to discover new quests and opportunities</p>
            <p>• Keep track of your quest objectives in the Quest Log</p>
          </HelpDialog>
        </>
      )}
    </GameContainer>
  );
};

export default observer(Game);
