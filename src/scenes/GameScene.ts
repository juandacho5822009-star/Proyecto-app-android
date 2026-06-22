import Phaser from 'phaser';
import { GC } from '../data/GameConfig';
import { createInitialState, GameState } from '../data/GameState';
import { EventBus, EV } from '../utils/EventBus';
import { SaveManager } from '../utils/SaveManager';
import { ResourceManager } from '../managers/ResourceManager';
import { WaveManager } from '../managers/WaveManager';
import { ForestBackground } from '../objects/ForestBackground';
import { CabinObject } from '../objects/CabinObject';
import { FortificationObject } from '../objects/FortificationObject';
import { FloatingTextPool } from '../objects/FloatingText';

export class GameScene extends Phaser.Scene {
  state!: GameState;
  res!: ResourceManager;
  wave!: WaveManager;
  cabin!: CabinObject;
  fort!: FortificationObject;
  floatText!: FloatingTextPool;

  constructor() { super({ key: 'GameScene' }); }

  create(): void {
    this.state = SaveManager.load() ?? createInitialState();

    // Background
    new ForestBackground(this);

    // Game objects
    this.cabin    = new CabinObject(this);
    this.fort     = new FortificationObject(this);
    this.floatText = new FloatingTextPool(this);

    // Managers
    this.res  = new ResourceManager(this.state);
    this.wave = new WaveManager(this, this.state);

    // Draw initial fortification state
    this.fort.update(
      this.state.upgrades.barricade.level,
      this.state.upgrades.watchtower.level,
    );

    // Cabin click → resources
    this.cabin.addClickListener((x, y) => {
      const gained = this.res.addClickReward();
      this.cabin.shake();
      this.floatText.spawn(x, y - 40, `+${gained.gold}🪙`, '#fbbf24');
      if (gained.wood  > 0) this.floatText.spawn(x - 30, y - 60, `+${gained.wood}🪵`,  '#86efac');
      if (gained.food  > 0) this.floatText.spawn(x + 30, y - 55, `+${gained.food}🍖`,  '#fb923c');
      if (gained.scrap > 0) this.floatText.spawn(x,      y - 75, `+${gained.scrap}⚙️`, '#a78bfa');
      EventBus.emit(EV.RESOURCES_CHANGED, this.state.resources);
    });

    // EventBus listeners
    EventBus.on(EV.UPGRADE_REQUESTED, (key: string) => {
      if (this.res.tryUpgrade(key)) {
        this.fort.update(
          this.state.upgrades.barricade.level,
          this.state.upgrades.watchtower.level,
        );
        EventBus.emit(EV.RESOURCES_CHANGED, this.state.resources);
        EventBus.emit(EV.UPGRADES_CHANGED,  this.state.upgrades);
        EventBus.emit(EV.WAVE_CHANGED,      this.state.wave);
        SaveManager.save(this.state);
      }
    }, this);

    EventBus.on(EV.AD_REWARD_REQUESTED, (type: string) => {
      this.res.grantAdReward(type);
      EventBus.emit(EV.RESOURCES_CHANGED, this.state.resources);
      SaveManager.save(this.state);
    }, this);

    // Auto-save every 30 s
    this.time.addEvent({
      delay: 30_000,
      loop: true,
      callback: () => SaveManager.save(this.state),
    });

    // Emit initial state so UIScene can paint
    this.time.delayedCall(80, () => {
      EventBus.emit(EV.RESOURCES_CHANGED, this.state.resources);
      EventBus.emit(EV.UPGRADES_CHANGED,  this.state.upgrades);
      EventBus.emit(EV.WAVE_CHANGED,      this.state.wave);
    });
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.res.tick(dt);
    this.wave.tick(dt);

    // Sync UI periodically (every frame is fine for small state)
    EventBus.emit(EV.RESOURCES_CHANGED, this.state.resources);
    EventBus.emit(EV.WAVE_CHANGED, this.state.wave);

    if (this.state.cabinHp <= 0) {
      this.wave.clearWave();
      SaveManager.clear();
      this.scene.stop('UIScene');
      this.scene.start('GameOverScene', { wave: this.state.wave.number });
    }
  }

  shutdown(): void {
    EventBus.off(EV.UPGRADE_REQUESTED, undefined, this);
    EventBus.off(EV.AD_REWARD_REQUESTED, undefined, this);
  }
}
