import React from 'react';
import styled from 'styled-components';
import NPC from './NPC';
import Mob from './Mob';
import PlayerView from './PlayerView';
import { observer } from 'mobx-react-lite';
import { npcStore } from '../models/npcStore';
import { mobStore } from '../models/mobStore';
import { locationsStore } from '../models/location'; // Import locations
import { Player } from '../models/Player'; // Import Player
import { MOB_STATS } from '../models/mobStats';

const MapContainer = styled.div`
  width: 3700px;
  height: 2000px;
  background-color: #2a9d8f;
  position: relative;
  user-select: none;
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
  onNpcHover: (npcId: string | null) => void;
}

const Map: React.FC<MapProps> = ({ onNpcInteraction, player, onNpcHover }) => {
  return (
    <MapContainer>
      {locationsStore.locations.map((location, index) => (
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
            key={npc.id}
            id={npc.id}
            x={npc.position.x}
            y={npc.position.y}
            name={npc.name}
            health={npc.health}
            maxHealth={100}
            role={npc.role}
            location={npc.location}
            race={npc.race}
            personality={npc.personality}
            relation={npc.relation}
            onClick={() => onNpcInteraction(id)}
            onMouseEnter={() => onNpcHover(id)}
            onMouseLeave={() => onNpcHover(null)}
          />
        );
      })}
      {mobStore.mobIds.map((id) => {
        const mob = mobStore.mobs[id];

        return (
          <Mob
            key={mob.id}
            id={mob.id}
            x={mob.position.x}
            y={mob.position.y}
            name={mob.name}
            type={mob.type}
            health={mob.health}
            maxHealth={MOB_STATS[mob.type].health}
            isAggressive={mob.isAggressive}
            isAlive={mob.isAlive()}
            onClick={() => onNpcInteraction(id)}
          />
        );
      })}
    </MapContainer>
  );
};

export default observer(Map);
