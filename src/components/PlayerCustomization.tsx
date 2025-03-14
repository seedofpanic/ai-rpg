import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gameStore } from '../models/gameStore';
import { Player } from '../models/Player'; // Import Player

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

interface PlayerCustomizationProps {
  onCustomize: (player: Player) => void;
}

const PlayerCustomization: React.FC<PlayerCustomizationProps> = ({ onCustomize }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [race, setRace] = useState('');
  const [playerClass, setPlayerClass] = useState('');

  // Restore settings from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    const savedGender = localStorage.getItem('playerGender');
    const savedRace = localStorage.getItem('playerRace');
    const savedClass = localStorage.getItem('playerClass');

    if (savedName) setName(savedName);
    if (savedGender) setGender(savedGender);
    if (savedRace) setRace(savedRace);
    if (savedClass) setPlayerClass(savedClass);
  }, []);

  const handleSubmit = () => {
    if (name && gender && race && playerClass) {
      // Save settings to localStorage
      localStorage.setItem('playerName', name);
      localStorage.setItem('playerGender', gender);
      localStorage.setItem('playerRace', race);
      localStorage.setItem('playerClass', playerClass);

      const player = new Player(name, gender, race, playerClass);
      gameStore.setPlayer(player); // Set player in gameStore
      onCustomize(player);
    }
  };

  return (
    <CustomizationContainer>
      <h1>Character Customization</h1>
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </Select>
      <Select value={race} onChange={(e) => setRace(e.target.value)}>
        <option value="">Race</option>
        <option value="Human">Human</option>
        <option value="Elf">Elf</option>
        <option value="Orc">Orc</option>
        <option value="Dwarf">Dwarf</option>
      </Select>
      <Select value={playerClass} onChange={(e) => setPlayerClass(e.target.value)}>
        <option value="">Class</option>
        <option value="Warrior">Warrior</option>
        <option value="Mage">Mage</option>
        <option value="Archer">Archer</option>
        <option value="Thief">Thief</option>
      </Select>
      <Button onClick={handleSubmit}>Start Game</Button>
    </CustomizationContainer>
  );
};

export default PlayerCustomization;
