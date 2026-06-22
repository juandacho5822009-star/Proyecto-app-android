export const GC = {
  // Canvas
  W: 390, H: 844,

  // Cabin click reward
  CLICK_GOLD: 5, CLICK_WOOD: 3, CLICK_FOOD: 1, CLICK_SCRAP: 1,

  // Passive gold/sec (base)
  GOLD_PER_SEC: 2,

  // Cabin
  CABIN_X: 195, CABIN_Y: 590,
  CABIN_MAX_HP: 200,

  // Barricade
  BARRICADE_BASE_HP: 100,
  BARRICADE_HP_MULT: 1.6,
  BARRICADE_COST: { gold: 0, wood: 30, scrap: 10 },

  // Upgrades base costs
  TRAPS_BASE_COST:      { gold: 0,   wood: 20, scrap: 20 },
  WATCHTOWER_BASE_COST: { gold: 100, wood: 40, scrap: 30 },
  SAWMILL_BASE_COST:    { gold: 200, wood: 50, scrap: 10 },
  FARM_BASE_COST:       { gold: 100, wood: 20, scrap: 10 },
  WORKSHOP_BASE_COST:   { gold: 150, wood: 30, scrap: 0  },

  UPGRADE_COST_MULT: 1.8,
  BARRICADE_HP_SCALE: 1.6,
  WEAPON_DMG_SCALE: 1.4,
  PRODUCER_RATE_SCALE: 1.5,

  // Waves
  WAVE_INTERVAL: 60,       // seconds
  WAVE_BASE_COUNT: 5,
  WAVE_BASE_HP: 50,
  WAVE_BASE_ATK: 8,
  WAVE_SCALE: 1.3,
  MAX_SCREEN_ZOMBIES: 6,   // max simultaneous visible zombies

  // Zombie movement
  ZOMBIE_SPEED: 55,        // px/sec
  ZOMBIE_Y_BASE: 555,
  ZOMBIE_Y_SPREAD: 40,     // vertical scatter per lane
  LEFT_SPAWN_X: -90,
  RIGHT_SPAWN_X: 480,
  BARRICADE_STOP_X_L: 145, // x where zombies stop (left side)
  BARRICADE_STOP_X_R: 245, // x where zombies stop (right side)

  // Zombie sprite sheet (zombie_walk.png: 1408x768, 4 cols × 2 rows)
  SPRITE_FRAME_W: 352,
  SPRITE_FRAME_H: 384,
  SPRITE_ANIM_FPS: 8,
  ZOMBIE_SCALE: 0.22,      // 352 * 0.22 ≈ 77px display width

  // Shop
  UPGRADE_HAMMER_COST: 10000,
} as const;

export type CostMap = { gold: number; wood: number; scrap: number };

export function scaleCost(base: CostMap, mult: number, level: number): CostMap {
  const f = Math.pow(mult, level - 1);
  return {
    gold:  Math.floor(base.gold  * f),
    wood:  Math.floor(base.wood  * f),
    scrap: Math.floor(base.scrap * f),
  };
}
