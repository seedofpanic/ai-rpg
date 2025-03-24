import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
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

const ToggleButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: 1px solid white;
  color: white;
  padding: 2px 8px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 3px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PreviewText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30px;
`;

export const combatLogStore = makeAutoObservable({
  log: [] as string[],
  push(msg: string) {
    this.log.unshift(msg);
  },
});

const CombatLog: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <LogContainer
      data-testid="combat-log"
      style={{ maxHeight: isCollapsed ? '36px' : '200px' }}
    >
      <ToggleButton
        data-testid="combat-log-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '▲' : '▼'}
      </ToggleButton>
      {isCollapsed ? (
        <PreviewText data-testid="combat-log-preview">
          {combatLogStore.log[0] || 'No combat messages'}
        </PreviewText>
      ) : combatLogStore.log.length > 0 ? (
        combatLogStore.log.map((log, index) => (
          <div key={index} data-testid={`combat-log-entry-${index}`}>
            {log}
          </div>
        ))
      ) : (
        'No combat messages'
      )}
    </LogContainer>
  );
};

export default observer(CombatLog);
