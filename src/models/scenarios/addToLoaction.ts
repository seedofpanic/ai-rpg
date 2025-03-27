import { Location } from 'models/location';
import { BackgroundTemplate } from 'models/npcs/backgroundsData';
import { NPC } from 'models/npcs/npc';
import { npcStore } from 'models/npcs/npcStore';

export const addToLoaction = (
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
