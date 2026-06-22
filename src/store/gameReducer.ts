import type { GameState, GameAction, Tile, Resources } from '../types/game';
import {
  CLICK_POWER, CABIN_BASE, BARRICADE_BASE, TRAPS_BASE, WATCHTOWER_BASE,
  SAWMILL_BASE, FARM_BASE, WORKSHOP_BASE, MAP_SIZE,
  UPGRADE_COST_MULT, BARRICADE_HP_MULT, PRODUCER_RATE_MULT, WEAPON_DAMAGE_MULT,
  WAVE_BASE_ZOMBIES, WAVE_BASE_HP, WAVE_BASE_ATTACK, WAVE_SCALE, WAVE_INTERVAL_SEC,
  TILE_BONUS, TILE_COSTS, TILE_ZOMBIES, getTileDifficulty,
  canAfford, subtractResources, addResources, scaleResources,
} from '../constants/gameConfig';

function buildInitialTerritory(): Tile[][] {
  const center = Math.floor(MAP_SIZE / 2);
  return Array.from({ length: MAP_SIZE }, (_, row) =>
    Array.from({ length: MAP_SIZE }, (_, col) => {
      const diff = getTileDifficulty(row, col);
      const isCenter = row === center && col === center;
      return {
        row,
        col,
        owned: isCenter,
        zombieCount: isCenter ? 0 : TILE_ZOMBIES[diff],
        bonusPerSec: isCenter ? TILE_BONUS : { wood: 0, food: 0, scrap: 0 },
      };
    })
  );
}

export function buildInitialState(): GameState {
  return {
    resources: { wood: 50, food: 30, scrap: 20 },
    cabin: { ...CABIN_BASE },
    upgrades: {
      barricade: { ...BARRICADE_BASE },
      traps: { ...TRAPS_BASE },
      watchtower: { ...WATCHTOWER_BASE },
      sawmill: { ...SAWMILL_BASE },
      farm: { ...FARM_BASE },
      workshop: { ...WORKSHOP_BASE },
    },
    territory: buildInitialTerritory(),
    wave: {
      number: 0,
      isActive: false,
      zombiesTotal: 0,
      zombiesAlive: 0,
      zombieHp: 0,
      zombieAttack: 0,
      nextWaveCountdown: WAVE_INTERVAL_SEC,
    },
    stats: { zombiesKilled: 0, totalClicks: 0, wavesSurvived: 0 },
    gameOver: false,
    lastTick: Date.now(),
    clickFeedback: { active: false, x: 0, y: 0, value: '' },
  };
}

