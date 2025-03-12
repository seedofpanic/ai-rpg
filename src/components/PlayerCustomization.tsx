import React, { useState } from 'react';
import styled from 'styled-components';

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
  onCustomize: (player: { name: string; gender: string; race: string; class: string }) => void;
}

const PlayerCustomization: React.FC<PlayerCustomizationProps> = ({ onCustomize }) => {
  const [name, setName] = useState('Yin');
  const [gender, setGender] = useState('Female');
  const [race, setRace] = useState('Elf');
  const [playerClass, setPlayerClass] = useState('Mage');

  const handleSubmit = () => {
    if (name && gender && race && playerClass) {
      onCustomize({ name, gender, race, class: playerClass });
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
