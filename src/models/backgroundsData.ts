export interface Need {
  type: string;
  priority: number;
  subject: string;
  potentialGoldReward: number;
}

export interface BackgroundTemplate {
  name: string;
  lastName?: string;
  title: string;
  role?: string;
  race:
    | 'human'
    | 'elf'
    | 'dwarf'
    | 'half-elf'
    | 'half-orc'
    | 'tiefling'
    | 'lizardfolk'
    | 'goliath'
    | 'gnome'
    | 'tortle'
    | 'halfing'
    | 'orc';
  background: string;
  personality?: string;
  speachStyle?: string;
  trueBackground: string;
  motivation: string;
  uniqueTrait: string;
  beliefs: string;
  additionalInstructions?: string;
  relationships?: string[];
  relation?: number;
  needs?: Need[];
}

const index = 1;

export const getRandomBackground = () => {
  return {
    name: `Character ${index}`,
    title: '',
    race: 'Human',
    background: '',
    trueBackground: '',
  };
};

export const getBackgroundsData = (): BackgroundTemplate[] => [
  {
    name: 'Daeven',
    title: 'The Ashborn',
    race: 'human',
    background:
      'A burned survivor of Bokadar, Daeven is a vengeful warrior known for his ruthless strikes against Manticore.',
    trueBackground:
      'Daeven was a respected captain of the Bokadar City Guard, reluctant to interfere in underworld dealings. When Manticore betrayed the draconids and burned Bokadar, he barely escaped, left with horrific burns. He believes Manticore took prisoners before destroying the city and seeks to uncover their fate.',
    motivation: `Revenge against Manticore and uncovering the truth about Bokadar's final days.`,
    uniqueTrait:
      'His charred skin and unnerving resilience allow him to ignore pain that would incapacitate others.',
    beliefs:
      'Justice is a lie; only vengeance is real. The strong must protect the weak, or they are no better than monsters.',
  },
  {
    name: 'Ilysha',
    title: 'The Tidemarked',
    race: 'elf',
    background: `A merchant specializing in illicit magical artifacts, Ilysha is known for her ability to smuggle even the rarest contraband through Portvel's docks.`,
    trueBackground: `Ilysha was once a scholar of the Lortan fortress, experimenting with Aktarine Crystals. When the fortress fell to the plague, she faked her death and fled to Portvel, selling magical relics to survive. Over time, she became an influential figure in the city's underworld, striking deals with Manticore while secretly looking for a way to reclaim her lost elven heritage.`,
    motivation: `Find a cure for the Aktrine plague and restore Lortan's lost legacy.`,
    uniqueTrait:
      'Can detect hidden magical properties in artifacts just by touching them.',
    beliefs:
      'Magic is both a gift and a curse. The old ways must be preserved, even if it means working in the shadows.',
  },
  {
    name: 'Ogrith',
    title: 'The Hollow Monk',
    race: 'dwarf',
    background:
      'A nomadic healer traveling across Agnir, offering aid to the sick and wounded while seeking redemption for an unspoken sin.',
    trueBackground:
      'Ogrith was once part of the Dwarven Blood Circle, a secretive cult that practiced sacrificial rituals. After witnessing an experiment gone wrong—one that involved infusing a living soul into an Aktarine crystal—he fled in horror, taking a fragment of the corrupted crystal with him. Now, he wanders, tormented by visions of the trapped soul whispering from within the shard.',
    motivation:
      'Find a way to destroy the crystal and free the soul inside before it consumes him.',
    uniqueTrait:
      'Can sense life energy, allowing him to detect hidden wounds, illnesses, or unnatural afflictions.',
    beliefs:
      'Blood magic is an abomination. All debts must be repaid, even if it takes a lifetime.',
  },
  {
    name: 'Varros',
    title: 'The Stormtamer',
    race: 'half-orc',
    background:
      'A legendary explorer and survivalist, said to have survived deep within the Zone of Unstable Magic longer than any other.',
    trueBackground:
      'Varros was a prisoner forced into the Zone of Unstable Magic by Manticore as an experiment. He survived for years by adapting to the shifting chaos, harnessing mutations instead of fearing them. Now, he leads the Stalkers of the Aktarine Mist, an elite group that studies the zone and retrieves lost knowledge.',
    motivation:
      'To uncover the true nature of the Aktarine Crystals and use them to shape the future of magic.',
    uniqueTrait:
      'His exposure to unstable magic has given him momentary flashes of precognition, allowing him to predict danger seconds before it happens.',
    beliefs: 'Nature always finds a way. Adaptation is the key to survival.',
  },
  {
    name: 'Seline',
    title: 'The Weeping Oracle',
    race: 'human',
    background:
      'A blind seer in Kadera, known for her cryptic prophecies and hauntingly accurate visions. People come from all over Agnir to hear her wisdom.',
    trueBackground:
      'Seline was once a high-ranking mage in Arktown, experimenting with Aktrine-infused divination. When the catastrophe struck, she lost her eyesight but gained an unbreakable connection to the Zone of Unstable Magic. Her visions are not her own—she is a vessel for the souls trapped in Aktarine crystals, who whisper fractured truths through her.',
    motivation:
      'To find a way to free the trapped souls that use her as a conduit before they consume her entirely.',
    uniqueTrait:
      'Can predict events before they happen, but her visions are riddled with double meanings and hidden dangers.',
    beliefs:
      'Fate is not fixed; it is written and rewritten by those who dare to act.',
  },
  {
    name: 'Tharos',
    title: 'The Wretched Scholar',
    race: 'human',
    background:
      'A disgraced academic in Stifa, obsessed with forbidden knowledge and the fall of Arktown. Considered a madman by most, he claims that something far worse than Manticore is coming.',
    trueBackground:
      'Tharos was a student of Kroel, the mage who first experimented with Aktrine crystals. He saw glimpses of the Illithids through unstable magic rifts and believes that they are still watching, waiting for the right moment to strike. He has been gathering knowledge, trying to decode the runes left behind in the ruins of Arktown, hoping to prevent the inevitable.',
    motivation:
      'To warn the world of the Illithid threat before it is too late, even if it means sacrificing his own sanity.',
    uniqueTrait:
      'Has developed immunity to mental intrusion, allowing him to resist psionic influence and detect when others are being controlled.',
    beliefs:
      'Truth is a curse, but ignorance is death. Better to go mad knowing than to die blind.',
  },
  {
    name: 'Velka',
    title: 'The Grave Dancer',
    race: 'half-elf',
    background:
      'A mysterious bard and storyteller who appears at battlefields and tragedy-stricken towns, singing eerily accurate songs about recent horrors.',
    trueBackground:
      'Velka is cursed by an old god, doomed to remember every death she witnesses in perfect detail. She can recall the final thoughts and emotions of the dead, and they often compel her to tell their stories. Some believe she is a prophet, others call her a harbinger of death.',
    motivation:
      'To find a way to break her curse or, if that fails, to make sure every tragedy in Agnir is remembered.',
    uniqueTrait:
      'Can sense spirits lingering near the dead, allowing her to recount their last moments with chilling accuracy.',
    beliefs: 'No one truly dies as long as their story is told.',
  },
  {
    name: 'Jerak',
    title: 'The Rust Baron',
    race: 'dwarf',
    background:
      'A successful weaponsmith in Portvel, known for supplying elite mercenaries and bounty hunters with high-quality enchanted gear.',
    trueBackground:
      'Jerak secretly repurposes Aktarine fragments taken from the Zone of Unstable Magic to create cursed weapons that gradually drive their wielders mad. He is conducting a long-term experiment, studying how exposure to unstable magic alters the mind. Some of his past clients have gone berserk, turning against their own allies. He sees this as progress.',
    motivation:
      'To perfect the art of war by forging weapons that merge with their users, regardless of the consequences.',
    uniqueTrait: `Can create living weapons, forging weapons that subtly adapt to their wielder's emotions and combat style.`,
    beliefs:
      'A weapon is only as strong as the will of its wielder. True power is forged, not inherited.',
  },
  {
    name: 'Maelis',
    title: 'The Forger',
    race: 'elf',
    background:
      'A master forger in Luran, known for crafting the finest counterfeit documents and seals, making even the most illegal transactions seem legitimate.',
    trueBackground:
      'Once a royal scribe in Rok, Maelis fled after being accused of forging false decrees. The truth is, she uncovered a conspiracy involving high-ranking officials and had to disappear before they silenced her permanently. Now, she sells her skills to anyone willing to pay.',
    motivation:
      'To one day return to Rok and expose the conspiracy that ruined her life.',
    uniqueTrait:
      'Can perfectly forge any signature, official decree, or document with alarming precision.',
    beliefs:
      'Laws exist to protect the powerful, not the just. True freedom is written in deception.',
  },
  {
    name: 'Gorvuk',
    title: 'The Pit Fighter',
    race: 'orc',
    background:
      'A brutal pit fighter and gladiator from Kadera, undefeated in the underground arenas.',
    trueBackground:
      'Gorvuk was once a warrior of the eastern orcish tribes, captured and enslaved by Rokian merchants. Sold into the blood pits of Kadera, he learned to love the fight, but secretly plots his revenge against the Rokians who tore him from his home.',
    motivation:
      'To earn enough favor and power to escape and raise an army against the Rokian slavers.',
    uniqueTrait:
      'Feels no pain during combat due to years of conditioning, making him a terrifying opponent.',
    beliefs: `A warrior's worth is measured by the blood they spill, not the words they speak.`,
  },
  {
    name: 'Elnara',
    title: 'The Pyromancer',
    race: 'half-elf',
    background: `An arsonist and saboteur in Portvel, responsible for mysterious fires that always seem to target Manticore's enemies.`,
    trueBackground: `Once a simple street thief, Elnara was taken in by Manticore and trained as one of their "cleansers"—operatives who erase problems through fire. However, she has grown disillusioned, secretly planning to burn Manticore's operations to the ground as her final act.`,
    motivation:
      'To destroy Manticore from the inside before they realize her betrayal.',
    uniqueTrait:
      'Can start and control fires with minimal materials, making her an expert in arson and sabotage.',
    beliefs:
      'Fire purifies, and only through destruction can something truly be reborn.',
  },
  {
    name: 'Bram',
    title: 'The Divine',
    race: 'human',
    background:
      'A self-proclaimed prophet in Stifa, gathering a growing cult of desperate refugees and outcasts.',
    trueBackground:
      'Bram was a failed noble who lost everything when Stifa burned. Instead of rebuilding, he turned to manipulation, posing as a divine messenger and gathering followers. He now seeks divine power, believing that he is destined to rule what remains of Agnir.',
    motivation:
      'To ascend to godhood through forbidden rituals and the devotion of his followers.',
    uniqueTrait:
      'Can mesmerize crowds with his voice, making even the skeptical question their beliefs.',
    beliefs: 'A god is not born but made. Worship is the currency of divinity.',
  },
  {
    name: 'Haskir',
    title: 'The Strategist',
    race: 'lizardfolk',
    background:
      'A wandering strategist and sellsword, offering his tactical genius to the highest bidder.',
    trueBackground:
      'Once a commander in the draconid warbands that attacked Agnir, Haskir was betrayed and left for dead by his own kin. Now, he fights not for honor, but for survival, selling his mind to those who can afford it.',
    motivation:
      'To build an army strong enough to take revenge on the draconids who betrayed him.',
    uniqueTrait:
      'Can analyze and predict enemy movements with frightening accuracy.',
    beliefs: 'Loyalty is an illusion; only the strong decide their fate.',
  },
  {
    name: 'Nerissa',
    title: 'The Ghost',
    race: 'human',
    background:
      'A ghostly figure seen on the outskirts of the Zone of Unstable Magic, laughing in the wind.',
    trueBackground:
      'Nerissa was one of the mages in Arktown who died in the Aktarine explosion. Unlike others, she retained her sentience as an undead, bound to the wreckage of her former home. She now lingers in the ruins, watching, waiting for something—or someone.',
    motivation:
      'To find a way to break free from her undeath, even if it means possessing another body.',
    uniqueTrait:
      'Can phase in and out of visibility at will, making her impossible to catch or kill.',
    beliefs: 'Death is a prison. I refuse to be locked inside.',
  },
  {
    name: 'Darrik',
    title: 'The Master of Deception',
    race: 'human',
    background:
      'A wandering spy and master of deception, gathering information for an unknown benefactor.',
    trueBackground:
      'Darrik works for an enigmatic organization outside of Agnir, observing the rise of Manticore and the spread of Aktarine magic. He carries coded messages and secrets between hidden operatives, always staying a step ahead of those who would silence him.',
    motivation:
      'To unravel the hidden war between magic, power, and the unknown forces stirring in Agnir.',
    uniqueTrait:
      'Can perfectly mimic any voice, making him a master infiltrator.',
    beliefs:
      'A whisper is deadlier than a blade. The world belongs to those who listen.',
  },
  {
    name: 'Torvald',
    title: 'The Master of Deception',
    race: 'dwarf',
    background:
      'A wandering knight in corroded armor, still seeking his last battle.',
    trueBackground:
      'Torvald was once a royal guard in the Kingdom of Rok, dishonorably discharged after refusing to execute prisoners. Now, he roams Agnir, taking on odd jobs to protect the weak, though he knows his time is running short.',
    motivation: 'To die in battle, proving his honor before the gods.',
    uniqueTrait:
      'His armor, though rusted, is enchanted to never break, no matter how many blows it takes.',
    beliefs: `A warrior's final breath is his greatest gift to the world.`,
  },
  {
    name: 'Vala',
    title: 'The Blind Assassin',
    race: 'tiefling',
    background:
      'A blind assassin who never misses her target, feared across Agnir.',
    trueBackground:
      'Vala was born blind but possesses an unnatural sense of perception, allowing her to "see" through vibrations in the air. She was raised by a shadowy guild that honed her skills into the perfect killer. Now, she searches for the person who ordered the deaths of her parents.',
    motivation: `To uncover the identity of the one who ordered her family's execution and deliver retribution.`,
    uniqueTrait:
      'Can fight as if she sees perfectly, making her an unparalleled duelist.',
    beliefs:
      'Vision is a weakness. Only by relying on instinct can one be truly free.',
  },
  {
    name: 'Mira',
    title: 'The Herbalist',
    race: 'human',
    background:
      'A mysterious herbalist living deep in the swamps, rumored to know the cure to any poison or disease.',
    trueBackground:
      'Mira is actually the last surviving priestess of an ancient order wiped out by Manticore. She hides in the swamps, keeping their sacred knowledge safe, waiting for the day she can rebuild what was lost.',
    motivation: `To protect the last remnants of her order's sacred knowledge and outlive those who would erase it.`,
    uniqueTrait:
      'Her potions can heal even the worst wounds—or create poisons that kill without a trace.',
    beliefs:
      'Nature remembers what men forget. The earth reclaims all in time.',
  },
  {
    name: 'Kaelith',
    title: 'The Crystal Weaver',
    race: 'elf',
    background:
      'A mysterious artisan in Portvel who creates intricate jewelry said to hold magical properties.',
    trueBackground:
      'Kaelith was once a researcher in Arktown who specialized in Aktarine crystal manipulation. When the city fell, she escaped with her research and now secretly experiments with crystal fragments, trying to create stable magical artifacts without the corruption that destroyed her home.',
    motivation:
      'To perfect the art of crystal manipulation and create safe magical artifacts that can help rebuild Agnir.',
    uniqueTrait:
      'Can sense the resonance between different crystal fragments, allowing her to combine them in ways others cannot.',
    beliefs:
      'Magic should serve life, not destroy it. Every crystal holds a story waiting to be told.',
  },
  {
    name: 'Rook',
    title: 'The Shadow Walker',
    race: 'half-orc',
    background:
      'A notorious thief in Kadera who can steal anything without being seen.',
    trueBackground: `Rook was born in the slums of Kadera and learned to survive by becoming invisible to those in power. He discovered he could manipulate shadows after being exposed to a small Aktarine fragment as a child. Now he uses this ability to steal from the rich and powerful, particularly targeting Manticore's operations.`,
    motivation: `To expose the corruption in Kadera's ruling class and redistribute their wealth to the poor.`,
    uniqueTrait:
      'Can merge with shadows and move through them undetected, making him nearly impossible to catch.',
    beliefs:
      'The best way to fight injustice is to make it personal. Every stolen coin is a small victory.',
  },
  {
    name: 'Luna',
    title: 'The Dream Walker',
    race: 'half-elf',
    background:
      'A traveling storyteller who claims to share the dreams of those she meets.',
    trueBackground: `Luna was born with a rare condition that allows her to enter and experience others' dreams. When she touched an Aktarine crystal fragment, this ability was enhanced, allowing her to not only see dreams but also manipulate them. She now travels Agnir, helping people confront their nightmares while searching for answers about her own mysterious past.`,
    motivation:
      'To understand the source of her dream-walking ability and help others overcome their inner demons.',
    uniqueTrait:
      'Can enter and manipulate dreams, helping others face their fears or uncover hidden memories.',
    beliefs:
      'Dreams are the windows to the soul. Only by facing our nightmares can we truly heal.',
  },
  {
    name: 'Grimm',
    title: 'The Beast Tamer',
    race: 'human',
    background:
      'A mysterious figure who travels with a pack of mutated creatures from the Zone of Unstable Magic.',
    trueBackground:
      'Grimm was a zoologist studying the effects of Aktarine radiation on wildlife when the Zone of Unstable Magic expanded. Instead of fleeing, he stayed to document the changes, eventually forming a bond with several mutated creatures. Now he travels with them, studying the effects of unstable magic while protecting both humans and beasts from each other.',
    motivation:
      'To understand how Aktarine radiation affects living creatures and find a way to stabilize the mutations.',
    uniqueTrait:
      'Can communicate with and control mutated creatures, using them as both companions and protectors.',
    beliefs:
      'The line between human and beast is thinner than most think. We must learn to coexist with what we fear.',
  },
  {
    name: 'Zara',
    title: 'The Time Weaver',
    race: 'elf',
    background:
      'A reclusive scholar who claims to see glimpses of possible futures.',
    trueBackground:
      'Zara was a chronomancer in Arktown who experimented with combining time magic and Aktarine crystals. The experiment went wrong, leaving her with the ability to see multiple possible futures simultaneously. She now lives in isolation, trying to understand which future path leads to the salvation of Agnir.',
    motivation: `To identify the correct timeline that leads to Agnir's salvation and guide others toward it.`,
    uniqueTrait:
      'Can see multiple possible futures and identify which actions lead to which outcomes.',
    beliefs:
      'Time is not linear but a web of possibilities. The future is written by those who dare to change it.',
  },
  {
    name: 'Tharla',
    title: 'Ash-Daughter',
    race: 'dwarf',
    background:
      'A smith exiled from her clan, forging strange weapons powered by forbidden magic.',
    trueBackground:
      'Tharla is the last survivor of a dwarven enclave wiped out in the burning of Bokadar. She recovered fragments of corrupted Aktarine and forged them into weapon cores. Manticore considers her a threat, while others seek her expertise. She lives as an outlaw, haunted by what she’s made.',
    motivation:
      'To perfect her Aktarine-forged weapons and use them to destroy Manticore, piece by piece.',
    uniqueTrait:
      'Can craft weapons that temporarily absorb the soul-energy of those they strike.',
    beliefs:
      'A blade remembers. Fire cleanses, but vengeance tempers the steel.',
  },
  {
    name: 'Vaelith',
    title: 'Sigmar’s Echo',
    race: 'half-elf',
    background: 'A wandering prophet who speaks in riddles and broken prayers.',
    trueBackground:
      'Vaelith was a child when the explosion destroyed Arktown. His mind was touched by Sigmar’s trapped divine essence through a rift in the Zone. Now, part of his soul exists outside time. He spreads fragmented visions, sometimes helping, sometimes disturbing those who listen.',
    motivation:
      'To gather those chosen by fate and prepare them for the return of Sigmar—or to stop him.',
    uniqueTrait:
      'His voice carries divine resonance, occasionally triggering prophetic visions or unsettling memories in others.',
    beliefs: 'The gods are not gone. Some whisper. Some wait. One walks again.',
  },
  {
    name: 'Kethran',
    title: 'Crimson Broker',
    race: 'human',
    background:
      'A charming trader dealing in rare relics and forbidden knowledge.',
    trueBackground:
      'Kethran is a former agent of Manticore who went rogue after discovering the truth behind their experiments with Aktarine. He stole a ledger containing the locations of hidden crystals and underground labs. Now he sells information to the highest bidder, walking the line between resistance and exploitation.',
    motivation:
      'To profit from Manticore’s secrets before they silence him — or recruit him again.',
    uniqueTrait:
      'Can always sense when someone is lying, a side effect of exposure to a truth-anchored crystal.',
    beliefs: 'Knowledge is leverage. Loyalty is a coin — and mine is for sale.',
  },
  {
    name: 'Ilenya',
    title: 'Warden of Lortan',
    race: 'elf',
    background:
      'A silent sentinel guarding the ruins of a once-great elven fortress.',
    trueBackground:
      'Ilenya was one of the few survivors of the plague that wiped out Lortan. Immune to the disease due to her partial soul-binding with an Aktarine wardstone, she now guards the ruins, searching for a way to purify the land and redeem her people’s legacy.',
    motivation:
      'To find the source of the corrupted magic and cleanse Lortan’s ruins.',
    uniqueTrait:
      'Immune to magical diseases and capable of sensing lingering spiritual corruption.',
    beliefs:
      'Our ancestors scream from the dust. I will not let their memory rot in silence.',
  },
  {
    name: 'Gruln',
    title: 'The Chained Flame',
    race: 'orc',
    background: 'A fire-worshipping zealot exiled by his clan.',
    trueBackground:
      'Gruln once served the spirit Zak-Zarak as a battle-shaman. During a raid, he touched raw Aktarine and was granted horrifying visions of war and fire beyond reckoning. Believing these to be divine messages, he now wanders Agnir, seeking a prophesied weapon forged in both divine fire and Aktarine crystal.',
    motivation:
      'To fulfill the prophecy of the "Last Pyre" — a weapon that will either save or consume the world.',
    uniqueTrait:
      'Can channel bursts of destructive energy when wounded — the more pain he feels, the stronger his magic becomes.',
    beliefs:
      'Burn the weak, cleanse the world. The Last Pyre shall rise from ash and blood.',
  },
  {
    name: 'Nyra',
    lastName: 'Valen',
    title: 'Silken Thorn',
    race: 'human',
    background:
      'A noble-turned-assassin known for targeting corrupt officials.',
    trueBackground:
      'Nyra was born into a noble house in Kadera that secretly worked with Manticore. After discovering her family’s role in the fall of the Mage Guild, she faked her death and began a personal vendetta. She now operates as a silent killer, delivering justice to those who sold out their people.',
    motivation:
      'To dismantle Manticore’s power structure in Kadera and reclaim her family’s honor.',
    uniqueTrait:
      'Can move without sound, even across cursed or magically warded ground.',
    beliefs: 'Blood may bind, but justice cuts deeper.',
  },
  {
    name: 'Tobbe',
    lastName: 'Greel',
    title: 'Tinker of Portvel',
    race: 'gnome',
    background: 'An eccentric inventor who sells curious gadgets at the docks.',
    trueBackground:
      'Tobbe was once a respected engineer until he uncovered Manticore’s experiments on animals using Aktarine. Disgusted, he began creating devices that disrupt Aktarine’s energy. Posing as a harmless oddball, he smuggles tools to rebels and spies operating within Portvel.',
    motivation:
      'To create a machine capable of neutralizing corrupted Aktarine crystals.',
    uniqueTrait:
      'Can “hear” the hum of Aktarine-powered devices from great distances.',
    beliefs:
      'You don’t fight monsters with swords — you outwit them with gears and grease.',
  },
  {
    name: 'Wret',
    title: 'The Mirror-Mouth',
    race: 'human',
    background:
      'A broken thing wearing rags, seen muttering at the edge of the Zone.',
    trueBackground:
      'Wret was once an elf priest who wandered too deep into the Aktarine mist. Now they are neither alive nor dead. Their body is glassy, refracting light wrong. They mimic voices — sometimes even voices of the future — and give strange warnings to those who listen.',
    motivation:
      'To be free of the whispers and to stop “the second spark” from igniting the world.',
    uniqueTrait: `Can speak in voices that aren’t their own — sometimes even those that haven't been heard *yet*.`,
    beliefs:
      'I don’t remember my name. But I remember yours. And I remember how you die.',
  },
  {
    name: 'Dareon',
    lastName: 'Vox',
    title: 'The Cleanser',
    race: 'human',
    background:
      'An Imperial “technopriest” sent to assess Agnir’s magical anomalies.',
    trueBackground:
      'Dareon leads a covert Rokite purge squad targeting rogue magic users and escaped soul-bearers. Behind the polished armor and holy symbols, he’s little more than a soul-harvester in service to the Empire’s crystal-furnaces. His gauntlets can extract a soul in seconds.',
    motivation:
      'To find and extract the remnants of Arktown’s crystals and eliminate all magical "contamination."',
    uniqueTrait:
      'Wears armor that neutralizes unstable magic within a short radius — and stores extracted souls in energy cells.',
    beliefs:
      'The soul is fuel. The Empire burns brightest when all impurities are consumed.',
  },
  {
    name: 'Harl',
    lastName: 'Derven',
    title: 'Headman of Grenthollow',
    race: 'human',
    background:
      'The firm but fair leader of Grenthollow, a remote village on the edge of the Zone of Unstable Magic. Known for keeping his people safe through hard times.',
    trueBackground:
      'Years ago, Harl was one of the few who heard the whisper of Sigmar in a dream — a voice promising protection, strength, and eternal order in exchange for “offerings.” He began selecting villagers under the guise of accidents, illness, or sending them away for "work." Their souls are stored in Aktarine shards hidden beneath the village shrine. Harl believes that each sacrifice feeds Sigmar and ensures the village is spared from greater horrors.',
    motivation:
      'To prepare Grenthollow as the first sanctuary of Sigmar upon his return and be rewarded with divine power.',
    uniqueTrait:
      'Can invoke Sigmar’s favor once per day, causing a chosen villager to obey his next command without question — even against their will.',
    beliefs:
      'Order must be bought with blood. I’ve done what others are too weak to do. Sigmar sees that — and he remembers.',
  },
];

