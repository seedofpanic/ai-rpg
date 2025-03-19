import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gameStore } from '../models/gameStore';
import { Player } from '../models/Player'; // Import Player
import { apiConfig } from 'api';

const CustomizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #264653;
  color: white;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 200px;
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 220px;
`;

const Button = styled.button`
  margin: 20px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #e76f51;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4a261;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
`;

const PlayerCustomization: React.FC = () => {
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  const [type, setType] = useState('');
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [selectedApi, setSelectedApi] = useState<'gemini' | 'proxy'>(
    gameStore.api,
  );
  const [isAdult, setIsAdult] = useState(false);

  // Restore settings from localStorage on component mount
  useEffect(() => {
    if (!apiConfig.apiKey) {
      const savedApiKey = localStorage.getItem('apiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    }

    const savedName = localStorage.getItem('playerName');
    const savedRace = localStorage.getItem('playerRace');
    const savedClass = localStorage.getItem('playerClass');
    const savedType = localStorage.getItem('playerType');
    const savedApi = localStorage.getItem('selectedApi') as 'gemini' | 'proxy';
    const savedAgeVerification = localStorage.getItem('isAdult') === 'true';

    if (savedName) setName(savedName);
    if (savedRace) setRace(savedRace);
    if (savedClass) setPlayerClass(savedClass);
    if (savedType) setType(savedType);
    if (savedApi) setSelectedApi(savedApi);
    if (savedAgeVerification) setIsAdult(savedAgeVerification);
  }, []);

  const handleApiKeySave = () => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    }
  };

  const handleSubmit = () => {
    if (selectedApi === 'gemini' && !apiKey) {
      alert('Please provide a valid API key for Gemini API.');
      return;
    }
    if (!isAdult) {
      alert('You must confirm that you are 18 years or older to play.');
      return;
    }
    if (name && race && playerClass) {
      apiConfig.apiKey = apiKey;
      gameStore.api = selectedApi;
      // Save settings to localStorage
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerRace', race);
      localStorage.setItem('playerClass', playerClass);
      localStorage.setItem('playerType', type);
      localStorage.setItem('selectedApi', selectedApi);
      localStorage.setItem('isAdult', isAdult.toString());

      const player = new Player(name, race, playerClass, type);
      gameStore.startGame(player);
    }
  };

  return (
    <CustomizationContainer>
      <h1>Game setup</h1>

      <Select
        value={selectedApi}
        onChange={(e) => setSelectedApi(e.target.value as 'gemini' | 'proxy')}
      >
        <option value="gemini">Gemini API</option>
        <option value="proxy">Demo API</option>
      </Select>

      {selectedApi === 'gemini' && !import.meta.env.VITE_GEMINI_API_KEY && (
        <>
          <p>
            You can acquire an API key{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          <Input
            data-testid="api-key-input"
            required
            type="password"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleApiKeySave}>
            Save API Key to local storage
          </Button>
        </>
      )}

      <h2>Character Customization</h2>

      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Type</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </Select>
      <Select value={race} onChange={(e) => setRace(e.target.value)}>
        <option value="">Race</option>
        <option value="Human">Human</option>
        <option value="Elf">Elf</option>
        <option value="Orc">Orc</option>
        <option value="Dwarf">Dwarf</option>
      </Select>
      <Select
        value={playerClass}
        onChange={(e) => setPlayerClass(e.target.value)}
      >
        <option value="">Class</option>
        <option value="Warrior">Warrior</option>
        <option value="Mage">Mage</option>
        <option value="Archer">Archer</option>
        <option value="Thief">Thief</option>
      </Select>
      <CheckboxContainer>
        <input
          type="checkbox"
          id="ageVerification"
          checked={isAdult}
          onChange={(e) => setIsAdult(e.target.checked)}
        />
        <label htmlFor="ageVerification">
          I confirm that I am 18 years or older
        </label>
      </CheckboxContainer>
      <Button onClick={handleSubmit}>Start Game</Button>
    </CustomizationContainer>
  );
};

export default PlayerCustomization;
