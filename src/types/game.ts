export interface Resources {
  gold: number;
  wood: number;
  food: number;
  scrap: number;
  gems: number;
}

export interface BarricadeUpgrade {
  level: number;
  hp: number;
  maxHp: number;
  upgradeCost: Resources;
}

export interface ProducerUpgrade {
  level: number;
  perSecond: number;
  upgradeCost: Resources;
}

export interface WeaponUpgrade {
  level: number;
  damage: number;
  upgradeCost: Resources;
}

export interface Upgrades {
  barricade: BarricadeUpgrade;
  traps: WeaponUpgrade;
  watchtower: WeaponUpgrade;
  sawmill: ProducerUpgrade;
  farm: ProducerUpgrade;
  workshop: ProducerUpgrade;
}

export type ZombieType = 'basic' | 'soldier' | 'construction' | 'chef' | 'boss';

export interface ZombieUnit {
  id: string;
  type: ZombieType;
  hp: number;
  maxHp: number;
  side: 'left' | 'right';
  lane: number; // 0-4, vertical lane on screen
}

export interface Wave {
  number: number;
  isActive: boolean;
  zombiesTotal: number;
  zombiesAlive: number;
  zombieHp: number;
  zombieAttack: number;
  nextWaveCountdown: number;
  activeUnits: ZombieUnit[];
}

export interface Cabin {
  hp: number;
  maxHp: number;
}

export interface Stats {
  zombiesKilled: number;
  totalClicks: number;
  wavesSurvived: number;
}

export type WorldZone = 'forest' | 'city' | 'desert' | 'military' | 'lab';

export interface ZoneProgress {
  zone: WorldZone;
  name: string;
  icon: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
}

export interface GameState {
  resources: Resources;
  cabin: Cabin;
  upgrades: Upgrades;
  world: ZoneProgress[];
  wave: Wave;
  stats: Stats;
  gameOver: boolean;
  lastTick: number;
}

export type RewardType = 'resources' | 'heal' | 'wave_skip' | 'repair_barricade' | 'gold_boost';

export type GameAction =
  | { type: 'CLICK_CABIN' }
  | { type: 'UPGRADE_BARRICADE' }
  | { type: 'UPGRADE_TRAPS' }
  | { type: 'UPGRADE_WATCHTOWER' }
  | { type: 'UPGRADE_SAWMILL' }
  | { type: 'UPGRADE_FARM' }
  | { type: 'UPGRADE_WORKSHOP' }
  | { type: 'TICK'; payload: { delta: number } }
  | { type: 'GRANT_REWARD'; payload: { reward: RewardType } }
  | { type: 'BUY_UPGRADE_HAMMER' }
  | { type: 'RESET_GAME' };
