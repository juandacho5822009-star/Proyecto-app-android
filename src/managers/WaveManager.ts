import Phaser from 'phaser';
import { GC } from '../data/GameConfig';
import { EventBus, EV } from '../utils/EventBus';
import type { GameState } from '../data/GameState';
import type { ZombieObject } from '../objects/ZombieObject';

export class WaveManager {
  private activeZombies: ZombieObject[] = [];

  constructor(
    private scene: Phaser.Scene,
    private state: GameState,
  ) {}

  tick(dt: number): void {
    const w = this.state.wave;

    if (!w.active) {
      w.countdown -= dt;
      if (w.countdown <= 0) this.startWave();
      return;
    }

    // Defense damages zombies
    const u = this.state.upgrades;
    const dps = ((u.traps.damage ?? 0) + (u.watchtower.damage ?? 0));
    const killed = Math.floor(dps * dt / w.zombieHp);
    if (killed > 0) {
      const toKill = Math.min(killed, w.zombiesAlive);
      w.zombiesAlive -= toKill;
      this.state.stats.kills += toKill;
      // Remove visual zombies from front of queue
      for (let i = 0; i < toKill; i++) this.killFrontZombie();
    }

    // Zombies damage barricade
    const barricade = this.state.upgrades.barricade;
    const zombieDmg = w.zombieAtk * this.activeZombies.length * dt;
    barricade.hp = Math.max(0, (barricade.hp ?? 0) - zombieDmg);

    // If barricade down, cabin takes damage
    if ((barricade.hp ?? 0) <= 0) {
      this.state.cabinHp = Math.max(0, this.state.cabinHp - zombieDmg * 0.4);
      if (this.state.cabinHp <= 0) {
        this.state.over = true;
        return;
      }
    }

    // Wave cleared
    if (w.zombiesAlive <= 0) {
      this.clearWave();
    }
  }

  private startWave(): void {
    const w = this.state.wave;
    w.number++;
    const scale = Math.pow(GC.WAVE_SCALE, w.number - 1);
    w.zombiesTotal = Math.ceil(GC.WAVE_BASE_COUNT * scale);
    w.zombiesAlive = w.zombiesTotal;
    w.zombieHp     = Math.ceil(GC.WAVE_BASE_HP  * scale);
    w.zombieAtk    = Math.ceil(GC.WAVE_BASE_ATK * scale);
    w.active       = true;
    w.countdown    = GC.WAVE_INTERVAL;

    EventBus.emit(EV.WAVE_STARTED, { number: w.number, total: w.zombiesTotal });

    // Spawn visual zombies
    this.spawnVisualZombies(Math.min(w.zombiesTotal, GC.MAX_SCREEN_ZOMBIES));
  }

  clearWave(): void {
    const w = this.state.wave;
    w.active       = false;
    w.zombiesAlive = 0;
    w.countdown    = GC.WAVE_INTERVAL;

    this.state.stats.waves++;
    // Gold reward
    this.state.resources.gold += 50 * w.number;

    this.activeZombies.forEach(z => z.die());
    this.activeZombies = [];

    EventBus.emit(EV.WAVE_COMPLETED, w.number);
  }

  private spawnVisualZombies(count: number): void {
    // Lazy import to avoid circular deps
    import('../objects/ZombieObject').then(({ ZombieObject }) => {
      for (let i = 0; i < count; i++) {
        const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
        const lane = i % 5;
        const y = GC.ZOMBIE_Y_BASE + (lane - 2) * (GC.ZOMBIE_Y_SPREAD / 4);
        const spawnX = side === 'left' ? GC.LEFT_SPAWN_X : GC.RIGHT_SPAWN_X;
        const zombie = new ZombieObject(this.scene, spawnX, y, side);
        this.activeZombies.push(zombie);
        // Stagger spawn
        zombie.setAlpha(0);
        this.scene.time.delayedCall(i * 400, () => {
          this.scene.tweens.add({ targets: zombie, alpha: 1, duration: 200 });
          zombie.startWalking();
        });
      }
    });
  }

  private killFrontZombie(): void {
    const z = this.activeZombies.shift();
    if (z) z.die();
  }

  getActiveZombies(): ZombieObject[] { return this.activeZombies; }
}
