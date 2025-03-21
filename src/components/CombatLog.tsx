import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

const LogContainer = styled.div`
  position: fixed;
  bottom: 15px;
  left: 0;
  width: 50%;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  font-size: 14px;
`;

export const combatLogStore = makeAutoObservable({
  log: [] as string[],
  push(msg: string) {
    this.log.unshift(msg);
  },
});

const CombatLog: React.FC = () => {
  return (
    <LogContainer>
      {combatLogStore.log.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </LogContainer>
  );
};

export default observer(CombatLog);
