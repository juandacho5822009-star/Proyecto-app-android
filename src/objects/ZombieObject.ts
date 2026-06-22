import Phaser from 'phaser';
import { GC } from '../data/GameConfig';

export class ZombieObject extends Phaser.GameObjects.Sprite {
  private walkTween?: Phaser.Tweens.Tween;
  private bobTween?: Phaser.Tweens.Tween;
  private side: 'left' | 'right';
  private dead = false;

  constructor(scene: Phaser.Scene, x: number, y: number, side: 'left' | 'right') {
    super(scene, x, y, 'zombie_walk', 0);
    this.side = side;

    scene.add.existing(this);

    this.setScale(GC.ZOMBIE_SCALE);
    this.setDepth(10 + y / 100); // further zombies behind closer ones

    // Flip sprite so zombies always "face" toward the center
    if (side === 'right') this.setFlipX(true);

    // Play walk animation
    this.play('zombie_walk');
  }

  startWalking(): void {
    if (this.dead) return;

    const targetX = this.side === 'left' ? GC.BARRICADE_STOP_X_L : GC.BARRICADE_STOP_X_R;
    const dist = Math.abs(targetX - this.x);
    const duration = (dist / GC.ZOMBIE_SPEED) * 1000;

    // Horizontal walk tween
    this.walkTween = this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration,
      ease: 'Linear',
      onComplete: () => {
        // Reached barricade: start attack idle bounce
        this.bobTween = this.scene.tweens.add({
          targets: this,
          y: this.y + 6,
          duration: 350,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.InOut',
        });
      },
    });

    // Subtle vertical bob during walk for life-like feel
    this.bobTween = this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 280,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  die(): void {
    if (this.dead) return;
    this.dead = true;

    this.walkTween?.stop();
    this.bobTween?.stop();

    // Death flash + shrink
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: this.scaleX * 1.3,
      scaleY: 0,
      duration: 280,
      ease: 'Back.In',
      onComplete: () => this.destroy(),
    });
  }
}
