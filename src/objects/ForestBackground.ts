import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

export class ForestBackground {
  constructor(scene: Phaser.Scene) {
    const W = GC.W, H = GC.H;

    // ── Sky (deep atmospheric purple/indigo) ─────────────────────────
    const sky = scene.add.graphics().setDepth(0);
    sky.fillStyle(0x0a0618); sky.fillRect(0, 0, W, H * 0.30);
    sky.fillStyle(0x130a28); sky.fillRect(0, H * 0.10, W, H * 0.18);
    sky.fillStyle(0x1e1035); sky.fillRect(0, H * 0.22, W, H * 0.14);
    sky.fillStyle(0x291545); sky.fillRect(0, H * 0.32, W, H * 0.10);
    sky.fillStyle(0x0a140a); sky.fillRect(0, H * 0.38, W, H * 0.12);

    // Stars (subtle, few)
    sky.fillStyle(0xffffff, 0.6);
    [[40,25],[90,14],[160,32],[230,10],[295,24],[345,18],[60,48],[200,44],[310,50]].forEach(([x,y]) => {
      sky.fillCircle(x, y, Phaser.Math.Between(7,12)/10);
    });
    // Moon
    sky.fillStyle(0xd8c87a, 0.18);
    sky.fillCircle(320, 55, 28);
    sky.fillStyle(0xe8d88a, 0.12);
    sky.fillCircle(320, 55, 22);

    // ── Ground base ───────────────────────────────────────────────────
    const g = scene.add.graphics().setDepth(1);
    g.fillStyle(0x1a2a0c); g.fillRect(0, H * 0.48, W, H * 0.52);
    g.fillStyle(0x213610); g.fillRect(0, H * 0.48, W, H * 0.07);

    // ── Clearing (dark dirt + grass) ──────────────────────────────────
    g.fillStyle(0x2d4a15); g.fillEllipse(W/2, H*0.72, W*0.85, H*0.26);
    g.fillStyle(0x3a5e1a); g.fillEllipse(W/2, H*0.70, W*0.62, H*0.16);
    g.fillStyle(0x3f6620); g.fillEllipse(W/2, H*0.68, W*0.42, H*0.10);
    // Dirt path from bottom to cabin
    g.fillStyle(0x2a1e0c, 0.55);
    g.fillEllipse(W/2, H*0.88, 80, 30);
    g.fillRect(W/2 - 20, H*0.74, 40, H*0.14);

    // ── Back trees (very dark, distant) ──────────────────────────────
    const bg = scene.add.graphics().setDepth(2);
    // Left back trees
    for (let i = 0; i < 8; i++) {
      this.drawTree(bg, -10 + i * 28, H * 0.44, 28, 80, 0x081008, 0x0e1a0e);
    }
    // Right back trees
    for (let i = 0; i < 8; i++) {
      this.drawTree(bg, W - 210 + i * 28, H * 0.44, 28, 80, 0x081008, 0x0e1a0e);
    }
    // Center back
    for (let i = 0; i < 5; i++) {
      this.drawTree(bg, 70 + i * 50, H * 0.41, 26, 72, 0x060e06, 0x0c160c);
    }
    for (let i = 0; i < 5; i++) {
      this.drawTree(bg, W - 320 + i * 50, H * 0.41, 26, 72, 0x060e06, 0x0c160c);
    }

    // ── Mid trees ────────────────────────────────────────────────────
    const mt = scene.add.graphics().setDepth(3);
    // Left cluster
    this.drawTree(mt,   0, H*0.58, 58, 155, 0x0f2010, 0x182e15);
    this.drawTree(mt,  30, H*0.55, 66, 170, 0x0d1e0e, 0x152a12);
    this.drawTree(mt,  65, H*0.57, 56, 148, 0x111f12, 0x1a2e18);
    this.drawTree(mt,  96, H*0.53, 62, 162, 0x0e1d0f, 0x162c14);
    this.drawTree(mt, 124, H*0.56, 50, 138, 0x0f2010, 0x183015);
    this.drawTree(mt, 148, H*0.59, 46, 124, 0x0c1c0d, 0x132814);
    // Right cluster
    this.drawTree(mt, W-56,  H*0.58, 58, 155, 0x0f2010, 0x182e15);
    this.drawTree(mt, W-96,  H*0.55, 66, 170, 0x0d1e0e, 0x152a12);
    this.drawTree(mt, W-128, H*0.57, 56, 148, 0x111f12, 0x1a2e18);
    this.drawTree(mt, W-158, H*0.53, 62, 162, 0x0e1d0f, 0x162c14);
    this.drawTree(mt, W-182, H*0.56, 50, 138, 0x0f2010, 0x183015);
    this.drawTree(mt, W-206, H*0.59, 46, 124, 0x0c1c0d, 0x132814);

    // ── Fog / mist at tree bases ──────────────────────────────────────
    const fog = scene.add.graphics().setDepth(4);
    fog.fillStyle(0x8ab0a8, 0.06); fog.fillRect(0, H*0.50, W, H*0.12);
    fog.fillStyle(0x9ac0b8, 0.04); fog.fillRect(0, H*0.52, W*0.35, H*0.08);
    fog.fillStyle(0x9ac0b8, 0.04); fog.fillRect(W*0.65, H*0.52, W*0.35, H*0.08);

    // ── Front trees (flanking clearing, darkest) ─────────────────────
    const ft = scene.add.graphics().setDepth(5);
    // Far left / far right edge
    this.drawTree(ft, -20,   H*0.65, 70, 175, 0x081408, 0x102010);
    this.drawTree(ft,  16,   H*0.62, 60, 155, 0x091508, 0x112212);
    this.drawTree(ft, W-50,  H*0.65, 70, 175, 0x081408, 0x102010);
    this.drawTree(ft, W-84,  H*0.62, 60, 155, 0x091508, 0x112212);

    // ── Torches ──────────────────────────────────────────────────────
    this.drawTorch(scene, W/2 - 72, H*0.765);
    this.drawTorch(scene, W/2 + 72, H*0.765);

    // ── Edge vignette (darken corners) ───────────────────────────────
    const vig = scene.add.graphics().setDepth(6);
    vig.fillStyle(0x000000, 0.30); vig.fillRect(0, 0, 55, H);
    vig.fillStyle(0x000000, 0.30); vig.fillRect(W-55, 0, 55, H);
    vig.fillStyle(0x000000, 0.20); vig.fillRect(0, 0, W, 80);
  }

