import React from 'react';
import styled from 'styled-components';

interface PlayerProps {
  x: number;
  y: number;
}

const PlayerContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #264653;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
`;

const PlayerView: React.FC<PlayerProps> = ({ x, y }) => {
  return <PlayerContainer data-testid="player-view" style={{left: x, top: y}} />;
};

export default PlayerView; 