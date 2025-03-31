import { makeAutoObservable } from 'mobx';
import { Mob, MobType } from './mobs/mob';
import { NPC } from './npcs/npc';
import { v4 as uuidv4 } from 'uuid';
import { npcStore } from './npcs/npcStore';
import { mobStore } from './mobs/mobStore';
import { gameStore } from './gameStore';
import { Vector2 } from 'utils/vector2';
type locationData = Omit<
  Location,
  | 'id'
  | 'npcs'
  | 'monsters'
  | 'generateNPCs'
  | 'generateMonsters'
  | 'getDescription'
>;

export type DayTime = 'morning' | 'afternoon' | 'evening' | 'night';

export type Weather =
  | 'cloudy'
  | 'rainy'
  | 'foggy'
  | 'stormy'
  | 'clear'
  | 'overcast';

const requiredNPCs = ['Harl'];

const CLOSE_LOCATION_RADIUS = 100;

const BASE_X = 300;
const BASE_Y = 100;

export class Location {
  id = uuidv4();
  name: string;
  description: string;
  weather: Record<Weather, string>;
  time: Record<DayTime, string>;
  x: number;
  y: number;
  width: number;
  height: number;
  npcsTemplate: { role: string; minQuantity: number; maxQuantity: number }[];
  monstersTemplate: {
    type: MobType;
    minQuantity: number;
    maxQuantity: number;
  }[];
  npcs: Set<NPC> = new Set();
  monsters: Set<Mob> = new Set();

  constructor(data: locationData) {
    this.name = data.name;
    this.description = data.description;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.npcsTemplate = data.npcsTemplate;
    this.monstersTemplate = data.monstersTemplate;
    this.weather = data.weather;
    this.time = data.time;

    locationsStore.generateNPCs(this);
    locationsStore.generateMonsters(this);
  }

  getDescription(weather: Weather, dayTime: DayTime) {
    return (
      this.description + ' ' + this.weather[weather] + ' ' + this.time[dayTime]
    );
  }
}

