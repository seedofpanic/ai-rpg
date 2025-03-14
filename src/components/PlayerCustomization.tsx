import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gameStore } from '../models/gameStore';
import { Player } from '../models/Player'; // Import Player
import { t, currentLanguage } from '../localization'; // Import setLanguage
import { observer } from 'mobx-react';

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

  useEffect(() => {
    const savedSettings = localStorage.getItem('playerSettings');
    if (savedSettings) {
      const { name, gender, race, playerClass } = JSON.parse(savedSettings);
      setName(name);
      setGender(gender);
      setRace(race);
      setPlayerClass(playerClass);
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      currentLanguage.setLanguage(savedLanguage);
    }
  }, []);

  const handleSubmit = () => {
    if (name && gender && race && playerClass) {
      const player = new Player(name, gender, race, playerClass);
      gameStore.setPlayer(player); // Set player in gameStore
      localStorage.setItem('playerSettings', JSON.stringify({ name, gender, race, playerClass }));
      onCustomize(player);
    }
  };

  return (
    <CustomizationContainer>
      <h1>{t("characterCustomization")}</h1>
      <Input
        type="text"
        placeholder={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">{t("gender")}</option>
        <option value="Male">{t("male")}</option>
        <option value="Female">{t("female")}</option>
      </Select>
      <Select value={race} onChange={(e) => setRace(e.target.value)}>
        <option value="">{t("race")}</option>
        <option value="Human">{t("human")}</option>
        <option value="Elf">{t("elf")}</option>
        <option value="Orc">{t("orc")}</option>
        <option value="Dwarf">{t("dwarf")}</option>
      </Select>
      <Select value={playerClass} onChange={(e) => setPlayerClass(e.target.value)}>
        <option value="">{t("class")}</option>
        <option value="Warrior">{t("warrior")}</option>
        <option value="Mage">{t("mage")}</option>
        <option value="Archer">{t("archer")}</option>
        <option value="Thief">{t("thief")}</option>
      </Select>
      <Select
        value={currentLanguage.lang}
        onChange={(e) => {
          currentLanguage.setLanguage(e.target.value);
          localStorage.setItem('language', e.target.value);
        }}
      >
        <option value="en">{t("english")}</option>
        <option value="ru">{t("russian")}</option>
      </Select>
      <Button onClick={handleSubmit}>{t("startGame")}</Button>
    </CustomizationContainer>
  );
};

export default observer(PlayerCustomization);