  private drawTree(
    g: Phaser.GameObjects.Graphics,
    x: number, y: number, w: number, h: number,
    dark: number, light: number,
  ): void {
    const cx = x + w / 2;
    // Trunk
    g.fillStyle(0x2a1506);
    g.fillRect(cx - 4, y, 8, 20);
    // Three overlapping tiers (dark base, slightly lighter front)
    g.fillStyle(dark);
    g.fillTriangle(cx - w/2, y, cx + w/2, y, cx, y - h * 0.45);
    g.fillStyle(light);
    g.fillTriangle(cx - w*0.36, y - h*0.30, cx + w*0.36, y - h*0.30, cx, y - h*0.72);
    g.fillStyle(dark);
    g.fillTriangle(cx - w*0.22, y - h*0.56, cx + w*0.22, y - h*0.56, cx, y - h*0.98);
    // Subtle highlight on top tier left edge
    g.fillStyle(0xffffff, 0.03);
    g.fillTriangle(cx - w*0.10, y - h*0.56, cx, y - h*0.56, cx, y - h*0.98);
  }

  private drawTorch(scene: Phaser.Scene, x: number, y: number): void {
    const g = scene.add.graphics().setDepth(7);
    // Stick
    g.fillStyle(0x3a2208);
    g.fillRect(x - 3, y - 26, 6, 26);
    g.fillStyle(0x5a3410);
    g.fillRect(x - 5, y - 30, 10, 6);
    // Glow halo
    g.fillStyle(0xff8800, 0.06); g.fillCircle(x, y - 32, 22);
    g.fillStyle(0xff8800, 0.10); g.fillCircle(x, y - 32, 14);
    // Flame (drawn separately for tween)
    const flame = scene.add.graphics().setDepth(8);
    flame.fillStyle(0xff4400); flame.fillTriangle(x-5, y-26, x+5, y-26, x, y-46);
    flame.fillStyle(0xff8800); flame.fillTriangle(x-4, y-28, x+4, y-28, x, y-44);
    flame.fillStyle(0xffcc00); flame.fillCircle(x, y-36, 4);
    flame.fillStyle(0xffffff, 0.5); flame.fillCircle(x, y-38, 2);
    // Ground light pool
    g.fillStyle(0xff8800, 0.07); g.fillEllipse(x, y + 6, 36, 10);

    scene.tweens.add({
      targets: flame,
      scaleX: { from: 0.88, to: 1.08 },
      scaleY: { from: 0.92, to: 1.06 },
      alpha:  { from: 0.80, to: 1.00 },
      x:      { from: x - 1, to: x + 1 },
      duration: Phaser.Math.Between(180, 320),
      yoyo: true, repeat: -1, ease: 'Sine.InOut',
    });
  }
}
