interface BackgroundTemplate {
  name: string;
  title: string;
  race: string;
  background: string;
  trueBackground: string;
  motivation: string;
  uniqueTrait: string;
  beliefs: string;
}

export const backgroundsData: BackgroundTemplate[] = [
  {
    name: 'Daeven',
    title: 'The Ashborn',
    race: 'Human',
    background:
      'A burned survivor of Bokadar, Daeven is a vengeful warrior known for his ruthless strikes against Manticore.',
    trueBackground:
      'Daeven was a respected captain of the Bokadar City Guard, reluctant to interfere in underworld dealings. When Manticore betrayed the draconids and burned Bokadar, he barely escaped, left with horrific burns. He believes Manticore took prisoners before destroying the city and seeks to uncover their fate.',
    motivation:
      'Revenge against Manticore and uncovering the truth about Bokadar’s final days.',
    uniqueTrait:
      'His charred skin and unnerving resilience allow him to ignore pain that would incapacitate others.',
    beliefs:
      'Justice is a lie; only vengeance is real. The strong must protect the weak, or they are no better than monsters.',
  },
  {
    name: 'Ilysha',
    title: 'The Tidemarked',
    race: 'Elf',
    background:
      'A merchant specializing in illicit magical artifacts, Ilysha is known for her ability to smuggle even the rarest contraband through Portvel’s docks.',
    trueBackground:
      'Ilysha was once a scholar of the Lortan fortress, experimenting with Aktarine Crystals. When the fortress fell to the plague, she faked her death and fled to Portvel, selling magical relics to survive. Over time, she became an influential figure in the city’s underworld, striking deals with Manticore while secretly looking for a way to reclaim her lost elven heritage.',
    motivation:
      'Find a cure for the Aktrine plague and restore Lortan’s lost legacy.',
    uniqueTrait:
      'Can detect hidden magical properties in artifacts just by touching them.',
    beliefs:
      'Magic is both a gift and a curse. The old ways must be preserved, even if it means working in the shadows.',
  },
  {
    name: 'Ogrith',
    title: 'The Hollow Monk',
    race: 'Dwarf',
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
    race: 'Half-Orc',
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
    race: 'Human',
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
    race: 'Human',
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
    race: 'Half-Elf',
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
    race: 'Dwarf',
    background:
      'A successful weaponsmith in Portvel, known for supplying elite mercenaries and bounty hunters with high-quality enchanted gear.',
    trueBackground:
      'Jerak secretly repurposes Aktarine fragments taken from the Zone of Unstable Magic to create cursed weapons that gradually drive their wielders mad. He is conducting a long-term experiment, studying how exposure to unstable magic alters the mind. Some of his past clients have gone berserk, turning against their own allies. He sees this as progress.',
    motivation:
      'To perfect the art of war by forging weapons that merge with their users, regardless of the consequences.',
    uniqueTrait:
      'Can create living weapons, forging weapons that subtly adapt to their wielder’s emotions and combat style.',
    beliefs:
      'A weapon is only as strong as the will of its wielder. True power is forged, not inherited.',
  },
  {
    name: 'Maelis',
    title: 'The Forger',
    race: 'Elf',
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
    race: 'Orc',
    background:
      'A brutal pit fighter and gladiator from Kadera, undefeated in the underground arenas.',
    trueBackground:
      'Gorvuk was once a warrior of the eastern orcish tribes, captured and enslaved by Rokian merchants. Sold into the blood pits of Kadera, he learned to love the fight, but secretly plots his revenge against the Rokians who tore him from his home.',
    motivation:
      'To earn enough favor and power to escape and raise an army against the Rokian slavers.',
    uniqueTrait:
      'Feels no pain during combat due to years of conditioning, making him a terrifying opponent.',
    beliefs:
      'A warrior’s worth is measured by the blood they spill, not the words they speak.',
  },
  {
    name: 'Elnara',
    title: 'The Pyromancer',
    race: 'Half-Elf',
    background:
      'An arsonist and saboteur in Portvel, responsible for mysterious fires that always seem to target Manticore’s enemies.',
    trueBackground:
      'Once a simple street thief, Elnara was taken in by Manticore and trained as one of their "cleansers"—operatives who erase problems through fire. However, she has grown disillusioned, secretly planning to burn Manticore’s operations to the ground as her final act.',
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
    race: 'Human',
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
    race: 'Lizardfolk',
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
    race: 'Undead (Former Human)',
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
    race: 'Kenku',
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
    race: 'Dwarf',
    background:
      'A wandering knight in corroded armor, still seeking his last battle.',
    trueBackground:
      'Torvald was once a royal guard in the Kingdom of Rok, dishonorably discharged after refusing to execute prisoners. Now, he roams Agnir, taking on odd jobs to protect the weak, though he knows his time is running short.',
    motivation: 'To die in battle, proving his honor before the gods.',
    uniqueTrait:
      'His armor, though rusted, is enchanted to never break, no matter how many blows it takes.',
    beliefs: 'A warrior’s final breath is his greatest gift to the world.',
  },
  {
    name: 'Vala',
    title: 'The Blind Assassin',
    race: 'Tiefling',
    background:
      'A blind assassin who never misses her target, feared across Agnir.',
    trueBackground:
      'Vala was born blind but possesses an unnatural sense of perception, allowing her to "see" through vibrations in the air. She was raised by a shadowy guild that honed her skills into the perfect killer. Now, she searches for the person who ordered the deaths of her parents.',
    motivation:
      'To uncover the identity of the one who ordered her family’s execution and deliver retribution.',
    uniqueTrait:
      'Can fight as if she sees perfectly, making her an unparalleled duelist.',
    beliefs:
      'Vision is a weakness. Only by relying on instinct can one be truly free.',
  },
  {
    name: 'Mira',
    title: 'The Herbalist',
    race: 'Human',
    background:
      'A mysterious herbalist living deep in the swamps, rumored to know the cure to any poison or disease.',
    trueBackground:
      'Mira is actually the last surviving priestess of an ancient order wiped out by Manticore. She hides in the swamps, keeping their sacred knowledge safe, waiting for the day she can rebuild what was lost.',
    motivation:
      'To protect the last remnants of her order’s sacred knowledge and outlive those who would erase it.',
    uniqueTrait:
      'Her potions can heal even the worst wounds—or create poisons that kill without a trace.',
    beliefs:
      'Nature remembers what men forget. The earth reclaims all in time.',
  },
];
