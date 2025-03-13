import React, { useState } from 'react';
import styled from 'styled-components';
import NPC from './NPC';
import PlayerView from './PlayerView';
import { observer } from 'mobx-react-lite';
import { npcStore } from '../models/npcs';
import { locations } from '../models/npcs'; // Import locations
import { Player } from '../models/Player'; // Import Player

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2a9d8f;
  position: relative;
`;

const LocationContainer = styled.div<{ x: number; y: number; width: number; height: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid #264653;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px;
  box-sizing: border-box;
`;

interface MapProps {
  onNpcInteraction: (npcId: string) => void;
  player: Player;
}

const Map: React.FC<MapProps> = ({ onNpcInteraction, player }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 300, y: 300 });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlayerPosition({ x, y });
  };

  return (
    <MapContainer onClick={handleClick}>
      <PlayerView x={playerPosition.x} y={playerPosition.y} />
      {locations.map((location, index) => (
        <LocationContainer key={index} x={location.x} y={location.y} width={location.width} height={location.height}>
          {location.name}
        </LocationContainer>
      ))}
      {npcStore.npcIds.map((id) => (
        <NPC
          key={npcStore.npcs[id].id}
          id={npcStore.npcs[id].id}
          x={npcStore.npcs[id].x}
          y={npcStore.npcs[id].y}
          name={npcStore.npcs[id].name}
          role={npcStore.npcs[id].role}
          location={npcStore.npcs[id].location}
          onClick={() => onNpcInteraction(id)}
        />
      ))}
    </MapContainer>
  );
};

export default observer(Map);