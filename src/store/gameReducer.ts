import type { GameState, GameAction, ZombieUnit, ZombieType } from '../types/game';
import {
  CLICK_POWER, CABIN_BASE, BARRICADE_BASE, TRAPS_BASE, WATCHTOWER_BASE,
  SAWMILL_BASE, FARM_BASE, WORKSHOP_BASE,
  UPGRADE_COST_MULT, BARRICADE_HP_MULT, PRODUCER_RATE_MULT, WEAPON_DAMAGE_MULT,
  WAVE_BASE_ZOMBIES, WAVE_BASE_HP, WAVE_BASE_ATTACK, WAVE_SCALE, WAVE_INTERVAL_SEC,
  GOLD_PER_SEC_BASE, GOLD_PER_LEVEL, UPGRADE_HAMMER_COST_GOLD,
  MAX_VISUAL_ZOMBIES, INITIAL_WORLD,
  canAfford, subtractResources, addResources, scaleResources,
} from '../constants/gameConfig';
import type { Resources } from '../types/game';

let zombieIdCounter = 0;
const ZOMBIE_TYPES: ZombieType[] = ['basic', 'soldier', 'construction', 'chef'];
const BOSS_TYPES: ZombieType[] = ['boss'];

function buildInitialState(): GameState {
  return {
    resources: { gold: 500, wood: 80, food: 40, scrap: 30, gems: 5 },
    cabin: { ...CABIN_BASE },
    upgrades: {
      barricade:  { ...BARRICADE_BASE },
      traps:      { ...TRAPS_BASE },
      watchtower: { ...WATCHTOWER_BASE },
      sawmill:    { ...SAWMILL_BASE },
      farm:       { ...FARM_BASE },
      workshop:   { ...WORKSHOP_BASE },
    },
    world: INITIAL_WORLD,
    wave: {
      number: 0,
      isActive: false,
      zombiesTotal: 0,
      zombiesAlive: 0,
      zombieHp: 0,
      zombieAttack: 0,
      nextWaveCountdown: WAVE_INTERVAL_SEC,
      activeUnits: [],
    },
    stats: { zombiesKilled: 0, totalClicks: 0, wavesSurvived: 0 },
    gameOver: false,
    lastTick: Date.now(),
  };
}

export { buildInitialState };

function nextUpgradeCost(base: Resources, level: number): Resources {
  return scaleResources(base, UPGRADE_COST_MULT, level);
}

