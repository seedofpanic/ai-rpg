import React from 'react';
import styled from 'styled-components';

interface PlayerProps {
  x: number;
  y: number;
}

const PlayerContainer = styled.div<PlayerProps>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 30px;
  height: 30px;
  background-color: #264653;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
`;

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return <PlayerContainer x={x} y={y} />;
};

export default Player; 