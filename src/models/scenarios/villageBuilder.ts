import { locationsStore } from 'models/location';
import { addToLoaction } from './addToLoaction';
import { villageBackgrounds } from 'models/npcs/villageBackgrounds';

const createTharen = () => {
  const blacksmith = locationsStore.locations.find(
    (location) => location.name === 'Tavern',
  );

  if (!blacksmith) {
    return;
  }

  const backgroundTharen = villageBackgrounds['Tharen'];

  if (!backgroundTharen) {
    return;
  }

  addToLoaction(0, 0, backgroundTharen, blacksmith);
};

const createElira = () => {
  const forest = locationsStore.locations.find(
    (location) => location.name === 'Forest Edge',
  );

  if (!forest) {
    return;
  }

  const backgroundElira = villageBackgrounds['Elira'];

  if (!backgroundElira) {
    return;
  }

  addToLoaction(0, 0, backgroundElira, forest);
};

export const villageBuilder = () => {
  createTharen();
  createElira();
};