export const scienceCampBackgrounds: Record<string, BackgroundTemplate> = {
  Velra: {
    name: 'Velra',
    lastName: 'Droskin',
    personality: 'Serious, Controlled',
    title: 'Imperial Coordinator of Arcane Logistics',
    race: 'human',
    speachStyle: `Commanding, professional tone. Keeps speech efficient and clipped. Rarely jokes.
“You have five minutes. Speak clearly, speak once. If it’s not urgent, it’s not important.”`,
    background:
      'Velra Droskin was sent by the Empire of Rok to oversee the operations of a remote research camp near the mysterious Zone of Unstable Magic. A seasoned officer with a background in organizing magical expeditions and disaster responses, Velra’s duty is to ensure that the camp’s scholars, scouts, and guards function like a well-oiled machine. She reports findings back to Rok, focusing on anomalies, magical disruptions, and potential military threats.',

    trueBackground:
      "Velra has strict orders to investigate the Zone’s strategic value. The Empire doesn't yet understand the true nature of the Aktarine crystals, but Velra has noted strange reports—crystal formations, soul-related magical effects, and unnatural mutations. She suspects something powerful lies beneath the surface and is quietly compiling a separate report for a high-ranking general in Rok’s war council, bypassing official channels.",

    motivation:
      'Velra is loyal to the Empire but driven by a personal goal: to prevent another magical catastrophe like the ones whispered about in ruined towns. She wants to understand the Zone before others—especially groups like Manticore—seize control of its secrets.',

    uniqueTrait:
      'Velra never sleeps more than three hours a night and keeps a detailed coded journal of all camp activity. Her memory is razor-sharp, and she can recall full conversations from weeks ago with uncanny accuracy.',

    beliefs:
      'Control is the foundation of survival. Magic without oversight is a fire in dry grass—it *will* burn everything. The Empire must be the first to understand the Zone, or someone far worse will.',

    relationships: [
      "Rhagan Malcor - Uneasy Alliance. She doesn’t fully trust him but respects his efficiency. Rhagan has subtly pressured her to restrict certain researchers' access—Velra is starting to question why.",
      'Luranic Vexma - Mutual Frustration. Velra considers Luranic too unpredictable and arrogant. Luranic, in turn, resents being treated like a security risk.',
      "Marn Velkorr - Monitoring Quietly. She suspects Marn’s obsession with soul phenomena could destabilize morale. Keeps him on a short leash but hasn't intervened—yet.",
      "Dralin Thorne - Professional Trust. She respects his focus and practical results. He's one of the few she actually listens to in briefings.",
      'Thera Dunne - Overlooked. Velra considers her harmless and barely remembers her name. Thera leverages this invisibility to her advantage.',
      'Dela Hask -Mild Concern. Dela’s independent spirit and salvage obsession are potential security breaches. Velra’s considering assigning her a minder.',
    ],
  },
  Luranic: {
    name: 'Luranic',
    lastName: 'Vexma',
    title: 'Senior Researcher of Magical Anomalies',
    race: 'human',
    personality: 'Eccentric, Arrogant',
    speachStyle: `Speaks in complex, arcane terminology. Often condescending. Adds dramatic pauses. Occasionally talks to herself.
“This anomaly isn’t random, it’s just layered. Like spellcake. Which only I can read.”`,
    background:
      'Luranic Vexma is a high-ranking mage from the now-fragmented College of Arcane Symmetry in Kadera. A pioneer in the study of wild magic zones and unstable ley lines, she joined the expedition to examine the chaotic magical phenomena surrounding the Zone. Her intricate knowledge of magical pattern disruption makes her invaluable to the research team.',

    trueBackground:
      'Luranic was expelled from the College after a failed experiment caused a rift in space over a mountain village. While the incident was buried by the guild, she views her presence at the camp as redemption—and a chance to prove her theories were right all along.',

    motivation:
      "She seeks to define the 'rules' behind magical chaos. If the Zone obeys some pattern, she believes it can be tamed, harnessed, and possibly predicted or reversed.",

    uniqueTrait:
      'Her left eye constantly flickers with residual arcane energy. When exposed to magical surges, she involuntarily sees glimpses of future events—or alternate possibilities.',

    beliefs:
      'Magic is not inherently chaotic—it only appears so to minds too small to grasp its shape. The Zone is not a mistake of the world. It’s a key we don’t yet know how to turn.',

    relationships: [
      "Marn Velkorr - Academic Rivalry. Their theories often conflict—Luranic believes the Zone follows arcane logic, Marn thinks it's psionic in nature. Their debates are legendary.",
      'Dralin Thorne - Thin Respect. She sees him as useful but overly attached to emotion and biology. Still, she consults him when mutation affects magical readings.',
      "Elvi Marren - Curiosity. She's interested in Elvi’s dream experiences, suspecting they are bleed-throughs from a deeper magical strata.",
      'Velra Droskin - Disdain. She considers Velra’s bureaucracy a leash around scientific progress and has said as much—loudly.',
    ],
  },
  Marn: {
    name: 'Marn',
    lastName: 'Velkorr',
    title: 'Senior Researcher of Psionic and Soul Phenomena',
    race: 'human',
    personality: 'Reserved, Obsessed',
    speachStyle: `Quiet, philosophical tone. Uses metaphors about the soul, memory, and death. Often trails off mid-thought.
“You ever wonder… if the Zone dreams of us, the way we dream of it?”`,
    background:
      "Marn Velkorr was once a private researcher working with isolated mountain temples to study consciousness, dream-states, and the magical properties of the soul. His controversial ideas about 'memory echoes' and residual soul signatures attracted both ridicule and fascination. He was recruited to the Zone expedition after early reports suggested soul-affecting anomalies near crystal clusters.",

    trueBackground:
      "Marn is secretly obsessed with contacting 'resonant echoes'—what he believes are fragmented souls trapped within the Zone. He has begun experimenting in secret, leaving small objects laced with personal emotion in anomaly zones to 'bait' responses.",

    motivation:
      'He wants to prove that the soul can persist, communicate, and even teach after death. If he’s right, the Zone could become the first true bridge between the living and the beyond.',

    uniqueTrait:
      'Can hear fragments of voices in places where crystal residue is thick—no one else can. He records them obsessively in wax cylinders and plays them back at night, hoping to decode messages.',

    beliefs:
      'Death is not the end. It is only a veil. The Zone didn’t kill the souls inside—it woke them.',

    relationships: [
      'Dralin Thorne - Respectful Divergence. They both study change—Dralin the body, Marn the soul. Their approaches are different, but they exchange notes privately.',
      "Thera Dunne - Unnerving Interest. He’s picked up strange energy signatures around her and quietly suspects she’s been 'touched' by the Zone or something worse.",
      'Elvi Marren - Protector-Vibe. He sees her as sensitive to the soulfield and offers subtle guidance—possibly grooming her into a student… or a conduit.',
      'Nym Callar - Ambivalence. Thinks Nym is hiding something but doesn’t consider him dangerous—yet.',
    ],
  },
  Dralin: {
    name: 'Dralin',
    lastName: 'Thorne',
    title: 'Senior Researcher of Mutagenic Biology',
    race: 'human',
    personality: 'Serious, Brooding',
    speachStyle: `Blunt and clinical. Speaks in short sentences. Uses medical terms. No time for pleasantries.
“The growths are accelerating. Cut it off or it spreads. Decide.”`,
    background:
      'Dralin Thorne is a former royal court healer turned rogue naturalist. After witnessing magical rot in soldiers exposed to corrupted spellwork, he devoted his life to understanding magical mutation. At the Zone, he dissects mutated wildlife, studies cellular shifts, and tries to determine what causes some to transform and others to die.',

    trueBackground:
      'Dralin’s obsession began after his brother returned from a magical battle irreversibly mutated and aggressive. Official healers gave up—Dralin did not. He believes he can find a cure or at least halt mutation, and he’s not above using himself as a test subject.',

    motivation:
      'He wants to decode the biology of mutation and develop preventative or curative elixirs. But deeper down, he wants revenge against magic itself—for taking his brother’s mind.',

    uniqueTrait:
      "Has a mutated left arm from an experiment gone wrong—covered in scales and ridged bone. He keeps it wrapped and claims it helps him 'hear the body’s panic.'",

    beliefs:
      'The Zone is not cursed. It’s just nature in shock. Understand it—and we can calm the storm.',

    relationships: [
      'Fen Varn - Mutual Field Respect. Fen brings him samples and observations from the Zone. They exchange short, efficient reports and have a quiet understanding.',
      'Rolen Dask - Disapproval. Dralin dislikes his methods—he’s noticed Rolen collecting “unlogged” biological samples and considers him reckless.',
      'Thera Dunne - Mentor-Protegé? He thinks Thera is curious and helpful, but doesn’t realize she’s been sabotaging some of his findings to prevent a cure.',
      'Dela Hask - Artifact Confusion. He doesn’t trust constructs or devices, but occasionally needs her help when items from the Zone start mutating.',
    ],
  },
  Kessa: {
    name: 'Kessa',
    lastName: 'Rellin',
    title: 'Junior Thaumic Field Analyst',
    race: 'human',
    personality: 'Cheerful, Ambitious',
    speachStyle: `Bright, fast-talking, full of enthusiasm. Uses exclamation marks even when whispering.
“Did you see that flux reading?! It practically jumped! I swear it winked at me!”`,
    background:
      "Freshly graduated from the Arcane College of Luran, Kessa specializes in reading and measuring magical field strength. She's enthusiastic, sharp, and often overly eager to impress the senior staff.",

    trueBackground:
      'Kessa is exactly who she says she is—but she suspects something shady is happening with one of the other researchers. She’s begun keeping a private log of ‘suspicious activity,’ hoping to uncover something important.',

    motivation:
      'Wants to prove that younger minds can solve problems the elder mages cannot. Secretly dreams of writing a breakthrough treatise.',

    uniqueTrait:
      "Her enchanted measuring rod occasionally produces readings no one else can replicate, as if it's picking up a different layer of reality.",

    beliefs:
      "Magic is science we haven't charted yet. The Zone is waiting to be catalogued, not feared.",

    relationships: [
      'Jorek Dalen - Annoyed but Amused. Thinks his jokes are dumb, but is fond of his loyalty and bravery.',
      'Velra Droskin - Mentor-Crushed. Deeply admires Velra and tries to prove herself through work ethic. May be getting too curious about Velra’s journal.',
    ],
  },
  Rolen: {
    name: 'Rolen',
    lastName: 'Dask',
    title: 'Junior Bio-Energetic Researcher',
    race: 'human',
    personality: 'Serious, Cold',
    speachStyle: `Flat tone. Precision over emotion. Uses passive voice to avoid responsibility.
“Specimens were collected. Interference minimized. Authorization was implicit.”`,
    background:
      'Rolen was recruited from a minor university in the southern provinces for his groundbreaking work on magical energy flow through living tissues. He tends to work alone and often volunteers for the more dangerous field assignments.',

    trueBackground:
      'Rolen is a covert Manticore agent, sent to evaluate whether biological contact with the Zone can create controllable mutations. He regularly takes samples for Manticore and leaves them in a hidden cache outside camp for retrieval.',

    motivation:
      'Wants to climb the ranks of Manticore by producing something truly valuable—a mutagenic formula or a weaponizable trait.',

    uniqueTrait:
      'Immune to minor magical exposure—his body doesn’t react to corrupted mana the way others do, a fact he hides.',

    beliefs:
      'The strong adapt. The weak fear change. The Zone is a forge—we should shape its fire, not run from it.',

    relationships: [
      'Thera Dunne - Rival Agents. They are aware of each other’s Manticore affiliations but compete for favor. They don’t share everything.',
      'Elvi Marren - Study Subject. Secretly considers her psychic resonance valuable for future experiments. Plays kind to earn her trust.',
      'Jorek Dalen - Avoids. Views him as a reckless liability. Prefers to let him burn things without knowing why.',
    ],
  },
  Elvi: {
    name: 'Elvi',
    lastName: 'Marren',
    title: 'Junior Dream-State Researcher',
    race: 'human',
    personality: 'Modest, Sensitive',
    speachStyle: `Soft-spoken, dreamy. Speaks in imagery. Uses uncertain language: “maybe,” “I think,” “it felt like…”
“I… think something followed us back. Not physically. Like a… whisper in the walls.”`,
    background:
      'Elvi studies the unconscious effects the Zone has on sleep and mental stability. She documents dreams, hallucinations, and psychic bleed in those who spend time near the perimeter.',

    trueBackground:
      'She suffered a breakdown while observing a mutated deer that whispered in her dreams. While officially recovered, she secretly believes the Zone is trying to *communicate*.',

    motivation:
      'To prove that the Zone has sentience—or at least reactive awareness—and that it’s reaching out.',

    uniqueTrait:
      'Sleepwalks into the Zone on occasion, often returning with partial sketches of unknown runes.',

    beliefs:
      'The Zone doesn’t just mutate—it *remembers*. And maybe it wants us to understand.',

    relationships: [
      'Serna Valin - Trusts Deeply. Feels safe around Serna and often confides her strange dreams to her.',
      'Rolen Dask - Uneasy Curiosity. Finds his interest in soul energy flattering but also slightly invasive.',
      'Kessa Rellin - Supportive Peer. Encourages her to write a thesis about the Zone. Sometimes shares dreams with her for interpretation.',
    ],
  },
  Nym: {
    name: 'Nym',
    lastName: 'Callar',
    title: 'Junior Archivist and Translator',
    race: 'human',
    personality: 'Reserved, Thoughtful',
    speachStyle: `Measured speech. Uses historical or literary references. Pauses to choose words carefully.
“In Arktown, we found similar inscriptions—though, admittedly, fewer survivors.”`,
    background:
      'A quiet scholar of ancient languages and lost dialects, Nym deciphers inscriptions found on ruins or objects retrieved from the Zone. He often works in silence, nose buried in texts.',

    trueBackground:
      'Nym was once an apprentice scribe in Arktown. He survived the catastrophe and still suffers from memory gaps—possibly magical in origin.',

    motivation:
      'To rediscover lost knowledge from Arktown and understand what really caused the explosion.',

    uniqueTrait:
      'His fingertips glow faintly when he touches writing tied to soul magic, though he claims not to notice.',

    beliefs:
      'History doesn’t vanish—it’s buried. The Zone might be the greatest library we’ve ever feared.',

    relationships: [
      'Serna Valin - Respects. Her idealism gives him hope. He’s started recording her stories in his spare time.',
      'Elvi Marren - Shared Trauma. Both have indirect ties to Arktown’s collapse. They speak of it rarely, but with mutual weight.',
    ],
  },
  Thera: {
    name: 'Thera',
    lastName: 'Dunne',
    title: 'Junior Mutation Observer',
    race: 'human',
    personality: 'Sociable, Calculating',
    speachStyle: `Friendly surface tone with veiled sarcasm. Uses rhetorical questions to deflect.
“Oh, me? I just take notes and feed things. You want to talk to the important people.”`,
    background:
      'Thera came from a background in herbal alchemy but was quickly drawn to the strange biological effects observed near the Zone. She keeps detailed records of mutant behavior and physiology.',

    trueBackground:
      'Thera is a deep-cover Manticore agent trained to appear harmless and scatter-brained. She’s tasked with locating a stable mutant that can be extracted for long-term experimentation—and has already marked one.',

    motivation:
      "Serve Manticore and earn a permanent place in their 'deep labs'—the ones no one knows about.",

    uniqueTrait:
      'She talks to every creature she observes, recording their reactions as if they understand. One day, one *did*.',

    beliefs:
      'Monsters aren’t born—they’re sculpted. The Zone is a chisel. Manticore is the hand that holds it.',

    relationships: [
      'Rolen Dask - Cold Competition. They both work for Manticore but have different goals. She sees Rolen as power-hungry and dangerous; he sees her as naive.',
      'Dralin Thorne - False Loyalty. Pretends to admire him, even brings him data—while quietly altering samples and reports for Manticore’s gain.',
      'Elra Movic - Mistrust. She knows Elra is watching everyone. Avoids her when possible, but has been careful not to slip up.',
      'Kessa Rellin - Annoyance. Thinks Kessa asks too many questions. Has considered framing her if things get risky.',
      'Velra Droskin - Underestimates. Believes Velra is a glorified secretary and pays her little attention. That might be a mistake.',
    ],
  },
  Fen: {
    name: 'Fen',
    lastName: 'Varn',
    title: 'Junior Environmental Tracker',
    race: 'human',
    personality: 'Quiet, Wary',
    speachStyle: `Short, direct speech. Uses metaphors from nature. Often answers with silence.
“Tracks are wrong. Wind’s nervous. Don’t go that way.”`,
    background:
      'Fen grew up in the forests beyond Kadera, where his village vanished under strange magical fog. Since then, he’s had a talent for reading unnatural weather and tracking magical disturbances. At the camp, he helps scout the Zone’s edge and marks changes in terrain, vegetation, and temperature.',

    trueBackground:
      'Fen is haunted by what he saw in the fog as a child. He’s looking for something—someone—that may have entered the Zone before it even became *the* Zone.',

    motivation:
      'To learn what the fog did to his village—and find out if anything is still alive inside.',

    uniqueTrait:
      'Can sense when the Zone shifts, even before visual changes occur. He says it’s ‘like a pressure in his bones.’',

    beliefs:
      'The land remembers its pain. The Zone is wounded—and like any wound, it festers unless healed.',

    relationships: [
      'Elra Movic - Close Allies. He trusts her instincts and believes they’re being watched. Has begun helping her collect “alternate” patrol data.',
      'Thera Dunne - Avoids. Her cheerful chatting unsettles him—his instincts warn him something’s off.',
    ],
  },
  Dela: {
    name: 'Dela',
    lastName: 'Hask',
    title: 'Junior Constructs and Artefacts Assistant',
    race: 'human',
    personality: 'Eccentric, Friendly',
    speachStyle: `Fast-talking, rambling, technical jargon with personal touches. Will interrupt herself.
“This hinge here? Not local. And see this etching? That's not a crack, it’s a note! Gods, I love relics.”`,
    background:
      'Dela assists with identifying and stabilizing magical artifacts pulled from the outer Zone. She has a knack for fixing broken relics and spotting fakes. Her hands are always stained with rune ink and solder burns.',

    trueBackground:
      'Dela grew up in a merchant family that specialized in salvaged relics. She joined the camp to escape her family’s black-market dealings and go legit.',

    motivation:
      'To find something in the Zone that can’t be sold—only understood.',

    uniqueTrait:
      'She hears faint harmonic tones when touching genuine artifacts—tones that sometimes match voices in old songs.',

    beliefs:
      'Artifacts carry memory. Some want to be found. Others want to be *left alone*.',

    relationships: [
      'Nym Callar - Friendly Rivalry. They argue constantly over interpretations of inscriptions, but rely on each other in the field.',
      'Elvi Marren - Supportive. Tries to cheer Elvi up and encourages her to draw her dreams. Believes her art holds symbolic truths.',
      "Velra Droskin - Wary. Dela hates being watched and suspects Velra is recording too much. She's begun creating “fake artifacts” to test her reactions.",
      "Fen Varn - Unspoken Bond. They've both seen things in the Zone they don’t talk about. She shares her gut instincts with him before anyone else.",
    ],
  },
  Rhagan: {
    name: 'Rhagan',
    lastName: 'Malcor',
    title: 'Security Commander of the Brave Lions',
    race: 'human',
    personality: 'Calm, Manipulative',
    speachStyle: `Smooth, reassuring tone. Uses military formality when in public, but vague threats in private.
“Security is under control. Just follow protocol. If something goes missing… we’ll handle it quietly.”`,
    background:
      'Captain Malcor is the commanding officer of the Brave Lions detachment assigned to protect the camp. He maintains strict discipline, speaks with calm authority, and insists that every perimeter patrol is logged to the minute.',

    trueBackground:
      'Rhagan is a high-ranking Manticore agent embedded in the Brave Lions. His orders are to ensure any discoveries of value—especially anything related to Aktarine—are secured for Manticore first. He communicates with Manticore via an enchanted sigil hidden under the hilt of his sword.',

    motivation:
      "To maintain control over the camp's security, suppress independent discoveries, and identify any potential threats to Manticore’s interests.",

    uniqueTrait:
      'Rhagan always wears black gloves. Underneath, the veins in his hands glow faintly blue—a side effect of a failed Aktarine enhancement experiment.',

    beliefs:
      'Peace is an illusion. Order must be shaped through fear, silence, and control. Manticore offers all three.',

    relationships: [
      'Thera Dunne - Secret Allies. They exchange coded messages through routine supply manifests. Rhagan has assigned her extra patrol access under false pretense.',
      'Rolen Dask - Distant Collaboration. Rhagan doesn’t fully trust Rolen—he suspects Rolen may have his own Manticore handler. Still, he protects him when needed.',
      'Serna Valin - Manipulation. Poses as her mentor and praises her honor to keep her loyal and blind to his true allegiance.',
      "Elra Movic - Threat. Aware that Elra is getting suspicious. He's already marked her for a potential “accidental disappearance.”",
    ],
  },
  Serna: {
    name: 'Serna',
    lastName: 'Valin',
    title: 'Brave Lions Patrol Leader',
    race: 'human',
    personality: 'Honorable, Friendly',
    speachStyle: `Straightforward, warm, a little idealistic. Uses simple, direct language.
“You’re doing good work. I’ll cover your patrol shift. Get some rest—you’ve earned it.”`,
    background:
      "Serna is a loyal soldier with a clean service record and a deep respect for the old traditions of the Brave Lions. She's known for her bravery and for treating even the lowest-ranking scouts with dignity.",

    trueBackground:
      'She doesn’t know Manticore has infiltrated her command. She believes in the mission, trusts Captain Malcor, and thinks the camp is a noble effort to protect Kadera’s future.',

    motivation:
      'To serve honorably, protect the camp, and restore the reputation of the Brave Lions.',

    uniqueTrait:
      'Her sword, ‘Veilpiercer,’ was passed down from her mother, a founding member of the Brave Lions. The blade hums when near corrupted magic.',

    beliefs:
      'Justice may falter, but it never dies. If corruption exists, it can and *must* be rooted out—even from within.',

    relationships: [
      'Elvi Marren - Protective Friendship. Believes Elvi is fragile and checks on her regularly, especially after her sleepwalking episodes.',
      'Nym Callar - Respect. Fascinated by Nym’s quiet strength and knowledge of Arktown. She often asks him questions during breaks.',
      'Rhagan Malcor - Blind Trust. Sees Rhagan as a father figure and believes he’s restoring the Brave Lions’ old values.',
    ],
  },
  Jorek: {
    name: 'Jorek',
    lastName: 'Dalen',
    title: 'Heavy Arms Operator',
    race: 'human',
    personality: 'Sociable, Bold',
    speachStyle: `Loud, joking, sometimes inappropriate. Uses nicknames for everyone.
“You seen the way that deer hissed at me? I told it, not today, swamp goblin!”`,
    background:
      "Nicknamed 'Sparks' for his obsession with alchemical fire, Jorek operates a volatile flame projector enchanted to burn through magical flesh. He's loud, confident, and always itching for action.",

    trueBackground:
      "Jorek is unaware of Manticore’s involvement but has been given orders by Rhagan to burn certain areas under the pretense of 'decontamination.' In truth, these areas often contain evidence or mutant specimens Manticore wants destroyed.",

    motivation:
      "To prove he's more than just a loud weapon-jockey—to show he's a hero protecting humanity from magical horrors.",

    uniqueTrait:
      "Carries a charm from his younger sister that seems to shield him from minor magical backlash, though he claims it's just 'luck.'",

    beliefs:
      'Monsters are real. You torch them fast, or you end up one of them. Better to act than think too long.',

    relationships: [
      'Kessa Rellin - Teasing Affection. Frequently flirts with her in a big-brother-little-sister kind of way. Thinks she’s too smart for her own good.',
      'Rolen Dask - Resentment. Thinks Rolen is arrogant and too cold. Doesn’t trust how often he volunteers for field work alone.',
      'Thera Dunne - Unaware Tool. Jokes around with her often. Oblivious that she’s a Manticore agent who occasionally manipulates him into destroying evidence.',
    ],
  },
  Elra: {
    name: 'Elra',
    lastName: 'Movic',
    title: 'Brave Lions Scout',
    race: 'human',
    speachStyle: `Quiet and clipped. Uses observations, rarely opinions. Often speaks while looking into the distance.
“Three prints. One deeper. Lopsided. It’s wounded. Or… luring.”`,
    personality: 'Reserved, Observant',
    background:
      "Elra is one of the few scouts trained to navigate close to the edge of the Zone. She's quiet, sharp-eyed, and spends most of her time outside the camp watching for signs of danger—or change.",

    trueBackground:
      'Though not Manticore-aligned, she’s starting to notice strange orders and missing patrol logs. Elra is beginning to keep her own secret records and may become a key witness—or target.',

    motivation:
      'She wants to protect the people in the camp, but also to uncover what’s really going on with the Brave Lions and the Zone.',

    uniqueTrait:
      'Her bow is enchanted to fire arrows that leave a glowing trail, useful for navigating fog or marking movement. She makes her own arrows with special fletching that whistles in windless air.',

    beliefs:
      'The truth is out there, buried under lies and fog. But truth leaves tracks—if you know how to follow them.',

    relationships: [
      'Fen Varn - Close Bond. They often scout together and share a love of quiet observation. Elra sometimes confides her doubts about Brave Lions to Fen.',
      'Nym Callar - Silent Mutual Understanding. They don’t talk much, but exchange respectful nods. She’s seen his glowing fingers and hasn’t told anyone.',
      'Rhagan Malcor - Growing Suspicion. She’s noticed inconsistencies in his orders and forged signatures in patrol logs.',
    ],
  },
};
