import React, { useState } from 'react';
import styled from 'styled-components';
import type { MobType } from '../models/mobs/mob';

interface MobProps {
  id: string;
  x: number;
  y: number;
  name: string;
  type: MobType;
  health: number;
  maxHealth: number;
  isAggressive: boolean;
  isAlive: boolean;
  onMouseDown: () => void;
}

const HoverableContainer = styled.div`
  position: relative;
`;

const MobContainer = styled.div<{ $isAggressive: boolean; $isAlive: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.$isAlive
      ? props.$isAggressive
        ? '#e63946' // Aggressive red
        : '#bc6c25' // Normal brown
      : 'rgba(50, 50, 50, 1)'}; // Dead gray
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s,
    background-color 0.3s;
  transform: translate3d(-50%, -50%, 0);

  &:hover {
    width: 45px;
    height: 45px;
    opacity: 0.9;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid
      ${(props) => (props.$isAggressive ? '#ff0000' : 'transparent')};
    animation: ${(props) =>
      props.$isAggressive ? 'pulse 1.5s infinite' : 'none'};
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const MobInfo = styled.div`
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

const MobName = styled.div`
  font-size: 14px;
  color: white;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MobType = styled.div`
  font-size: 12px;
  color: #e76f51;
  margin-bottom: 4px;
`;

const MobDetails = styled.div`
  font-size: 11px;
  color: #ddd;
  margin-bottom: 2px;
`;

const Mob: React.FC<MobProps> = ({
  id,
  x,
  y,
  name,
  type,
  health,
  maxHealth,
  isAggressive,
  isAlive,
  onMouseDown,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX + 15, y: e.clientY + 5 });
  };

  return (
    <HoverableContainer>
      <MobContainer
        id={id}
        data-type={'mob'}
        data-testid={`mob-view-${id}`}
        style={{ left: x, top: y }}
        onMouseDown={onMouseDown}
        onMouseMove={handleMouseMove}
        $isAggressive={isAggressive}
        $isAlive={isAlive}
      >
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
      </MobContainer>
      <MobInfo
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
        <MobName>{name}</MobName>
        <MobType>{type}</MobType>
        <MobDetails>
          Health: {health}/{maxHealth}
        </MobDetails>
        <MobDetails>
          Status: {isAggressive ? 'Aggressive' : 'Patrolling'}
        </MobDetails>
      </MobInfo>
    </HoverableContainer>
  );
};

export default Mob;