function getNextUpgradeCost(base: Resources, level: number): Resources {
  return scaleResources(base, UPGRADE_COST_MULT, level);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'CLICK_CABIN': {
      if (state.gameOver) return state;
      const newResources = addResources(state.resources, CLICK_POWER);
      return {
        ...state,
        resources: newResources,
        stats: { ...state.stats, totalClicks: state.stats.totalClicks + 1 },
        clickFeedback: {
          active: true,
          x: action.payload.x,
          y: action.payload.y,
          value: `+${CLICK_POWER.wood}🪵 +${CLICK_POWER.food}🍖 +${CLICK_POWER.scrap}⚙️`,
        },
      };
    }

    case 'CLEAR_CLICK_FEEDBACK':
      return { ...state, clickFeedback: { ...state.clickFeedback, active: false } };

    case 'UPGRADE_BARRICADE': {
      const { barricade } = state.upgrades;
      if (!canAfford(state.resources, barricade.upgradeCost)) return state;
      const newLevel = barricade.level + 1;
      const newMaxHp = Math.floor(BARRICADE_BASE.maxHp * Math.pow(BARRICADE_HP_MULT, newLevel - 1));
      return {
        ...state,
        resources: subtractResources(state.resources, barricade.upgradeCost),
        upgrades: {
          ...state.upgrades,
          barricade: {
            level: newLevel,
            hp: newMaxHp,
            maxHp: newMaxHp,
            upgradeCost: getNextUpgradeCost(BARRICADE_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'UPGRADE_TRAPS': {
      const { traps } = state.upgrades;
      if (!canAfford(state.resources, traps.upgradeCost)) return state;
      const newLevel = traps.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, traps.upgradeCost),
        upgrades: {
          ...state.upgrades,
          traps: {
            level: newLevel,
            damage: Math.floor(TRAPS_BASE.damage * Math.pow(WEAPON_DAMAGE_MULT, newLevel - 1)),
            upgradeCost: getNextUpgradeCost(TRAPS_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'UPGRADE_WATCHTOWER': {
      const { watchtower } = state.upgrades;
      if (!canAfford(state.resources, watchtower.upgradeCost)) return state;
      const newLevel = watchtower.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, watchtower.upgradeCost),
        upgrades: {
          ...state.upgrades,
          watchtower: {
            level: newLevel,
            damage: Math.floor(WATCHTOWER_BASE.damage * Math.pow(WEAPON_DAMAGE_MULT, newLevel - 1)),
            upgradeCost: getNextUpgradeCost(WATCHTOWER_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'UPGRADE_SAWMILL': {
      const { sawmill } = state.upgrades;
      if (!canAfford(state.resources, sawmill.upgradeCost)) return state;
      const newLevel = sawmill.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, sawmill.upgradeCost),
        upgrades: {
          ...state.upgrades,
          sawmill: {
            level: newLevel,
            perSecond: parseFloat((SAWMILL_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, newLevel - 1)).toFixed(2)),
            upgradeCost: getNextUpgradeCost(SAWMILL_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'UPGRADE_FARM': {
      const { farm } = state.upgrades;
      if (!canAfford(state.resources, farm.upgradeCost)) return state;
      const newLevel = farm.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, farm.upgradeCost),
        upgrades: {
          ...state.upgrades,
          farm: {
            level: newLevel,
            perSecond: parseFloat((FARM_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, newLevel - 1)).toFixed(2)),
            upgradeCost: getNextUpgradeCost(FARM_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'UPGRADE_WORKSHOP': {
      const { workshop } = state.upgrades;
      if (!canAfford(state.resources, workshop.upgradeCost)) return state;
      const newLevel = workshop.level + 1;
      return {
        ...state,
        resources: subtractResources(state.resources, workshop.upgradeCost),
        upgrades: {
          ...state.upgrades,
          workshop: {
            level: newLevel,
            perSecond: parseFloat((WORKSHOP_BASE.perSecond * Math.pow(PRODUCER_RATE_MULT, newLevel - 1)).toFixed(2)),
            upgradeCost: getNextUpgradeCost(WORKSHOP_BASE.upgradeCost, newLevel),
          },
        },
      };
    }

    case 'ATTACK_TILE': {
      const { row, col } = action.payload;
      const tile = state.territory[row][col];
      if (tile.owned) return state;

      // Must be adjacent to an owned tile
      const isAdjacent = state.territory.some((tRow) =>
        tRow.some((t) => t.owned && Math.abs(t.row - row) + Math.abs(t.col - col) === 1)
      );
      if (!isAdjacent) return state;

      const diff = getTileDifficulty(row, col);
      const cost = TILE_COSTS[diff];
      if (!canAfford(state.resources, cost)) return state;

      const newTerritory = state.territory.map((tRow) =>
        tRow.map((t) =>
          t.row === row && t.col === col
            ? { ...t, owned: true, zombieCount: 0, bonusPerSec: TILE_BONUS }
            : t
        )
      );

      return {
        ...state,
        resources: subtractResources(state.resources, cost),
        territory: newTerritory,
        stats: { ...state.stats, zombiesKilled: state.stats.zombiesKilled + tile.zombieCount },
      };
    }

    case 'TICK': {
      if (state.gameOver) return state;
      const { delta } = action.payload; // seconds
      let newState = { ...state };

      // --- Passive resource generation ---
      const { sawmill, farm, workshop } = state.upgrades;
      let passiveGain: Resources = {
        wood: sawmill.perSecond * delta,
        food: farm.perSecond * delta,
        scrap: workshop.perSecond * delta,
      };

      // Territory bonuses
      state.territory.flat().forEach((tile) => {
        if (tile.owned) {
          passiveGain = addResources(passiveGain, {
            wood: tile.bonusPerSec.wood * delta,
            food: tile.bonusPerSec.food * delta,
            scrap: tile.bonusPerSec.scrap * delta,
          });
        }
      });

      newState.resources = {
        wood: state.resources.wood + passiveGain.wood,
        food: state.resources.food + passiveGain.food,
        scrap: state.resources.scrap + passiveGain.scrap,
      };

      // --- Wave logic ---
      if (!state.wave.isActive) {
        const newCountdown = state.wave.nextWaveCountdown - delta;
        if (newCountdown <= 0) {
          // Spawn new wave
          const waveNum = state.wave.number + 1;
          const scale = Math.pow(WAVE_SCALE, waveNum - 1);
          newState.wave = {
            number: waveNum,
            isActive: true,
            zombiesTotal: Math.ceil(WAVE_BASE_ZOMBIES * scale),
            zombiesAlive: Math.ceil(WAVE_BASE_ZOMBIES * scale),
            zombieHp: Math.ceil(WAVE_BASE_HP * scale),
            zombieAttack: Math.ceil(WAVE_BASE_ATTACK * scale),
            nextWaveCountdown: WAVE_INTERVAL_SEC,
          };
        } else {
          newState.wave = { ...state.wave, nextWaveCountdown: newCountdown };
        }
      } else {
        // Active wave: combat tick
        const { traps, watchtower, barricade } = state.upgrades;
        const defenseDmg = (traps.damage + watchtower.damage) * delta;

        // Calculate zombies killed this tick (by total HP dealt)
        const dmgPerZombie = newState.wave.zombieHp;
        const zombiesKilledThisTick = Math.min(
          newState.wave.zombiesAlive,
          Math.floor(defenseDmg / dmgPerZombie)
        );

        const newZombiesAlive = newState.wave.zombiesAlive - zombiesKilledThisTick;
        newState.stats = {
          ...newState.stats,
          zombiesKilled: newState.stats.zombiesKilled + zombiesKilledThisTick,
        };

        // Zombies attack barricade
        const zombiesDmgToBarricade = newState.wave.zombieAttack * newState.wave.zombiesAlive * delta;
        const newBarricadeHp = Math.max(0, barricade.hp - zombiesDmgToBarricade);

        let newCabinHp = newState.cabin.hp;
        // If barricade is down, cabin takes damage
        if (newBarricadeHp === 0) {
          const excessDmg = (zombiesDmgToBarricade - barricade.hp) * 0.5;
          newCabinHp = Math.max(0, newState.cabin.hp - excessDmg);
        }

        if (newZombiesAlive <= 0) {
          // Wave cleared
          newState.wave = {
            ...newState.wave,
            isActive: false,
            zombiesAlive: 0,
            nextWaveCountdown: WAVE_INTERVAL_SEC,
          };
          newState.stats = { ...newState.stats, wavesSurvived: newState.stats.wavesSurvived + 1 };
        } else {
          newState.wave = { ...newState.wave, zombiesAlive: newZombiesAlive };
        }

        newState.upgrades = {
          ...newState.upgrades,
          barricade: { ...barricade, hp: newBarricadeHp },
        };
        newState.cabin = { ...newState.cabin, hp: newCabinHp };

        if (newCabinHp <= 0) {
          newState.gameOver = true;
        }
      }

      newState.lastTick = Date.now();
      return newState;
    }

    case 'GRANT_REWARD': {
      const { reward } = action.payload;
      switch (reward) {
        case 'resources':
          return {
            ...state,
            resources: {
              wood: state.resources.wood + 100,
              food: state.resources.food + 50,
              scrap: state.resources.scrap + 50,
            },
          };
        case 'heal':
          return {
            ...state,
            cabin: { ...state.cabin, hp: state.cabin.maxHp },
            gameOver: false,
          };
        case 'repair_barricade':
          return {
            ...state,
            upgrades: {
              ...state.upgrades,
              barricade: {
                ...state.upgrades.barricade,
                hp: state.upgrades.barricade.maxHp,
              },
            },
          };
        case 'wave_skip':
          return {
            ...state,
            wave: {
              ...state.wave,
              isActive: false,
              zombiesAlive: 0,
              nextWaveCountdown: WAVE_INTERVAL_SEC,
            },
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
