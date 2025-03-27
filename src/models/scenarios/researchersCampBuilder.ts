import { scienceCampBackgrounds } from 'models/npcs/scienceCampBackgrounds';
import { locationsStore } from 'models/location';
import { addToLoaction } from './addToLoaction';

export const researchersCampBuilder = () => {
  const camp = locationsStore.locations.find(
    (location) => location.name === 'Researchers camp',
  );

  if (!camp) {
    return;
  }

  addToLoaction(0, 0, scienceCampBackgrounds['Velra'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Kessa'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Rolen'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Elvi'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Nym'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Thera'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Fen'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Dela'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Rhagan'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Serna'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Jorek'], camp);
  addToLoaction(0, 0, scienceCampBackgrounds['Elra'], camp);
};
