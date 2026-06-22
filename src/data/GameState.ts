import { GC, scaleCost } from './GameConfig';
import type { CostMap } from './GameConfig';

export interface Resources {
  gold: number; wood: number; food: number; scrap: number; gems: number;
}

export interface UpgradeEntry {
  level: number;
  hp?: number; maxHp?: number;       // barricade only
  damage?: number;                   // traps / watchtower
  perSec?: number;                   // producers
  cost: CostMap;
}

export interface Upgrades {
  barricade: UpgradeEntry;
  traps: UpgradeEntry;
  watchtower: UpgradeEntry;
  sawmill: UpgradeEntry;
  farm: UpgradeEntry;
  workshop: UpgradeEntry;
}

export interface WaveState {
  number: number;
  active: boolean;
  zombiesTotal: number;
  zombiesAlive: number;
  zombieHp: number;
  zombieAtk: number;
  countdown: number;
}

export interface ZoneProgress {
  id: string; name: string; icon: string;
  level: number; maxLevel: number; unlocked: boolean;
}

export interface GameState {
  resources: Resources;
  cabinHp: number;
  upgrades: Upgrades;
  wave: WaveState;
  world: ZoneProgress[];
  stats: { kills: number; clicks: number; waves: number };
  over: boolean;
}

export function createInitialState(): GameState {
  return {
    resources: { gold: 500, wood: 80, food: 40, scrap: 30, gems: 5 },
    cabinHp: GC.CABIN_MAX_HP,
    upgrades: {
      barricade:  { level: 1, hp: 100, maxHp: 100, cost: scaleCost(GC.BARRICADE_COST, GC.UPGRADE_COST_MULT, 1) },
      traps:      { level: 1, damage: 5,   cost: scaleCost(GC.TRAPS_BASE_COST,      GC.UPGRADE_COST_MULT, 1) },
      watchtower: { level: 1, damage: 3,   cost: scaleCost(GC.WATCHTOWER_BASE_COST, GC.UPGRADE_COST_MULT, 1) },
      sawmill:    { level: 1, perSec: 1,   cost: scaleCost(GC.SAWMILL_BASE_COST,    GC.UPGRADE_COST_MULT, 1) },
      farm:       { level: 1, perSec: 0.5, cost: scaleCost(GC.FARM_BASE_COST,       GC.UPGRADE_COST_MULT, 1) },
      workshop:   { level: 1, perSec: 0.3, cost: scaleCost(GC.WORKSHOP_BASE_COST,   GC.UPGRADE_COST_MULT, 1) },
    },
    wave: {
      number: 0, active: false,
      zombiesTotal: 0, zombiesAlive: 0,
      zombieHp: 0, zombieAtk: 0,
      countdown: GC.WAVE_INTERVAL,
    },
    world: [
      { id: 'forest',   name: 'Bosque Maldito',    icon: '🌲', level: 1,  maxLevel: 10, unlocked: true  },
      { id: 'city',     name: 'Ciudad Abandonada',  icon: '🏙️', level: 0,  maxLevel: 10, unlocked: false },
      { id: 'desert',   name: 'Desierto Árido',     icon: '🏜️', level: 0,  maxLevel: 10, unlocked: false },
      { id: 'military', name: 'Base Militar',        icon: '🪖', level: 0,  maxLevel: 10, unlocked: false },
      { id: 'lab',      name: 'Laboratorio Zombie',  icon: '🧪', level: 0,  maxLevel: 10, unlocked: false },
    ],
    stats: { kills: 0, clicks: 0, waves: 0 },
    over: false,
  };
}

export function canAfford(res: Resources, cost: CostMap): boolean {
  return res.gold >= cost.gold && res.wood >= cost.wood && res.scrap >= cost.scrap;
}
