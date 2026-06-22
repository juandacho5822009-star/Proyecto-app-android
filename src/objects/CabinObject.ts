import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

// cabin.png: 1072×992 isometric log cabin
// display scale 0.20 → ~214×198px
const CABIN_SCALE  = 0.20;
const CABIN_ORIGIN = { x: 0.5, y: 0.88 };  // anchor at visual base

export class CabinObject extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Image;
  private hitZone: Phaser.GameObjects.Zone;
  private shaking = false;

  constructor(scene: Phaser.Scene) {
    const cx = GC.CABIN_X, cy = GC.CABIN_Y;
    super(scene, 0, 0);
    scene.add.existing(this);

    // Ground shadow
    const shadow = scene.add.graphics().setDepth(4);
    shadow.fillStyle(0x000000, 0.32);
    shadow.fillEllipse(cx + 10, cy + 8, 150, 24);

    // Cabin sprite
    this.sprite = scene.add.image(cx, cy, 'cabin')
      .setDepth(5)
      .setScale(CABIN_SCALE)
      .setOrigin(CABIN_ORIGIN.x, CABIN_ORIGIN.y);

    // Chimney smoke — position tuned to sprite's chimney location
    // Chimney is upper-right of the sprite
    const smokeX = cx + 30;
    const smokeY = cy - (992 * CABIN_SCALE * (1 - CABIN_ORIGIN.y)) - 60;
    this.addSmoke(scene, smokeX, smokeY);

    // Hit zone over the visible cabin body
    this.hitZone = scene.add.zone(cx, cy - 50, 180, 200).setInteractive();
    this.hitZone.setDepth(50);
  }

  private addSmoke(scene: Phaser.Scene, sx: number, sy: number): void {
    const smoke = scene.add.graphics().setDepth(6);
    const draw = () => {
      smoke.clear();
      smoke.fillStyle(0xcccccc, 0.28); smoke.fillCircle(sx,     sy,      6);
      smoke.fillStyle(0xbbbbbb, 0.18); smoke.fillCircle(sx - 3, sy - 10, 5);
      smoke.fillStyle(0xaaaaaa, 0.10); smoke.fillCircle(sx + 2, sy - 19, 4);
    };
    draw();
    scene.tweens.add({
      targets: smoke,
      y: { from: 0, to: -9 },
      alpha: { from: 0.9, to: 0.3 },
      duration: 2000,
      yoyo: true, repeat: -1, ease: 'Sine.InOut',
    });
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
