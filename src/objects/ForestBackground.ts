import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

export class ForestBackground {
  constructor(scene: Phaser.Scene) {
    const W = GC.W, H = GC.H;

    // ── Sky ─────────────────────────────────────────────────────────
    scene.add.image(W / 2, H * 0.27, 'bg_sky')
      .setDepth(0)
      .setDisplaySize(W, H * 0.58);

    // ── Dark ground fill ────────────────────────────────────────────
    const gnd = scene.add.graphics().setDepth(1);
    gnd.fillStyle(0x1a2e0a); gnd.fillRect(0, H * 0.50, W, H * 0.50);
    gnd.fillStyle(0x223810); gnd.fillRect(0, H * 0.50, W, H * 0.05);

    // ── Grass clearing ──────────────────────────────────────────────
    scene.add.image(W / 2, H * 0.735, 'clearing')
      .setDepth(2)
      .setDisplaySize(W * 0.95, H * 0.27);

    // ── Background trees (small, very dark) ─────────────────────────
    const bgTrees = [
      [14,    H * 0.50], [52,   H * 0.47], [90,  H * 0.49], [126, H * 0.51],
      [W-14,  H * 0.50], [W-52, H * 0.47], [W-90, H * 0.49], [W-126, H * 0.51],
    ];
    bgTrees.forEach(([x, y], i) => {
      scene.add.image(x, y, 'tree')
        .setDepth(3)
        .setScale(0.12)
        .setOrigin(0.5, 1)
        .setTint(0x1e2e1e)
        .setFlipX(i >= 4);
    });

    // ── Mid trees ───────────────────────────────────────────────────
    const midLeft = [
      { x: -22, y: H * 0.65, s: 0.19 },
      { x:  22, y: H * 0.62, s: 0.22 },
      { x:  62, y: H * 0.66, s: 0.17 },
      { x: 100, y: H * 0.61, s: 0.21 },
      { x: 136, y: H * 0.64, s: 0.16 },
    ];
    midLeft.forEach(({ x, y, s }) => {
      scene.add.image(x, y, 'tree').setDepth(4).setScale(s).setOrigin(0.5, 1).setTint(0x2e4a2e);
    });
    midLeft.forEach(({ x, y, s }) => {
      scene.add.image(W - x, y, 'tree').setDepth(4).setScale(s).setOrigin(0.5, 1).setTint(0x2e4a2e).setFlipX(true);
    });

    // ── Torches ─────────────────────────────────────────────────────
    this.drawTorch(scene, W / 2 - 72, H * 0.77);
    this.drawTorch(scene, W / 2 + 72, H * 0.77);

    // ── Front trees (largest, flanking sides) ───────────────────────
    scene.add.image(-30,  H * 0.80, 'tree').setDepth(9).setScale(0.27).setOrigin(0.5, 1).setTint(0x3a5a3a);
    scene.add.image(W+30, H * 0.80, 'tree').setDepth(9).setScale(0.27).setOrigin(0.5, 1).setTint(0x3a5a3a).setFlipX(true);

    // ── Edge vignette ────────────────────────────────────────────────
    const vig = scene.add.graphics().setDepth(10);
    vig.fillStyle(0x000000, 0.28); vig.fillRect(0, 0, 50, H);
    vig.fillStyle(0x000000, 0.28); vig.fillRect(W - 50, 0, 50, H);
    vig.fillStyle(0x000000, 0.18); vig.fillRect(0, 0, W, 70);
  }

  private drawTorch(scene: Phaser.Scene, x: number, y: number): void {
    const g = scene.add.graphics().setDepth(7);
    g.fillStyle(0x3a2208); g.fillRect(x - 3, y - 26, 6, 26);
    g.fillStyle(0x5a3410); g.fillRect(x - 5, y - 30, 10, 6);
    g.fillStyle(0xff8800, 0.08); g.fillCircle(x, y - 32, 20);
    g.fillStyle(0xff8800, 0.12); g.fillCircle(x, y - 32, 12);
    g.fillStyle(0xff8800, 0.06); g.fillEllipse(x, y + 6, 34, 10);

    const flame = scene.add.graphics().setDepth(8);
    flame.fillStyle(0xff4400); flame.fillTriangle(x - 5, y - 26, x + 5, y - 26, x, y - 46);
    flame.fillStyle(0xff8800); flame.fillTriangle(x - 4, y - 28, x + 4, y - 28, x, y - 44);
    flame.fillStyle(0xffcc00); flame.fillCircle(x, y - 36, 4);
    flame.fillStyle(0xffffff, 0.5); flame.fillCircle(x, y - 38, 2);

    scene.tweens.add({
      targets: flame,
      scaleX: { from: 0.88, to: 1.10 },
      scaleY: { from: 0.90, to: 1.06 },
      alpha:  { from: 0.80, to: 1.00 },
      x:      { from: x - 1, to: x + 1 },
      duration: Phaser.Math.Between(180, 320),
      yoyo: true, repeat: -1, ease: 'Sine.InOut',
    });
  }
}
