import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

/** Draws the cabin with Graphics and handles tap detection. */
export class CabinObject extends Phaser.GameObjects.Container {
  private gfx: Phaser.GameObjects.Graphics;
  private hitZone: Phaser.GameObjects.Zone;
  private shaking = false;

  constructor(scene: Phaser.Scene) {
    const cx = GC.CABIN_X, cy = GC.CABIN_Y;
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setDepth(5);

    this.gfx = scene.add.graphics().setDepth(5);
    this.drawCabin(this.gfx, cx, cy);

    // Invisible interactive zone over cabin
    this.hitZone = scene.add.zone(cx, cy, 160, 200).setInteractive();
    this.hitZone.setDepth(50);
  }

  private drawCabin(g: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(cx, cy + 8, 110, 22);

    // Cabin body
    g.fillStyle(0x8b5e2e);
    g.fillRect(cx - 50, cy - 58, 100, 66);

    // Log lines
    g.lineStyle(2, 0x6b4423, 0.5);
    for (let i = 0; i < 5; i++) {
      g.strokeRect(cx - 50, cy - 58 + i * 13, 100, 0);
      g.moveTo(cx - 50, cy - 58 + i * 13);
      g.lineTo(cx + 50, cy - 58 + i * 13);
      g.strokePath();
    }

    // Roof
    g.fillStyle(0x5c3a1a);
    g.fillTriangle(cx - 62, cy - 58, cx + 62, cy - 58, cx, cy - 102);
    g.fillStyle(0x6b4a22);
    g.fillTriangle(cx - 55, cy - 58, cx + 55, cy - 58, cx, cy - 96);

    // Door
    g.fillStyle(0x3a1e08);
    g.fillRoundedRect(cx - 14, cy - 30, 28, 32, 3);
    g.fillStyle(0x4a2a0a);
    g.fillRoundedRect(cx - 12, cy - 28, 24, 28, 2);
    g.fillStyle(0xc8a060);
    g.fillCircle(cx + 8, cy - 13, 2.5);

    // Windows
    g.fillStyle(0x3a1e08);
    g.fillRoundedRect(cx - 44, cy - 52, 20, 16, 2);
    g.fillRoundedRect(cx + 24, cy - 52, 20, 16, 2);
    g.fillStyle(0xffcc66, 0.5);
    g.fillRect(cx - 42, cy - 50, 16, 12);
    g.fillRect(cx + 26, cy - 50, 16, 12);

    // Chimney
    g.fillStyle(0x7a5030);
    g.fillRect(cx + 18, cy - 110, 14, 32);

    // Smoke (static — animated separately via tweens)
    g.fillStyle(0xaaaaaa, 0.25);
    g.fillCircle(cx + 25, cy - 115, 6);
    g.fillStyle(0xbbbbbb, 0.18);
    g.fillCircle(cx + 22, cy - 123, 4.5);
  }

  addClickListener(cb: (x: number, y: number) => void): void {
    this.hitZone.on('pointerdown', (ptr: Phaser.Input.Pointer) => cb(ptr.x, ptr.y));
  }

  shake(): void {
    if (this.shaking) return;
    this.shaking = true;
    this.scene.cameras.main.shake(250, 0.004);
    this.scene.time.delayedCall(280, () => { this.shaking = false; });
  }
}
