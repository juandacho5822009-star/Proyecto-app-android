import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

/** Palisade fence + watchtowers — drawn based on upgrade level. */
export class FortificationObject {
  private gfx: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene) {
    this.gfx = scene.add.graphics().setDepth(4);
  }

  update(barricadeLevel: number, watchtowerLevel: number): void {
    this.gfx.clear();
    if (barricadeLevel < 2) return;

    const cx = GC.CABIN_X, cy = GC.CABIN_Y;
    const hasWalls    = barricadeLevel >= 2;
    const hasTowers   = watchtowerLevel >= 2;
    const stakeColor  = barricadeLevel >= 3 ? 0x6b4423 : 0x8b6040;

    if (hasWalls) this.drawPalisade(cx, cy, stakeColor);
    if (hasTowers) {
      this.drawWatchtower(cx - 100, cy - 18);
      this.drawWatchtower(cx + 100, cy - 18);
    }
  }

  private drawPalisade(cx: number, cy: number, color: number): void {
    const g = this.gfx;
    const leftX = cx - 120, rightX = cx + 120;
    const topY  = cy - 70,  botY   = cy + 30;

    // Horizontal beams
    g.lineStyle(5, color, 0.8);
    g.beginPath(); g.moveTo(leftX, topY + 12); g.lineTo(rightX, topY + 12); g.strokePath();
    g.beginPath(); g.moveTo(leftX, topY + 34); g.lineTo(rightX, topY + 34); g.strokePath();

    // Stakes top row
    for (let i = 0; i <= 7; i++) {
      const x = leftX + i * (rightX - leftX) / 7;
      this.drawStake(g, x, topY, color);
    }

    // Side stakes
    [leftX, rightX].forEach(sx => {
      for (let i = 0; i < 3; i++) {
        this.drawStake(g, sx, topY + i * 28, color);
      }
    });
  }

  private drawStake(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number): void {
    g.fillStyle(color);
    g.fillRect(x - 4, y, 8, 28);
    g.fillTriangle(x - 4, y, x + 4, y, x, y - 8);
  }

  private drawWatchtower(x: number, y: number): void {
    const g = this.gfx;
    // Legs
    g.lineStyle(5, 0x5c3a1a);
    g.beginPath(); g.moveTo(x - 14, y + 50); g.lineTo(x, y); g.strokePath();
    g.beginPath(); g.moveTo(x + 14, y + 50); g.lineTo(x, y); g.strokePath();
    // Platform
    g.fillStyle(0x6b4a22);
    g.fillRect(x - 18, y - 5, 36, 8);
    // Tower body
    g.fillStyle(0x7a5530);
    g.fillRoundedRect(x - 11, y - 32, 22, 27, 2);
    // Roof
    g.fillStyle(0x5c3a1a);
    g.fillTriangle(x - 14, y - 32, x + 14, y - 32, x, y - 52);
    // Torch
    g.fillStyle(0xff8c00, 0.9);
    g.fillCircle(x, y - 20, 4);
  }
}
