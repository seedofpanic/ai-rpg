import React from 'react';
import styled from 'styled-components';
import { gameStore } from '../models/gameStore';
import { observer } from 'mobx-react';
import ChevronDown from './icons/ChevronDown';

const SettingsOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SettingsPanel = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const SettingItem = styled.div`
  margin-bottom: 1.5rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledChevron = styled(ChevronDown)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  width: 20px;
  height: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 40px;

  &:hover {
    border-color: #bbb;
  }

  &:focus {
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
`;

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = observer(({ isOpen, onClose }) => {
  const handleApiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    gameStore.api = event.target.value as 'gemini' | 'proxy';
  };

  return (
    <SettingsOverlay $isOpen={isOpen} onClick={onClose}>
      <SettingsPanel onClick={(e) => e.stopPropagation()}>
        <SettingsHeader>
          <h2>Settings</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </SettingsHeader>
        <SettingItem>
          <h3>API Configuration</h3>
          <Description>
            Select which API to use for NPC interactions
          </Description>
          <SelectWrapper>
            <Select value={gameStore.api} onChange={handleApiChange}>
              <option value="gemini">Gemini API</option>
              <option value="proxy">Proxy API</option>
            </Select>
            <StyledChevron />
          </SelectWrapper>
        </SettingItem>
      </SettingsPanel>
    </SettingsOverlay>
  );
});

export default Settings;
