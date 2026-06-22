import type { Resources, ZoneProgress } from '../types/game';

export const TICK_MS = 1000;
export const WAVE_INTERVAL_SEC = 60;

export const CLICK_POWER: Resources = { gold: 5, wood: 3, food: 1, scrap: 1, gems: 0 };

export const CABIN_BASE = { hp: 200, maxHp: 200 };

export const BARRICADE_BASE = {
  level: 1,
  hp: 100,
  maxHp: 100,
  upgradeCost: { gold: 0, wood: 30, food: 0, scrap: 10, gems: 0 },
};
export const TRAPS_BASE = {
  level: 1,
  damage: 5,
  upgradeCost: { gold: 0, wood: 20, food: 0, scrap: 20, gems: 0 },
};
export const WATCHTOWER_BASE = {
  level: 1,
  damage: 3,
  upgradeCost: { gold: 100, wood: 40, food: 10, scrap: 30, gems: 0 },
};
export const SAWMILL_BASE = {
  level: 1,
  perSecond: 1,
  upgradeCost: { gold: 200, wood: 50, food: 0, scrap: 10, gems: 0 },
};
export const FARM_BASE = {
  level: 1,
  perSecond: 0.5,
  upgradeCost: { gold: 100, wood: 20, food: 0, scrap: 10, gems: 0 },
};
export const WORKSHOP_BASE = {
  level: 1,
  perSecond: 0.3,
  upgradeCost: { gold: 150, wood: 30, food: 10, scrap: 0, gems: 0 },
};

export const UPGRADE_COST_MULT = 1.8;
export const BARRICADE_HP_MULT = 1.6;
export const PRODUCER_RATE_MULT = 1.5;
export const WEAPON_DAMAGE_MULT = 1.4;

// Gold generation (passive)
export const GOLD_PER_SEC_BASE = 2;
export const GOLD_PER_LEVEL = 1;

// Wave config
export const WAVE_BASE_ZOMBIES = 5;
export const WAVE_BASE_HP = 40;
export const WAVE_BASE_ATTACK = 8;
export const WAVE_SCALE = 1.35;
export const MAX_VISUAL_ZOMBIES = 6;

// Upgrade hammer shop item
export const UPGRADE_HAMMER_COST_GOLD = 10000;
export const UPGRADE_HAMMER_EFFECT_MULT = 2;

export const INITIAL_WORLD: ZoneProgress[] = [
  { zone: 'forest',   name: 'Bosque Maldito',     icon: '🌲', level: 1,  maxLevel: 10, unlocked: true  },
  { zone: 'city',     name: 'Ciudad Abandonada',   icon: '🏙️', level: 0,  maxLevel: 10, unlocked: false },
  { zone: 'desert',   name: 'Desierto Árido',      icon: '🏜️', level: 0,  maxLevel: 10, unlocked: false },
  { zone: 'military', name: 'Base Militar',         icon: '🪖', level: 0,  maxLevel: 10, unlocked: false },
  { zone: 'lab',      name: 'Laboratorio Zombie',   icon: '🧪', level: 0,  maxLevel: 10, unlocked: false },
];

export function scaleResources(base: Resources, mult: number, level: number): Resources {
  const f = Math.pow(mult, level - 1);
  return {
    gold:  Math.floor(base.gold  * f),
    wood:  Math.floor(base.wood  * f),
    food:  Math.floor(base.food  * f),
    scrap: Math.floor(base.scrap * f),
    gems:  base.gems,
  };
}

export function canAfford(res: Resources, cost: Resources): boolean {
  return res.gold >= cost.gold && res.wood >= cost.wood &&
         res.food >= cost.food && res.scrap >= cost.scrap && res.gems >= cost.gems;
}

export function subtractResources(res: Resources, cost: Resources): Resources {
  return {
    gold:  res.gold  - cost.gold,
    wood:  res.wood  - cost.wood,
    food:  res.food  - cost.food,
    scrap: res.scrap - cost.scrap,
    gems:  res.gems  - cost.gems,
  };
}

export function addResources(a: Resources, b: Resources): Resources {
  return {
    gold:  a.gold  + b.gold,
    wood:  a.wood  + b.wood,
    food:  a.food  + b.food,
    scrap: a.scrap + b.scrap,
    gems:  a.gems  + b.gems,
  };
}
