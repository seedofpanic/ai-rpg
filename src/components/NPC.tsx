import React from 'react';
import styled from 'styled-components';

interface NPCProps {
  isAlive: boolean;
  id: string;
  x: number;
  y: number;
  name: string;
  role: string;
  location: {
    name: string;
    description: string;
  };
  onClick: () => void;
}

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
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 8px;
  display: none;
  text-align: center;
  z-index: 10;

  ${NPCContainer}:hover & {
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

const NPCLocation = styled.div`
  font-size: 10px;
  color: #aaa;
`;

const NPC: React.FC<NPCProps> = ({
  x,
  y,
  name,
  role,
  location,
  onClick,
  isAlive,
}) => {
  return (
    <NPCContainer
      data-testid="npc-view"
      style={{ left: x, top: y }}
      onClick={onClick}
      $isAlive={isAlive}
    >
      <NPCInfo>
        <NPCName>{name}</NPCName>
        <NPCRole>{role}</NPCRole>
        <NPCLocation>{location.name}</NPCLocation>
      </NPCInfo>
    </NPCContainer>
  );
};

export default NPC;