function spawnZombieUnits(count: number, waveNum: number): ZombieUnit[] {
  const units: ZombieUnit[] = [];
  const visibleCount = Math.min(count, MAX_VISUAL_ZOMBIES);
  const isBossWave = waveNum % 5 === 0;
  const types = isBossWave ? BOSS_TYPES : ZOMBIE_TYPES;
  for (let i = 0; i < visibleCount; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const hp = WAVE_BASE_HP * Math.pow(WAVE_SCALE, waveNum - 1) * (isBossWave ? 5 : 1);
    units.push({
      id: `z-${zombieIdCounter++}`,
      type,
      hp: Math.ceil(hp),
      maxHp: Math.ceil(hp),
      side: i % 2 === 0 ? 'left' : 'right',
      lane: i % 5,
    });
  }
  return units;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'CLICK_CABIN': {
      if (state.gameOver) return state;
      return {
        ...state,
        resources: addResources(state.resources, CLICK_POWER),
        stats: { ...state.stats, totalClicks: state.stats.totalClicks + 1 },
      };
    }

    case 'UPGRADE_BARRICADE': {
      const { barricade } = state.upgrades;
      if (!canAfford(state.resources, barricade.upgradeCost)) return state;
      const lv = barricade.level + 1;
      const newMaxHp = Math.floor(BARRICADE_BASE.maxHp * Math.pow(BARRICADE_HP_MULT, lv - 1));
      return {
        ...state,
        resources: subtractResources(state.resources, barricade.upgradeCost),
        upgrades: {
          ...state.upgrades,
          barricade: {
            level: lv, hp: newMaxHp, maxHp: newMaxHp,
            upgradeCost: nextUpgradeCost(BARRICADE_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'UPGRADE_TRAPS': {
      const { traps } = state.upgrades;
      if (!canAfford(state.resources, traps.upgradeCost)) return state;
      const lv = traps.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, traps.upgradeCost),
        upgrades: {
          ...state.upgrades,
          traps: {
            level: lv,
            damage: Math.floor(TRAPS_BASE.damage * Math.pow(WEAPON_DAMAGE_MULT, lv - 1)),
            upgradeCost: nextUpgradeCost(TRAPS_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'UPGRADE_WATCHTOWER': {
      const { watchtower } = state.upgrades;
      if (!canAfford(state.resources, watchtower.upgradeCost)) return state;
      const lv = watchtower.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, watchtower.upgradeCost),
        upgrades: {
          ...state.upgrades,
          watchtower: {
            level: lv,
            damage: Math.floor(WATCHTOWER_BASE.damage * Math.pow(WEAPON_DAMAGE_MULT, lv - 1)),
            upgradeCost: nextUpgradeCost(WATCHTOWER_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'UPGRADE_SAWMILL': {
      const { sawmill } = state.upgrades;
      if (!canAfford(state.resources, sawmill.upgradeCost)) return state;
      const lv = sawmill.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, sawmill.upgradeCost),
        upgrades: {
          ...state.upgrades,
          sawmill: {
            level: lv,
            perSecond: parseFloat((SAWMILL_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, lv - 1)).toFixed(2)),
            upgradeCost: nextUpgradeCost(SAWMILL_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'UPGRADE_FARM': {
      const { farm } = state.upgrades;
      if (!canAfford(state.resources, farm.upgradeCost)) return state;
      const lv = farm.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, farm.upgradeCost),
        upgrades: {
          ...state.upgrades,
          farm: {
            level: lv,
            perSecond: parseFloat((FARM_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, lv - 1)).toFixed(2)),
            upgradeCost: nextUpgradeCost(FARM_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'UPGRADE_WORKSHOP': {
      const { workshop } = state.upgrades;
      if (!canAfford(state.resources, workshop.upgradeCost)) return state;
      const lv = workshop.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, workshop.upgradeCost),
        upgrades: {
          ...state.upgrades,
          workshop: {
            level: lv,
            perSecond: parseFloat((WORKSHOP_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, lv - 1)).toFixed(2)),
            upgradeCost: nextUpgradeCost(WORKSHOP_BASE.upgradeCost, lv),
          },
        },
      };
    }

    case 'BUY_UPGRADE_HAMMER': {
      if (state.resources.gold < UPGRADE_HAMMER_COST_GOLD) return state;
      return {
        ...state,
        resources: { ...state.resources, gold: state.resources.gold - UPGRADE_HAMMER_COST_GOLD },
      };
    }

    case 'TICK': {
      if (state.gameOver) return state;
      const { delta } = action.payload;
      let s = { ...state };

      // --- Passive gold & resource generation ---
      const { sawmill, farm, workshop } = s.upgrades;
      const goldGain = (GOLD_PER_SEC_BASE + GOLD_PER_LEVEL * (sawmill.level - 1)) * delta;
      s.resources = {
        ...s.resources,
        gold:  s.resources.gold  + goldGain,
        wood:  s.resources.wood  + sawmill.perSecond  * delta,
        food:  s.resources.food  + farm.perSecond     * delta,
        scrap: s.resources.scrap + workshop.perSecond * delta,
      };

      // --- Wave logic ---
      if (!s.wave.isActive) {
        const newCD = s.wave.nextWaveCountdown - delta;
        if (newCD <= 0) {
          const wn = s.wave.number + 1;
          const scale = Math.pow(WAVE_SCALE, wn - 1);
          const total = Math.ceil(WAVE_BASE_ZOMBIES * scale);
          s.wave = {
            number: wn,
            isActive: true,
            zombiesTotal: total,
            zombiesAlive: total,
            zombieHp: Math.ceil(WAVE_BASE_HP * scale),
            zombieAttack: Math.ceil(WAVE_BASE_ATTACK * scale),
            nextWaveCountdown: WAVE_INTERVAL_SEC,
            activeUnits: spawnZombieUnits(total, wn),
          };
        } else {
          s.wave = { ...s.wave, nextWaveCountdown: newCD };
        }
      } else {
        // Active wave combat
        const { traps, watchtower, barricade } = s.upgrades;
        const defenseDmg = (traps.damage + watchtower.damage) * delta;
        const dmgPerZombie = s.wave.zombieHp;
        const killed = Math.min(s.wave.zombiesAlive, Math.floor(defenseDmg / dmgPerZombie));
        const newAlive = s.wave.zombiesAlive - killed;

        s.stats = { ...s.stats, zombiesKilled: s.stats.zombiesKilled + killed };

        // Remove killed units from visual list
        let newUnits = s.wave.activeUnits;
        if (killed > 0) {
          newUnits = newUnits.slice(0, Math.max(0, newUnits.length - killed));
        }

        // Zombies attack barricade
        const zombieDmg = s.wave.zombieAttack * s.wave.zombiesAlive * delta;
        const newBarHp = Math.max(0, barricade.hp - zombieDmg);

        let newCabinHp = s.cabin.hp;
        if (newBarHp === 0) {
          newCabinHp = Math.max(0, s.cabin.hp - zombieDmg * 0.4);
        }

        if (newAlive <= 0) {
          s.wave = {
            ...s.wave,
            isActive: false,
            zombiesAlive: 0,
            activeUnits: [],
            nextWaveCountdown: WAVE_INTERVAL_SEC,
          };
          s.stats = { ...s.stats, wavesSurvived: s.stats.wavesSurvived + 1 };
          // Wave reward
          s.resources = { ...s.resources, gold: s.resources.gold + 50 * s.wave.number };
        } else {
          s.wave = { ...s.wave, zombiesAlive: newAlive, activeUnits: newUnits };
        }

        s.upgrades = { ...s.upgrades, barricade: { ...barricade, hp: newBarHp } };
        s.cabin = { ...s.cabin, hp: newCabinHp };
        if (newCabinHp <= 0) s.gameOver = true;
      }

      s.lastTick = Date.now();
      return s;
    }

    case 'GRANT_REWARD': {
      const { reward } = action.payload;
      switch (reward) {
        case 'resources':
          return {
            ...state,
            resources: {
              ...state.resources,
              gold: state.resources.gold + 500,
              wood: state.resources.wood + 100,
            },
          };
        case 'gold_boost':
          return { ...state, resources: { ...state.resources, gold: state.resources.gold + 1000 } };
        case 'heal':
          return { ...state, cabin: { ...state.cabin, hp: state.cabin.maxHp }, gameOver: false };
        case 'repair_barricade':
          return {
            ...state,
            upgrades: {
              ...state.upgrades,
              barricade: { ...state.upgrades.barricade, hp: state.upgrades.barricade.maxHp },
            },
          };
        case 'wave_skip':
          return {
            ...state,
            wave: { ...state.wave, isActive: false, zombiesAlive: 0, activeUnits: [], nextWaveCountdown: WAVE_INTERVAL_SEC },
          };
        default:
          return state;
      }
    }

    case 'RESET_GAME':
      return buildInitialState();

    default:
      return state;
  }
}
