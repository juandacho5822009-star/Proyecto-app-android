import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

/** Draws the entire forest scene using Phaser Graphics API. */
export class ForestBackground {
  constructor(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.setDepth(0);

    const W = GC.W, H = GC.H;

    // ── Sky gradient (simulate with layered rects) ──────────────────
    g.fillStyle(0x1a0a2e); g.fillRect(0, 0, W, H * 0.55);
    g.fillStyle(0x2d1b4e); g.fillRect(0, H * 0.20, W, H * 0.15);
    g.fillStyle(0x1a2e1a); g.fillRect(0, H * 0.40, W, H * 0.15);

    // ── Ground ──────────────────────────────────────────────────────
    g.fillStyle(0x2a4f18); g.fillRect(0, H * 0.54, W, H * 0.46);
    g.fillStyle(0x3a6b20); g.fillRect(0, H * 0.54, W, H * 0.06);

    // ── Clearing ellipse ────────────────────────────────────────────
    g.fillStyle(0x4a8a28);
    g.fillEllipse(W / 2, H * 0.70, W * 0.88, H * 0.22);
    g.fillStyle(0x5aa030);
    g.fillEllipse(W / 2, H * 0.68, W * 0.65, H * 0.14);

    // ── Stars ───────────────────────────────────────────────────────
    g.fillStyle(0xffffff);
    [[30,30],[80,18],[130,35],[195,15],[250,28],[310,20],[360,38],[50,55],[170,48],[290,52],[340,60]].forEach(([x,y]) => {
      g.fillCircle(x, y, 1.2);
    });

    // ── Trees (left cluster) ─────────────────────────────────────────
    this.drawTree(g, 0,   H * 0.62, 56, 140);
    this.drawTree(g, 38,  H * 0.58, 66, 165);
    this.drawTree(g, 72,  H * 0.60, 52, 148);
    this.drawTree(g, 100, H * 0.56, 62, 158);
    this.drawTree(g, 124, H * 0.61, 48, 135);

    // Background trees (smaller, darker)
    this.drawTree(g, 15,  H * 0.48, 40, 100, true);
    this.drawTree(g, 55,  H * 0.45, 34, 90,  true);
    this.drawTree(g, 92,  H * 0.47, 36, 95,  true);

    // ── Trees (right cluster) ────────────────────────────────────────
    this.drawTree(g, W - 56,  H * 0.62, 56, 140);
    this.drawTree(g, W - 100, H * 0.58, 66, 165);
    this.drawTree(g, W - 134, H * 0.60, 52, 148);
    this.drawTree(g, W - 158, H * 0.56, 62, 158);
    this.drawTree(g, W - 180, H * 0.61, 48, 135);

    // Background trees (right)
    this.drawTree(g, W - 32,  H * 0.48, 40, 100, true);
    this.drawTree(g, W - 68,  H * 0.45, 34, 90,  true);
    this.drawTree(g, W - 104, H * 0.47, 36, 95,  true);

    // ── Torches ──────────────────────────────────────────────────────
    this.drawTorch(g, scene, W / 2 - 80, H * 0.76);
    this.drawTorch(g, scene, W / 2 + 80, H * 0.76);

    // ── Ground path ──────────────────────────────────────────────────
    g.fillStyle(0x3a5a18);
    g.fillEllipse(W / 2, H * 0.88, 120, 28);
  }

  private drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, dark = false): void {
    const [c1, c2] = dark ? [0x122e12, 0x1e4a1e] : [0x1c4a1a, 0x2a6b26];
    const cx = x + w / 2;
    const trunk = { x: cx - 5, y: y, w: 10, h: 18 };

    // Trunk
    g.fillStyle(0x4a2a0a);
    g.fillRect(trunk.x, trunk.y, trunk.w, trunk.h);

    // Three tiers
    g.fillStyle(c1);
    g.fillTriangle(cx - w / 2, y, cx + w / 2, y, cx, y - h * 0.42);
    g.fillStyle(c2);
    g.fillTriangle(cx - w * 0.37, y - h * 0.33, cx + w * 0.37, y - h * 0.33, cx, y - h * 0.73);
    g.fillStyle(c1);
    g.fillTriangle(cx - w * 0.22, y - h * 0.58, cx + w * 0.22, y - h * 0.58, cx, y - h);
  }

  private drawTorch(g: Phaser.GameObjects.Graphics, scene: Phaser.Scene, x: number, y: number): void {
    // Torch stick
    g.fillStyle(0x5c3a1a);
    g.fillRect(x - 2, y - 22, 4, 22);

    // Animated flame using Graphics.fillCircle + tween on alpha
    const flame = scene.add.graphics().setDepth(1);
    flame.fillStyle(0xff8c00);
    flame.fillCircle(x, y - 25, 6);
    flame.fillStyle(0xffcc00);
    flame.fillCircle(x, y - 28, 3);

    // Flicker tween
    scene.tweens.add({
      targets: flame,
      alpha: { from: 0.7, to: 1 },
      scaleX: { from: 0.85, to: 1.1 },
      scaleY: { from: 0.9,  to: 1.05 },
      duration: Phaser.Math.Between(200, 400),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }
}
