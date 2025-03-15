import React from 'react';
import styled from 'styled-components';
import NPC from './NPC';
import PlayerView from './PlayerView';
import { observer } from 'mobx-react-lite';
import { npcStore } from '../models/npcs';
import { locations } from '../models/location'; // Import locations
import { Player } from '../models/Player'; // Import Player

const MapContainer = styled.div`
  width: 2000px;
  height: 1500px;
  background-color: #2a9d8f;
  position: relative;
`;

const LocationContainer = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
}>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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
  return (
    <MapContainer>
      {locations.map((location, index) => (
        <LocationContainer
          key={index}
          x={location.x}
          y={location.y}
          width={location.width}
          height={location.height}
        >
          {location.name}
        </LocationContainer>
      ))}
      <PlayerView x={player.position.x} y={player.position.y} />
      {npcStore.npcIds.map((id) => {
        const npc = npcStore.npcs[id];

        return (
          <NPC
            isAlive={npc.isAlive()}
            key={npcStore.npcs[id].id}
            id={npcStore.npcs[id].id}
            x={npcStore.npcs[id].position.x}
            y={npcStore.npcs[id].position.y}
            name={npcStore.npcs[id].name}
            role={npcStore.npcs[id].role}
            location={npcStore.npcs[id].location}
            onClick={() => onNpcInteraction(id)}
          />
        );
      })}
    </MapContainer>
  );
};

export default observer(Map);
