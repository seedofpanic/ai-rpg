import {
  BackgroundTemplate,
  scienceCampBackgrounds,
} from 'models/backgroundsData';
import { locationsStore, Location } from 'models/location';
import { NPC } from 'models/npc';
import { npcStore } from 'models/npcStore';

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

const addToLoaction = (
  x: number,
  y: number,
  background: BackgroundTemplate,
  location: Location,
) => {
  const locX =
    location.x + (x ? x : Math.floor(Math.random() * location.width));
  const locY =
    location.y + (y ? y : Math.floor(Math.random() * location.height));

  const npc = new NPC(locX, locY, background, location);
  npcStore.addNpc(npc);
};
