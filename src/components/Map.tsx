import React from 'react';
import styled from 'styled-components';
import NPC from './NPC';
import Mob from './Mob';
import PlayerView from './PlayerView';
import { observer } from 'mobx-react-lite';
import { npcStore } from 'models/npcs/npcStore';
import { mobStore } from 'models/mobs/mobStore';
import { locationsStore } from 'models/location'; // Import locations
import { Player } from 'models/Player'; // Import Player
import ProjectileView from './ProjectileView';
import { Vector2 } from 'utils/vector2';
import { MOB_STATS } from 'models/mobs/mobStats';

const MapContainer = styled.div`
  width: 3700px;
  height: 2500px;
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
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (player.combatMode !== 'ranged') {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    player.shootArrow(new Vector2(x, y));
  };

  return (
    <MapContainer onClick={handleMapClick}>
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
      <ProjectileView />
      {npcStore.npcIds.map((id) => {
        const npc = npcStore.npcs[id];

        return (
          <NPC
            isAlive={npc.isAlive()}
            key={npc.id}
            id={npc.id}
            x={npc.position.x}
            y={npc.position.y}
            name={npc.background.name}
            health={npc.health}
            maxHealth={100}
            role={npc.background.role}
            location={npc.location}
            race={npc.background.race}
            personality={npc.background.personality}
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
