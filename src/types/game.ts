export interface Resources {
  wood: number;
  food: number;
  scrap: number;
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

export interface Tile {
  row: number;
  col: number;
  owned: boolean;
  zombieCount: number;
  bonusPerSec: Resources;
}

export interface Wave {
  number: number;
  isActive: boolean;
  zombiesTotal: number;
  zombiesAlive: number;
  zombieHp: number;
  zombieAttack: number;
  nextWaveCountdown: number;
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

export interface GameState {
  resources: Resources;
  cabin: Cabin;
  upgrades: Upgrades;
  territory: Tile[][];
  wave: Wave;
  stats: Stats;
  gameOver: boolean;
  lastTick: number;
  clickFeedback: { active: boolean; x: number; y: number; value: string };
}

export type RewardType = 'resources' | 'heal' | 'wave_skip' | 'repair_barricade';

export type GameAction =
  | { type: 'CLICK_CABIN'; payload: { x: number; y: number } }
  | { type: 'UPGRADE_BARRICADE' }
  | { type: 'UPGRADE_TRAPS' }
  | { type: 'UPGRADE_WATCHTOWER' }
  | { type: 'UPGRADE_SAWMILL' }
  | { type: 'UPGRADE_FARM' }
  | { type: 'UPGRADE_WORKSHOP' }
  | { type: 'ATTACK_TILE'; payload: { row: number; col: number } }
  | { type: 'TICK'; payload: { delta: number } }
  | { type: 'GRANT_REWARD'; payload: { reward: RewardType } }
  | { type: 'RESET_GAME' }
  | { type: 'CLEAR_CLICK_FEEDBACK' };
