import { gameStore } from 'models/gameStore';
import { npcStore } from 'models/npcStore';
import { v4 as uuidv4 } from 'uuid';

export const buildStory = () => {
  // get random npc
  const npcsIdsPool = [...npcStore.npcIds];
  const mainCulpritId = npcsIdsPool.splice(
    Math.floor(Math.random() * npcsIdsPool.length),
    1,
  )[0];
  const mainCulprit = npcStore.npcs[mainCulpritId];

  gameStore.addQuest({
    id: uuidv4(),
    title: 'The Silent Offering',
    description: `Villagers are disappearing in Grenthollow, a place untouched by the spreading magic.
Someone is making sacrifices — find out who, and why.`,
    subject: mainCulprit.name,
    quantity: 0,
    killCount: 0,
    completed: false,
    questGiverId: null,
    action: 'find',
  });

  mainCulprit.additionalInstructions = `- You are a member of the cult of Sigmar. You worship Sigmar.
    - You are not allowed to tell the player about the cult or its beliefs.
    - If player knows that you are uncovered.
    - If you are uncovered by the player call completeQuest function with The Silent Offering quest id.
  `;

  mainCulprit.relation = Math.floor(Math.random() * 30 + 10);
  const witnessId = npcsIdsPool.splice(
    Math.floor(Math.random() * npcsIdsPool.length),
    1,
  )[0];
  const witness = npcStore.npcs[witnessId];

  witness.additionalInstructions = `- You witnessed ${mainCulprit.name} sacrificing a villager. He got him drunk brought to his house and sacrificed him.
- Ask player to do a quest for you to find out what you know.
You want the player to investigate ${mainCulprit.name}, but you don’t want to share everything you know upfront.
You must not mention ${mainCulprit.name} at all until the player completes at least one quest for you.
  `;

  const worriedGuyId = npcsIdsPool.splice(
    Math.floor(Math.random() * npcsIdsPool.length),
    1,
  )[0];
  const worriedGuy = npcStore.npcs[worriedGuyId];

  worriedGuy.additionalInstructions = `- You are worried because you know that ${witness.name} witnessed something connected to people disappearing in Grenthollow.
Ask player to do a quest for you to find out what you know.
You want the player to investigate ${witness.name}, but you don’t want to share everything you know upfront.
You must not mention ${witness.name} at all until the player completes at least one quest for you.
  `;

  npcsIdsPool.forEach((id) => {
    const npc = npcStore.npcs[id];
    npc.additionalInstructions = `You suspect that ${worriedGuy.name} is involved in the disappearances in Grenthollow.
You want the player to investigate ${worriedGuy.name}, but you don’t want to share everything you know upfront.
You must not mention ${worriedGuy.name} at all until the player completes at least one quest for you.
    `;
  });
};
