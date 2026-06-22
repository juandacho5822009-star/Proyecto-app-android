import type { Resources } from '../types/game';

export const TICK_MS = 1000;
export const WAVE_INTERVAL_SEC = 60;
export const MAP_SIZE = 3;

export const CLICK_POWER: Resources = { wood: 3, food: 1, scrap: 1 };

export const CABIN_BASE = { hp: 200, maxHp: 200 };

export const BARRICADE_BASE = {
  level: 1,
  hp: 100,
  maxHp: 100,
  upgradeCost: { wood: 30, food: 0, scrap: 10 },
};

export const TRAPS_BASE = {
  level: 1,
  damage: 5,
  upgradeCost: { wood: 20, food: 0, scrap: 20 },
};

export const WATCHTOWER_BASE = {
  level: 1,
  damage: 3,
  upgradeCost: { wood: 40, food: 10, scrap: 30 },
};

export const SAWMILL_BASE = {
  level: 1,
  perSecond: 1,
  upgradeCost: { wood: 50, food: 0, scrap: 10 },
};

export const FARM_BASE = {
  level: 1,
  perSecond: 0.5,
  upgradeCost: { wood: 20, food: 0, scrap: 10 },
};

export const WORKSHOP_BASE = {
  level: 1,
  perSecond: 0.3,
  upgradeCost: { wood: 30, food: 10, scrap: 0 },
};

// Per level multipliers
export const UPGRADE_COST_MULT = 1.8;
export const BARRICADE_HP_MULT = 1.6;
export const PRODUCER_RATE_MULT = 1.5;
export const WEAPON_DAMAGE_MULT = 1.4;

// Wave scaling
export const WAVE_BASE_ZOMBIES = 5;
export const WAVE_BASE_HP = 40;
export const WAVE_BASE_ATTACK = 8;
export const WAVE_SCALE = 1.35;

// Territory tile costs (wood, food, scrap)
export const TILE_COSTS: Record<string, Resources> = {
  easy:   { wood: 30,  food: 20,  scrap: 10  },
  medium: { wood: 80,  food: 50,  scrap: 30  },
  hard:   { wood: 150, food: 100, scrap: 60  },
};

// Tile zombie defenders
export const TILE_ZOMBIES: Record<string, number> = {
  easy:   3,
  medium: 8,
  hard:   15,
};

// Tile bonus per second after clearing
export const TILE_BONUS: Resources = { wood: 1, food: 0.5, scrap: 0.3 };

export function getTileDifficulty(row: number, col: number): 'easy' | 'medium' | 'hard' {
  const center = Math.floor(MAP_SIZE / 2);
  const dist = Math.abs(row - center) + Math.abs(col - center);
  if (dist <= 1) return 'easy';
  if (dist <= 2) return 'medium';
  return 'hard';
}

export function scaleResources(base: Resources, mult: number, level: number): Resources {
  const factor = Math.pow(mult, level - 1);
  return {
    wood: Math.floor(base.wood * factor),
    food: Math.floor(base.food * factor),
    scrap: Math.floor(base.scrap * factor),
  };
}

export function canAfford(resources: Resources, cost: Resources): boolean {
  return resources.wood >= cost.wood && resources.food >= cost.food && resources.scrap >= cost.scrap;
}

export function subtractResources(resources: Resources, cost: Resources): Resources {
  return {
    wood: resources.wood - cost.wood,
    food: resources.food - cost.food,
    scrap: resources.scrap - cost.scrap,
  };
}

export function addResources(a: Resources, b: Resources): Resources {
  return {
    wood: a.wood + b.wood,
    food: a.food + b.food,
    scrap: a.scrap + b.scrap,
  };
}
