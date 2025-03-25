import React from 'react';
import styled from 'styled-components';

const HelpDialogContainer = styled.div`
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

interface HelpDialogProps {
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onClose }) => {
  return (
    <>
      <Overlay onClick={onClose} />
      <HelpDialogContainer>
        <h2>Basic Controls</h2>
        <p>WASD or Arrow Keys - Move character</p>
        <p>E Key - Interact with NPCs when close enough</p>

        <h2>Combat System</h2>
        <p>• Click on NPCs or mobs to attack them</p>
        <p>• Stay within range (50 units) to deal damage</p>
        <p>• Click on dead NPCs or mobs to loot their inventory</p>

        <h2>NPC Interaction</h2>
        <p>• Move close enough to the NPC</p>
        <p>• Hover your mouse over NPCs to highlight them</p>
        <p>• Press E key to start a conversation</p>
        <p>• NPCs have unique personalities and relationships</p>
        <p>• Some NPCs may be hostile and attack on sight</p>
        <p>• NPC relationships affect quest rewards</p>

        <h2>Tips</h2>
        <p>• Pay attention to NPC relationships - they affect quest rewards</p>
        <p>• Some NPCs may lie or have hidden agendas</p>
        <p>• Explore the world to discover new quests and opportunities</p>
        <p>• Keep track of your quest objectives in the Quest Log</p>
        <p>• Be careful around hostile NPCs and mobs</p>
        <p>• Use your starting gold wisely for equipment and items</p>
      </HelpDialogContainer>
    </>
  );
};

export default HelpDialog;
