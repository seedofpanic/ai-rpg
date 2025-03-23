import { npcStore } from 'models/npcStore';

export const buildStory = () => {
  // get random npc
  const npcsIdsPool = [...npcStore.npcIds];
  const mainCulpritId = npcsIdsPool.splice(
    Math.floor(Math.random() * npcsIdsPool.length),
    1,
  )[0];
  const mainCulprit = npcStore.npcs[mainCulpritId];

  mainCulprit.additionalInstructions = `- You are a member of the cult of Sigmar.
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

  witness.additionalInstructions = `- You witnessed ${mainCulprit.name} sacrificing a villager.
- Ask player to do a quest for you to find out what you know.
- Don't tell anything about that before player ask you about it.
- Don't tell anything about it before player complete at least one quest for you.
  `;

  const worriedGuyId = npcsIdsPool.splice(
    Math.floor(Math.random() * npcsIdsPool.length),
    1,
  )[0];
  const worriedGuy = npcStore.npcs[worriedGuyId];

  worriedGuy.additionalInstructions = `- You are worried because you know that ${witness.name} witnessed something connected to people disappearing in Grenthollow.
- Ask player to do a quest for you to find out what you know.
- Don't tell anything about it before player complete at least one quest for you.
  `;

  npcsIdsPool.forEach((id) => {
    const npc = npcStore.npcs[id];
    npc.additionalInstructions = `- You know that ${worriedGuy.name} acts suspiciously he probably knows something about people disappearing in Grenthollow.
- Ask player to do a quest for you to find out what you know about ${worriedGuy.name}.
- Don't tell anything regarding ${worriedGuy.name} it before player complete at least one quest for you.
    `;
  });
};
