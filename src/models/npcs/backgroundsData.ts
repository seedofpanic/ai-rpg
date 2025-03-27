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
  lore?: string;
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
