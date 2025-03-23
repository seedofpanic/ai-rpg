import React, { useState } from 'react';
import styled from 'styled-components';

interface NPCProps {
  isAlive: boolean;
  id: string;
  x: number;
  y: number;
  name: string;
  health: number;
  maxHealth: number;
  role?: string;
  location: {
    name: string;
    description: string;
  };
  race: string;
  personality?: string;
  relation: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HoverableContainer = styled.div`
  position: relative;
`;

const NPCContainer = styled.div<{ $isAlive: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.$isAlive ? '#e76f51' : 'rgba(50, 50, 50, 1)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s;
  transform: translate3d(-50%, -50%, 0);

  &:hover {
    width: 45px;
    height: 45px;
    opacity: 0.9;
  }
`;

const NPCInfo = styled.div`
  position: fixed;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 8px;
  display: none;
  text-align: center;
  z-index: 1000;
  pointer-events: none;

  ${HoverableContainer}:hover & {
    display: block;
  }
`;

const NPCName = styled.div`
  font-size: 14px;
  color: white;
  font-weight: bold;
  margin-bottom: 4px;
`;

const NPCRole = styled.div`
  font-size: 12px;
  color: #e76f51;
  margin-bottom: 4px;
`;

const NPCDetails = styled.div`
  font-size: 11px;
  color: #ddd;
  margin-bottom: 2px;
`;

const NPCLocation = styled.div`
  font-size: 10px;
  color: #aaa;
  font-style: italic;
`;

const InteractionHint = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  display: none;
  pointer-events: none;

  ${HoverableContainer}:hover & {
    display: block;
  }
`;

const getRelationColor = (relation: number) => {
  if (relation > 85) return '#2ecc71'; // Green for friendly
  if (relation > 60) return '#f1c40f'; // Yellow for neutral
  if (relation > 30) return '#e67e22'; // Orange for unfriendly
  return '#e74c3c'; // Red for hostile
};

const NPC: React.FC<NPCProps> = ({
  x,
  y,
  name,
  health,
  maxHealth,
  role,
  location,
  race,
  personality,
  relation,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isAlive,
  id,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Add offset to prevent info box from being under cursor
    setMousePos({ x: e.clientX + 15, y: e.clientY + 5 });
  };

  return (
    <HoverableContainer
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <NPCContainer
        data-testid={`npc-view-${id}`}
        style={{ left: x, top: y }}
        onClick={onClick}
        $isAlive={isAlive}
      >
        <InteractionHint>Interact [E]</InteractionHint>
        {health < maxHealth && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: '5px',
              backgroundColor: '#ccc',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(health / maxHealth) * 100}%`,
                height: '100%',
                backgroundColor:
                  health > maxHealth * 0.3 ? '#2a9d8f' : '#e63946',
                transition: 'width 0.2s',
              }}
            />
          </div>
        )}
      </NPCContainer>
      <NPCInfo
        style={{
          left:
            mousePos.x + window.innerWidth - 250 < 0
              ? mousePos.x - 15
              : mousePos.x + 30,
          top:
            mousePos.y + 200 > window.innerHeight
              ? mousePos.y - 150
              : mousePos.y + 30,
        }}
      >
        <NPCName>{name}</NPCName>
        <NPCRole>{role}</NPCRole>
        <NPCDetails>
          {race} • {personality}
        </NPCDetails>
        <NPCDetails style={{ color: getRelationColor(relation) }}>
          Relation: {relation}%
        </NPCDetails>
        <NPCLocation>{location.name}</NPCLocation>
      </NPCInfo>
    </HoverableContainer>
  );
};

export default NPC;
