import Phaser from 'phaser';

/** Pooled floating text that pops up on click and fades out. */
export class FloatingTextPool {
  constructor(private scene: Phaser.Scene) {}

  spawn(x: number, y: number, text: string, color = '#fbbf24'): void {
    const t = this.scene.add.text(x, y, text, {
      fontSize: '16px',
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontStyle: 'bold',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: t,
      y: y - 55,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 900,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy(),
    });
  }
}
