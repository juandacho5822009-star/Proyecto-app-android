import { GC, scaleCost } from '../data/GameConfig';
import type { CostMap } from '../data/GameConfig';
import { canAfford } from '../data/GameState';
import type { GameState } from '../data/GameState';

export type UpgradeKey = 'barricade' | 'traps' | 'watchtower' | 'sawmill' | 'farm' | 'workshop';

export class ResourceManager {
  constructor(private state: GameState) {}

  tick(dt: number): void {
    const r = this.state.resources;
    const u = this.state.upgrades;

    r.gold  += (GC.GOLD_PER_SEC + u.sawmill.level * 0.5) * dt;
    r.wood  += (u.sawmill.perSec  ?? 0) * dt;
    r.food  += (u.farm.perSec     ?? 0) * dt;
    r.scrap += (u.workshop.perSec ?? 0) * dt;
  }

  addClickReward(): { gold: number; wood: number; food: number; scrap: number } {
    const r = this.state.resources;
    r.gold  += GC.CLICK_GOLD;
    r.wood  += GC.CLICK_WOOD;
    r.food  += GC.CLICK_FOOD;
    r.scrap += GC.CLICK_SCRAP;
    this.state.stats.clicks++;
    return { gold: GC.CLICK_GOLD, wood: GC.CLICK_WOOD, food: GC.CLICK_FOOD, scrap: GC.CLICK_SCRAP };
  }

  tryUpgrade(key: string): boolean {
    const u = this.state.upgrades[key as UpgradeKey];
    if (!u) return false;
    const r = this.state.resources;

    if (!canAfford(r, u.cost)) return false;

    r.gold  -= u.cost.gold;
    r.wood  -= u.cost.wood;
    r.scrap -= u.cost.scrap;

    u.level++;

    const baseCosts: Record<UpgradeKey, CostMap> = {
      barricade:  GC.BARRICADE_COST,
      traps:      GC.TRAPS_BASE_COST,
      watchtower: GC.WATCHTOWER_BASE_COST,
      sawmill:    GC.SAWMILL_BASE_COST,
      farm:       GC.FARM_BASE_COST,
      workshop:   GC.WORKSHOP_BASE_COST,
    };

    u.cost = scaleCost(baseCosts[key as UpgradeKey], GC.UPGRADE_COST_MULT, u.level);

    switch (key as UpgradeKey) {
      case 'barricade': {
        const newMax = Math.floor(GC.BARRICADE_BASE_HP * Math.pow(GC.BARRICADE_HP_SCALE, u.level - 1));
        u.maxHp = newMax;
        u.hp    = newMax;
        break;
      }
      case 'traps':
        u.damage = Math.floor(5 * Math.pow(GC.WEAPON_DMG_SCALE, u.level - 1));
        break;
      case 'watchtower':
        u.damage = Math.floor(3 * Math.pow(GC.WEAPON_DMG_SCALE, u.level - 1));
        break;
      case 'sawmill':
        u.perSec = parseFloat((1 * Math.pow(GC.PRODUCER_RATE_SCALE, u.level - 1)).toFixed(2));
        break;
      case 'farm':
        u.perSec = parseFloat((0.5 * Math.pow(GC.PRODUCER_RATE_SCALE, u.level - 1)).toFixed(2));
        break;
      case 'workshop':
        u.perSec = parseFloat((0.3 * Math.pow(GC.PRODUCER_RATE_SCALE, u.level - 1)).toFixed(2));
        break;
    }

    return true;
  }

  grantAdReward(type: string): void {
    const r = this.state.resources;
    switch (type) {
      case 'gold':      r.gold += 1000; break;
      case 'hp':        this.state.cabinHp = GC.CABIN_MAX_HP; this.state.over = false; break;
      case 'resources': r.gold += 200; r.wood += 200; r.food += 200; r.scrap += 200; break;
      case 'repair':    this.state.upgrades.barricade.hp = this.state.upgrades.barricade.maxHp ?? GC.BARRICADE_BASE_HP; break;
    }
  }
}
