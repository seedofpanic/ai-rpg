import React from 'react';
import styled from 'styled-components';

interface NPCProps {
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

const NPCContainer = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 40px;
  height: 40px;
  background-color: #e76f51;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.1);
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

const NPC: React.FC<NPCProps> = ({ id, x, y, name, role, location, onClick }) => {
  return (
    <NPCContainer x={x} y={y} onClick={onClick}>
      <NPCInfo>
        <NPCName>{name}</NPCName>
        <NPCRole>{role}</NPCRole>
        <NPCLocation>{location.name}</NPCLocation>
      </NPCInfo>
    </NPCContainer>
  );
};

export default NPC; 