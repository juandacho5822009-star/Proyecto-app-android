import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload(): void {
    const W = GC.W, H = GC.H;

    // Dark background
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a0a2e);

    // Title
    this.add.text(W / 2, H / 2 - 80, '🧟', { fontSize: '60px' }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 10, 'ZOMBIE CABAÑA', {
      fontSize: '22px', fontStyle: 'bold', color: '#4ade80',
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 + 18, 'CONQUEST', {
      fontSize: '16px', color: '#fbbf24',
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    // Progress bar container
    this.add.rectangle(W / 2, H / 2 + 70, 220, 16, 0x374151, 1).setOrigin(0.5);
    const bar = this.add.rectangle(W / 2 - 108, H / 2 + 70, 4, 12, 0x4ade80).setOrigin(0, 0.5);
    const txt = this.add.text(W / 2, H / 2 + 92, 'Cargando...', {
      fontSize: '11px', color: '#6b7280',
    }).setOrigin(0.5);

    this.load.on('progress', (v: number) => {
      bar.width = 212 * v;
      txt.setText(`${Math.round(v * 100)}%`);
    });

    // ── Load assets ────────────────────────────────────────────────
    this.load.spritesheet('zombie_walk', 'assets/sprites/zombie_walk.png', {
      frameWidth:  GC.SPRITE_FRAME_W,
      frameHeight: GC.SPRITE_FRAME_H,
    });
    this.load.image('bg_sky',   'assets/sprites/bg_sky.png');
    this.load.image('tree',     'assets/sprites/tree.png');
    this.load.image('clearing', 'assets/sprites/clearing.png');
    this.load.image('cabin',    'assets/sprites/cabin.png');
  }

  create(): void {
    // Register walk animation (8 frames, 4×2 grid)
    this.anims.create({
      key: 'zombie_walk',
      frames: this.anims.generateFrameNumbers('zombie_walk', { start: 0, end: 7 }),
      frameRate: GC.SPRITE_ANIM_FPS,
      repeat: -1,
    });

    // Start game
    this.scene.start('GameScene');
    this.scene.launch('UIScene');   // UIScene runs in parallel on top
  }
}
