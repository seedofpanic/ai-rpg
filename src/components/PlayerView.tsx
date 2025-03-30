import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../models/gameStore';

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
  z-index: 10;
`;

const AttackBarContainer = styled.div`
  position: absolute;
  width: 40px;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  transform: translateX(-50%);
  top: -15px;
  left: 50%;
  z-index: 11;
`;

const AttackBarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  transition:
    width 0.05s linear,
    background-color 0.1s ease;
`;

// Small indicator that appears when damage is dealt
const DamageIndicator = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #e76f51;
  font-weight: bold;
  font-size: 14px;
  opacity: 0;
  animation: fadeUp 0.5s ease-out;

  @keyframes fadeUp {
    0% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
  }
`;

const PlayerView: React.FC<PlayerProps> = ({ x, y }) => {
  const player = gameStore.player;

  // Return early if no player exists
  if (!player) {
    return (
      <PlayerContainer data-testid="player-view" style={{ left: x, top: y }} />
    );
  }

  // Calculate attack progress for visualization
  const isAttacking = player.isAttacking;
  const attackProgress = player.attackTimer / player.attackCooldown;

  // Determine if we're at the damage point (between 0.25 and next frame)
  const isDamagePoint =
    attackProgress >= player.attackDamagePoint / player.attackCooldown &&
    attackProgress < (player.attackDamagePoint + 100) / player.attackCooldown;

  return (
    <PlayerContainer data-testid="player-view" style={{ left: x, top: y }}>
      {isAttacking && (
        <>
          <AttackBarContainer>
            <AttackBarFill
              style={{
                width: `${attackProgress * 100}%`,
                backgroundColor: isDamagePoint ? '#e76f51' : '#2a9d8f',
              }}
            />
          </AttackBarContainer>
          {player.attackDoneThisCycle && (
            <DamageIndicator>Attack!</DamageIndicator>
          )}
        </>
      )}
    </PlayerContainer>
  );
};

export default observer(PlayerView);