class LocationsStore {
  locations: Location[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  generateNPCs(location: Location) {
    for (const template of location.npcsTemplate) {
      const quantity =
        Math.floor(
          Math.random() * (template.maxQuantity - template.minQuantity + 1),
        ) + template.minQuantity;
      for (let i = 0; i < quantity; i++) {
        location.npcs.add(npcStore.generateRandomNPC(location));
      }
    }
  }

  generateMonsters(location: Location) {
    for (const template of location.monstersTemplate) {
      const quantity =
        Math.floor(
          Math.random() * (template.maxQuantity - template.minQuantity + 1),
        ) + template.minQuantity;
      for (let i = 0; i < quantity; i++) {
        location.monsters.add(
          mobStore.generateRandomMob(location, template.type),
        );
      }
    }
  }

  getCloseLocationByPosition(position: Vector2) {
    return this.locations.filter((location) => {
      return (
        position.x >= location.x - CLOSE_LOCATION_RADIUS &&
        position.x <= location.x + location.width + CLOSE_LOCATION_RADIUS &&
        position.y >= location.y - CLOSE_LOCATION_RADIUS &&
        position.y <= location.y + location.height + CLOSE_LOCATION_RADIUS
      );
    });
  }

  addLocation(location: locationData) {
    this.locations.push(new Location(location));
  }

  generateLocations() {
    this.locations.length = 0;

    this.addLocation({
      name: 'Village Center',
      description:
        'The heart of the village where villagers gather, trade, and chat. A small well sits in the middle.',
      x: BASE_X + 300,
      y: BASE_Y + 500,
      width: 400,
      height: 300,
      npcsTemplate: [{ role: 'villager', minQuantity: 4, maxQuantity: 8 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'Gray clouds cast soft shadows over the village square.',
        rainy:
          'Raindrops patter on the cobblestones as villagers hurry for shelter.',
        foggy: 'A thick mist envelops the village center, muffling sounds.',
        stormy: 'Wind whips through the square as villagers board up windows.',
        clear: 'The crisp air brings clarity to the bustling village center.',
        overcast: 'A dull light blankets the square under the overcast sky.',
      },
      time: {
        morning:
          'Villagers begin their day, setting up stalls and drawing water from the well.',
        afternoon:
          'The square buzzes with activity as villagers go about their business.',
        evening:
          'People gather to chat as the day winds down, lanterns being lit one by one.',
        night:
          'The square is quiet except for the occasional night watchman passing through.',
      },
    });

    this.addLocation({
      name: "Blacksmith's Forge",
      description:
        'A hot and noisy forge where blacksmith forges weapons and armor',
      x: BASE_X + 900,
      y: BASE_Y + 500,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'blacksmith', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'Smoke from the forge blends with the gray clouds above.',
        rainy: 'Steam hisses as raindrops fall near the hot forge.',
        foggy:
          'The fog mixes with smoke, creating an eerie atmosphere around the forge.',
        stormy:
          'The blacksmith works harder to keep the forge hot against the howling wind.',
        clear:
          'The contrast between the dark forge and bright sky is striking.',
        overcast: 'The dim light makes the glow of the forge more pronounced.',
      },
      time: {
        morning:
          "The blacksmith starts early, heating the forge for the day's work.",
        afternoon:
          'Metal clangs against metal as the blacksmith works at peak productivity.',
        evening:
          "The forge glows orange as the blacksmith finishes the day's orders.",
        night:
          'The forge is banked but still warm, tools neatly arranged for tomorrow.',
      },
    });

    this.addLocation({
      name: "Herbalist's Hut",
      description:
        'A small wooden hut filled with drying herbs and potions, tucked near the forest edge',
      x: BASE_X + 100,
      y: BASE_Y + 600,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'herbalist', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'The hut feels cozy and enclosed under the gray sky.',
        rainy:
          'Rain patters on the roof as the scent of herbs intensifies in the humidity.',
        foggy:
          'Mist curls around the hut, blending with the aromatic steam from brewing potions.',
        stormy: 'Bottles rattle on shelves as wind buffets the small hut.',
        clear: 'The dry air enhances the potency of drying herbs.',
        overcast:
          'The dim light gives the colorful potions an otherworldly glow.',
      },
      time: {
        morning:
          'The herbalist collects fresh dew from plants for special potions.',
        afternoon:
          'Visitors come and go seeking remedies for various ailments.',
        evening:
          'Brewing potions bubble as the herbalist works by lantern light.',
        night:
          'Moonlight through the window illuminates shelves of mysterious ingredients.',
      },
    });

    this.addLocation({
      name: 'Fields',
      description: 'Plain fields to the north of the village',
      x: BASE_X + 1200,
      y: BASE_Y + 300,
      width: 500,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [{ type: 'wolf', minQuantity: 3, maxQuantity: 6 }],
      weather: {
        cloudy: 'Gray clouds cast moving shadows across the open grassland.',
        rainy:
          'Rain turns the earth soft and muddy, pools forming in low spots.',
        foggy:
          'Shapes of tall grass emerge and disappear in the shifting mist.',
        stormy:
          'Lightning illuminates the fields as tall grasses bend horizontally in the wind.',
        clear:
          'The crisp air carries the earthy scent of the fields for miles.',
        overcast: 'The dull light flattens the landscape into shades of gray.',
      },
      time: {
        morning:
          'Dew clings to every blade of grass, sparkling in the early light.',
        afternoon:
          'The sun beats down on the open fields, insects buzzing actively.',
        evening:
          'Long shadows stretch across the fields as birds return to roost.',
        night:
          'The fields are alive with the sounds of nocturnal creatures hunting.',
      },
    });

    this.addLocation({
      name: 'Old Mill',
      description:
        "An abandoned windmill just outside the village. The locals say it's haunted.",
      x: BASE_X + 1700,
      y: BASE_Y + 1150,
      width: 200,
      height: 200,
      npcsTemplate: [],
      monstersTemplate: [{ type: 'ghost', minQuantity: 1, maxQuantity: 2 }],
      weather: {
        cloudy:
          'Gray clouds gather ominously around the dilapidated structure.',
        rainy:
          "Rain seeps through the mill's damaged roof, dripping eerily inside.",
        foggy:
          'The mill appears and disappears in the swirling mist like a phantom.',
        stormy:
          'The remaining mill blades creak and groan in the powerful wind.',
        clear: 'Even on a clear day, the mill seems shrouded in gloom.',
        overcast: "The overcast sky enhances the mill's abandoned atmosphere.",
      },
      time: {
        morning:
          'The morning light reveals dust motes dancing in the abandoned mill.',
        afternoon:
          'Shadows inside the mill shift unnaturally as the sun moves.',
        evening:
          'As darkness falls, strange lights can be glimpsed through broken windows.',
        night:
          'Locals avoid looking at the mill at night, when the ghostly sounds are strongest.',
      },
    });

    this.addLocation({
      name: 'Forest Edge',
      description:
        'The edge of a dense forest. Travelers report strange sounds from within.',
      x: BASE_X + 1700,
      y: BASE_Y + 300,
      width: 300,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'goblin', minQuantity: 2, maxQuantity: 4 },
        { type: 'boar', minQuantity: 1, maxQuantity: 2 },
      ],
      weather: {
        cloudy:
          'The forest darkens under cloudy skies, making it seem more foreboding.',
        rainy:
          'Raindrops create a soothing rhythm as they hit the canopy of leaves.',
        foggy:
          'Tendrils of mist wind between tree trunks, obscuring the forest depths.',
        stormy:
          'Trees sway and creak ominously as wind howls through the forest.',
        clear: 'The forest edge is sharply defined against the clear light.',
        overcast:
          'The gloomy light makes it difficult to see far into the woods.',
      },
      time: {
        morning: 'Birds call from the treetops as the forest awakens.',
        afternoon:
          'The forest is alive with the sounds of creatures going about their business.',
        evening:
          'As daylight fades, nocturnal creatures begin to stir within the trees.',
        night:
          'Strange eyes reflect moonlight from deep within the dark forest.',
      },
    });

    this.addLocation({
      name: "Hunter's Cabin",
      description:
        'A lonely cabin where the village hunter lives and prepares his traps.',
      x: BASE_X + 900,
      y: BASE_Y + 700,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'hunter', minQuantity: 1, maxQuantity: 1 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'Smoke from the chimney blends with the gray clouds above.',
        rainy:
          'Rain drums on the cabin roof as water collects in hanging animal traps.',
        foggy:
          'The cabin appears isolated in its own world, wrapped in dense fog.',
        stormy:
          'The hunter secures loose equipment as wind rattles the cabin windows.',
        clear:
          'The scent of smoked meats wafts from the cabin in the crisp air.',
        overcast: 'The cabin looks particularly rugged against the dull sky.',
      },
      time: {
        morning: "The hunter prepares equipment for the day's expedition.",
        afternoon:
          'The cabin is often empty as the hunter is out tracking prey.',
        evening:
          'Freshly dressed game hangs outside as the hunter cleans tools by lamplight.',
        night:
          "A single light burns in the window as the hunter plans tomorrow's hunt.",
      },
    });

    this.addLocation({
      name: 'Tavern',
      description:
        'A cozy tavern where travelers and locals gather to share stories and drink ale.',
      x: BASE_X + 50,
      y: BASE_Y + 250,
      width: 400,
      height: 250,
      npcsTemplate: [
        { role: 'barkeep', minQuantity: 1, maxQuantity: 1 },
        { role: 'villager', minQuantity: 2, maxQuantity: 5 },
      ],
      monstersTemplate: [],
      weather: {
        cloudy:
          'The tavern feels especially cozy against the gray skies outside.',
        rainy:
          "The patter of rain on the roof adds to the tavern's comforting atmosphere.",
        foggy:
          "Patrons hurry inside from the fog, grateful for the tavern's clarity.",
        stormy:
          'The tavern is packed as villagers seek shelter from the storm.',
        clear:
          'The tavern door stands open to let in fresh air on the clear day.',
        overcast:
          'Extra candles are lit to brighten the tavern under gloomy skies.',
      },
      time: {
        morning:
          'The tavern is quiet as the barkeep wipes tables and prepares for the day.',
        afternoon: 'A few patrons enjoy late lunches and early drinks.',
        evening:
          'The tavern is lively with music, laughter, and clinking mugs.',
        night:
          'Die-hard drinkers and travelers with nowhere else to go remain until late.',
      },
    });

    this.addLocation({
      name: 'Ancient Ruins',
      description:
        'Mysterious stone ruins covered in strange symbols. Some say they hold ancient magic.',
      x: BASE_X + 2000,
      y: BASE_Y + 300,
      width: 600,
      height: 300,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'skeleton', minQuantity: 3, maxQuantity: 6 },
        { type: 'ghost', minQuantity: 1, maxQuantity: 2 },
      ],
      weather: {
        cloudy: 'Gray clouds gather abnormally thick over the ancient stones.',
        rainy:
          'Rain runs down carved symbols, making them seem to shift and move.',
        foggy: 'Fog curls around the ruined columns like searching fingers.',
        stormy: 'Lightning frequently strikes the tallest ruins during storms.',
        clear:
          'Even on clear days, a strange haze seems to hang over the ruins.',
        overcast:
          'The gloomy light makes the ruins appear more ancient and forbidding.',
      },
      time: {
        morning:
          'The rising sun casts long shadows that align mysteriously with certain stones.',
        afternoon:
          'The heat of day makes the air above the ruins shimmer strangely.',
        evening:
          'As darkness falls, some stones seem to emit a faint, pulsing glow.',
        night:
          'Under moonlight, shadows move among the ruins with no apparent source.',
      },
    });

    this.addLocation({
      name: 'Fishing Dock',
      description:
        'A wooden dock extending into the lake, where fishermen gather to catch fish.',
      x: BASE_X + 300,
      y: BASE_Y + 800,
      width: 200,
      height: 150,
      npcsTemplate: [{ role: 'fisherman', minQuantity: 2, maxQuantity: 4 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'The water takes on a steely gray hue under cloudy skies.',
        rainy: "Raindrops create endless ripples across the lake's surface.",
        foggy:
          'Fishing boats appear and disappear in the thick mist covering the water.',
        stormy: 'Waves crash against the dock as fishermen secure their boats.',
        clear: 'The water is so clear that fish can be seen swimming below.',
        overcast:
          'The flat light makes spotting fish beneath the surface easier.',
      },
      time: {
        morning:
          'Fishermen prepare their nets and boats for a day on the water.',
        afternoon: 'Boats return with their catches to be cleaned and sold.',
        evening:
          'The lake glows with the colors of sunset as the last boats return.',
        night:
          'A few dedicated fishermen work by lantern light, knowing some fish bite better at night.',
      },
    });

    this.addLocation({
      name: 'Cave System',
      description:
        'A network of dark caves that wind deep into the mountains. Strange noises echo from within.',
      x: BASE_X + 2000,
      y: BASE_Y + 600,
      width: 1000,
      height: 1000,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'goblin', minQuantity: 4, maxQuantity: 8 },
        { type: 'spider', minQuantity: 2, maxQuantity: 4 },
        { type: 'bat', minQuantity: 3, maxQuantity: 6 },
      ],
      weather: {
        cloudy:
          'The gloomy day makes the cave entrance less forbidding by contrast.',
        rainy:
          'Water streams down the mountain and into the cave, creating slick surfaces.',
        foggy: 'Mist flows in and out of the cave entrance like breath.',
        stormy:
          'The caves offer shelter from the storm, but bring their own dangers.',
        clear:
          'The temperature difference between outside and inside creates a breeze at the entrance.',
        overcast:
          'The dim light makes it difficult to see far into the cave entrance.',
      },
      time: {
        morning: 'Bats return to roost in the cave after a night of hunting.',
        afternoon:
          'The cave is at its brightest, with sunlight penetrating a short way inside.',
        evening:
          'Creatures within the cave begin to stir as darkness approaches.',
        night:
          'The cave mouth is a pool of absolute darkness, with strange sounds emanating from within.',
      },
    });

    this.addLocation({
      name: 'Market Square',
      description:
        'A bustling marketplace where merchants sell their wares and villagers trade goods.',
      x: BASE_X + 450,
      y: BASE_Y + 150,
      width: 650,
      height: 350,
      npcsTemplate: [
        { role: 'merchant', minQuantity: 2, maxQuantity: 4 },
        { role: 'villager', minQuantity: 3, maxQuantity: 6 },
      ],
      monstersTemplate: [],
      weather: {
        cloudy:
          'Merchants keep wary eyes on the sky, ready to cover goods if rain threatens.',
        rainy:
          'Trading continues under tarps and awnings, though at a slower pace.',
        foggy:
          'Lanterns are lit early to help shoppers find their way through the mist.',
        stormy:
          'The market quickly empties as people grab essentials and hurry home.',
        clear:
          "The clear air carries the market's mix of scents - spices, leather, fresh bread.",
        overcast: 'The subdued light makes evaluating goods more challenging.',
      },
      time: {
        morning:
          "Merchants set up stalls and arrange their goods for the day's business.",
        afternoon:
          'The market reaches peak activity with haggling and trading in full swing.',
        evening:
          'Vendors offer discounts on perishables as they prepare to close for the day.',
        night:
          'The square is empty except for a few stray animals and the night watch patrol.',
      },
    });

    this.addLocation({
      name: 'Guard Post',
      description:
        'A fortified post where village guards keep watch over the surrounding area.',
      x: BASE_X + 700,
      y: BASE_Y + 700,
      width: 200,
      height: 200,
      npcsTemplate: [{ role: 'guard', minQuantity: 2, maxQuantity: 4 }],
      monstersTemplate: [],
      weather: {
        cloudy: 'The dull light makes guards more alert for potential threats.',
        rainy:
          'Guards don oilskins as they continue their watch in the downpour.',
        foggy:
          'Extra guards are posted during fog, when visibility is poorest.',
        stormy: 'Guards shelter where they can while maintaining their watch.',
        clear:
          'From their elevated position, guards can see for miles on clear days.',
        overcast:
          "The flat light reveals no hiding shadows, easing the guards' task.",
      },
      time: {
        morning:
          'The night shift hands over to fresh guards as the new day begins.',
        afternoon: 'Guards rotate positions to stay alert during the long day.',
        evening:
          'Torches are lit as guards prepare for the more dangerous night watch.',
        night:
          'Guards are at their most vigilant, with archers ready on the walls.',
      },
    });

    this.addLocation({
      name: 'Swamp',
      description:
        'A murky swamp filled with twisted trees and mysterious lights. The air is thick with fog.',
      x: BASE_X + 1200,
      y: BASE_Y + 1100,
      width: 500,
      height: 700,
      npcsTemplate: [],
      monstersTemplate: [
        { type: 'boar', minQuantity: 2, maxQuantity: 4 },
        { type: 'spider', minQuantity: 3, maxQuantity: 6 },
        { type: 'ghost', minQuantity: 1, maxQuantity: 2 },
      ],
      weather: {
        cloudy: 'The swamp seems even more oppressive under heavy clouds.',
        rainy:
          'Rain creates a constant patter on the stagnant pools and broad leaves.',
        foggy:
          'The natural mist of the swamp thickens until navigation becomes impossible.',
        stormy:
          'Lightning illuminates the twisted landscape in brief, terrifying flashes.',
        clear: 'Insects swarm more actively in the warmer, clearer air.',
        overcast:
          'The gloomy light makes the swamp appear endless and timeless.',
      },
      time: {
        morning:
          'Steam rises from the water as the sun begins to warm the swamp.',
        afternoon:
          'The humidity peaks, making the air feel thick and difficult to breathe.',
        evening:
          'As light fades, strange glowing lights begin to appear among the trees.',
        night:
          'Eerie sounds and ghostly lights make the swamp a place of terror after dark.',
      },
    });

    this.addLocation({
      description: 'A camp of researchers who are studying the zone.',
      name: 'Researchers camp',
      x: BASE_X + 50,
      y: BASE_Y + 1100,
      width: 800,
      height: 800,
      npcsTemplate: [],
      monstersTemplate: [],
      weather: {
        cloudy:
          'Equipment is covered with tarps as researchers work mainly inside tents.',
        rainy:
          'Research slows as everyone huddles in tents, recording their latest findings.',
        foggy:
          'Researchers test fog density and composition with specialized equipment.',
        stormy:
          'All equipment is secured as researchers shelter from the dangerous conditions.',
        clear:
          'Solar-powered equipment runs at full capacity in the good weather.',
        overcast:
          'Researchers seem unaffected by the gloomy conditions, focused on their work.',
      },
      time: {
        morning:
          "The camp comes alive as researchers prepare equipment for the day's studies.",
        afternoon:
          'Teams return from field observations to compare notes and findings.',
        evening:
          "Researchers gather around campfires to discuss theories and tomorrow's plans.",
        night:
          'A skeleton crew monitors equipment through the night, recording anomalies.',
      },
    });

    this.addRequiredNPCs();
  }

  addRequiredNPCs() {
    for (const background of gameStore.backgroundsData) {
      if (requiredNPCs.includes(background.name)) {
        const suitableLocations = this.locations.filter(
          (location) => !!location.npcsTemplate,
        );
        const randomLocation =
          suitableLocations[
            Math.floor(Math.random() * suitableLocations.length)
          ];
        randomLocation.npcs.add(
          npcStore.generateRandomNPC(randomLocation, background),
        );
      }
    }
  }

  reset() {
    this.locations.length = 0;
  }
}

const locationsStore = new LocationsStore();

export { locationsStore };
