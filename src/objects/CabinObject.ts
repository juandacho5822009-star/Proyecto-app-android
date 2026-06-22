import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

export class CabinObject extends Phaser.GameObjects.Container {
  private gfx: Phaser.GameObjects.Graphics;
  private hitZone: Phaser.GameObjects.Zone;
  private shaking = false;

  constructor(scene: Phaser.Scene) {
    const cx = GC.CABIN_X, cy = GC.CABIN_Y;
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setDepth(8);

    this.gfx = scene.add.graphics().setDepth(8);
    this.drawCabin(this.gfx, cx, cy);

    this.hitZone = scene.add.zone(cx, cy - 20, 170, 210).setInteractive();
    this.hitZone.setDepth(50);
  }

  private drawCabin(g: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    // ── Ground shadow ──────────────────────────────────────────────
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(cx + 6, cy + 12, 130, 22);

    // ── Side wall (isometric hint) ─────────────────────────────────
    g.fillStyle(0x4a2e10);
    g.fillRect(cx + 52, cy - 62, 14, 70);
    // Side wall log lines
    g.lineStyle(1, 0x3a2008, 0.6);
    for (let i = 0; i < 5; i++) {
      const ly = cy - 62 + i * 14;
      g.beginPath(); g.moveTo(cx+52, ly); g.lineTo(cx+66, ly); g.strokePath();
    }

    // ── Cabin body (front face) ────────────────────────────────────
    g.fillStyle(0x7a5028);
    g.fillRect(cx - 55, cy - 62, 110, 74);

    // Log horizontal lines (darker)
    g.lineStyle(2, 0x5c3a18, 0.7);
    for (let i = 1; i < 6; i++) {
      const ly = cy - 62 + i * 12;
      g.beginPath(); g.moveTo(cx - 55, ly); g.lineTo(cx + 52, ly); g.strokePath();
    }
    // Log vertical end caps (rounded logs)
    g.fillStyle(0x8a5e30, 0.4);
    for (let i = 0; i < 6; i++) {
      const ly = cy - 56 + i * 12;
      g.fillCircle(cx - 55, ly, 4);
      g.fillCircle(cx + 52, ly, 4);
    }

    // ── Roof (darker, more detailed) ──────────────────────────────
    g.fillStyle(0x2e1a08);
    g.fillTriangle(cx - 70, cy - 62, cx + 70, cy - 62, cx, cy - 112);
    // Roof highlight ridge
    g.fillStyle(0x3e2610);
    g.fillTriangle(cx - 60, cy - 62, cx + 60, cy - 62, cx, cy - 106);
    // Roof dark shadow underside on left
    g.fillStyle(0x1e0e04, 0.5);
    g.fillTriangle(cx - 70, cy - 62, cx, cy - 112, cx - 20, cy - 80);
    // Isometric roof top
    g.fillStyle(0x3a2210);
    g.fillTriangle(cx + 52, cy - 62, cx + 70, cy - 62, cx, cy - 112);

    // ── Door ──────────────────────────────────────────────────────
    g.fillStyle(0x1e0c04);
    g.fillRoundedRect(cx - 16, cy - 32, 30, 34, 4);
    g.fillStyle(0x2a1408);
    g.fillRoundedRect(cx - 14, cy - 30, 26, 30, 3);
    // Door panels
    g.lineStyle(1, 0x3a2010, 0.5);
    g.strokeRect(cx - 12, cy - 28, 10, 12);
    g.strokeRect(cx + 2,  cy - 28, 10, 12);
    // Doorknob
    g.fillStyle(0xd4a040);
    g.fillCircle(cx + 10, cy - 14, 2.5);
    // Door step
    g.fillStyle(0x3a2810);
    g.fillRect(cx - 18, cy + 2, 34, 5);

    // ── Windows ───────────────────────────────────────────────────
    [-36, 20].forEach(ox => {
      g.fillStyle(0x1a0c04);
      g.fillRoundedRect(cx + ox - 2, cy - 56, 22, 18, 3);
      // Glass (warm yellow glow)
      g.fillStyle(0xffe0a0, 0.45);
      g.fillRect(cx + ox, cy - 54, 18, 14);
      // Window cross
      g.lineStyle(1, 0x3a2010, 0.6);
      g.beginPath(); g.moveTo(cx+ox+9, cy-54); g.lineTo(cx+ox+9, cy-40); g.strokePath();
      g.beginPath(); g.moveTo(cx+ox, cy-47); g.lineTo(cx+ox+18, cy-47); g.strokePath();
    });
    // Window glow (warm light on ground below each window)
    g.fillStyle(0xffcc66, 0.07);
    g.fillEllipse(cx - 28, cy - 20, 26, 8);
    g.fillEllipse(cx + 30, cy - 20, 26, 8);

    // ── Chimney ──────────────────────────────────────────────────
    g.fillStyle(0x4a2e14);
    g.fillRect(cx + 22, cy - 118, 16, 38);
    g.fillStyle(0x3a2010);
    g.fillRect(cx + 20, cy - 120, 20, 6);
    // Chimney top cap
    g.fillStyle(0x2a1808);
    g.fillRect(cx + 18, cy - 122, 24, 4);

    // ── Animated smoke ────────────────────────────────────────────
    const smoke = this.scene.add.graphics().setDepth(9);
    const sx = cx + 30, sy = cy - 124;
    const drawSmoke = (alpha: number, offset: number) => {
      smoke.fillStyle(0xaaaaaa, alpha);
      smoke.fillCircle(sx + offset,     sy - 8,  5);
      smoke.fillStyle(0xbbbbbb, alpha * 0.7);
      smoke.fillCircle(sx + offset - 2, sy - 16, 4);
      smoke.fillStyle(0xcccccc, alpha * 0.4);
      smoke.fillCircle(sx + offset + 1, sy - 23, 3);
    };
    drawSmoke(0.22, 0);
    this.scene.tweens.add({
      targets: smoke,
      y: { from: 0, to: -8 },
      alpha: { from: 0.8, to: 0.2 },
      duration: 2200,
      yoyo: true, repeat: -1, ease: 'Sine.InOut',
    });

    // ── Ambient cabin glow (warm interior light spill) ────────────
    g.fillStyle(0xffaa44, 0.04);
    g.fillEllipse(cx, cy, 160, 80);
  }

  addClickListener(cb: (x: number, y: number) => void): void {
    this.hitZone.on('pointerdown', (ptr: Phaser.Input.Pointer) => cb(ptr.x, ptr.y));
  }

  shake(): void {
    if (this.shaking) return;
    this.shaking = true;
    this.scene.cameras.main.shake(200, 0.005);
    this.scene.time.delayedCall(260, () => { this.shaking = false; });
  }
}
