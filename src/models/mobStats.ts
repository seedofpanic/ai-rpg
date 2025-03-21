import { MobType } from './mob';

export const MOB_STATS: Record<
  MobType,
  {
    health: number;
    attackPower: number;
    defense: number;
    speed: number;
    aggroRange: number;
    criticalChance: number;
    dodgeChance: number;
  }
> = {
  wolf: {
    health: 80,
    attackPower: 15,
    defense: 3,
    speed: 15,
    aggroRange: 150,
    criticalChance: 0.15,
    dodgeChance: 0.1,
  },
  bandit: {
    health: 100,
    attackPower: 12,
    defense: 5,
    speed: 10,
    aggroRange: 120,
    criticalChance: 0.1,
    dodgeChance: 0.05,
  },
  zombie: {
    health: 120,
    attackPower: 10,
    defense: 8,
    speed: 7,
    aggroRange: 100,
    criticalChance: 0.05,
    dodgeChance: 0.02,
  },
  skeleton: {
    health: 90,
    attackPower: 13,
    defense: 4,
    speed: 12,
    aggroRange: 130,
    criticalChance: 0.12,
    dodgeChance: 0.08,
  },
  ghost: {
    health: 70,
    attackPower: 14,
    defense: 2,
    speed: 18,
    aggroRange: 160,
    criticalChance: 0.18,
    dodgeChance: 0.15,
  },
  goblin: {
    health: 85,
    attackPower: 11,
    defense: 6,
    speed: 13,
    aggroRange: 140,
    criticalChance: 0.08,
    dodgeChance: 0.06,
  },
  boar: {
    health: 110,
    attackPower: 16,
    defense: 7,
    speed: 11,
    aggroRange: 90,
    criticalChance: 0.07,
    dodgeChance: 0.03,
  },
  spider: {
    health: 60,
    attackPower: 12,
    defense: 3,
    speed: 16,
    aggroRange: 120,
    criticalChance: 0.1,
    dodgeChance: 0.12,
  },
  bat: {
    health: 50,
    attackPower: 8,
    defense: 2,
    speed: 20,
    aggroRange: 100,
    criticalChance: 0.05,
    dodgeChance: 0.15,
  },
};
