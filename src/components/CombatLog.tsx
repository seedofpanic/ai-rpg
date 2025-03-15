import { makeObservable } from 'mobx';
import React, { useState } from 'react';
import styled from 'styled-components';

const LogContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  font-size: 14px;
`;

interface CombatLogProps {
}

export const combatLogStore = makeObservable([] as string[]);

const CombatLog: React.FC<CombatLogProps> = () => {
  return (
    <LogContainer>
      {combatLogStore.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </LogContainer>
  );
};

export default CombatLog;
