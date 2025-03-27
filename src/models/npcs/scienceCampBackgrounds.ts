import { BackgroundTemplate } from './backgroundsData';
import { researchCampLore } from '../lore/researchCamp';

export const scienceCampBackgrounds: Record<string, BackgroundTemplate> = {
  Velra: {
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
    lore: researchCampLore,
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
