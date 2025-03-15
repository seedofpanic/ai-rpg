export interface Location {
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  npcs: string[];
}

export const locations: Location[] = [
  {
    name: 'Market Square',
    description:
      'A bustling trading square in the city center, surrounded by various shops and stores',
    x: 100,
    y: 100,
    width: 500,
    height: 500,
    npcs: [],
  },
  {
    name: "Alchemist's Shop",
    description:
      'A small shop on the corner of the market square, filled with vials, herbs, and magical items',
    x: 700,
    y: 100,
    width: 300,
    height: 300,
    npcs: [],
  },
  {
    name: "Blacksmith's Forge",
    description:
      'A hot and noisy forge where blacksmith forges weapons and armor',
    x: 1100,
    y: 100,
    width: 400,
    height: 400,
    npcs: [],
  },
  {
    name: 'Fishing Village',
    description: 'A small village on the riverbank where fishermen live',
    x: 100,
    y: 700,
    width: 600,
    height: 400,
    npcs: [],
  },
  {
    name: 'Farm',
    description: 'A large farm outside the city where various crops are grown',
    x: 800,
    y: 700,
    width: 500,
    height: 500,
    npcs: [],
  },
  {
    name: "Jeweler's Workshop",
    description: 'A workshop where jeweler creates exquisite jewelry',
    x: 1400,
    y: 700,
    width: 350,
    height: 350,
    npcs: [],
  },
];
