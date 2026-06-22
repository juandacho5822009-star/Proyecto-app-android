import Phaser from 'phaser';
import { GC } from '../data/GameConfig';
import { createInitialState } from '../data/GameState';
import { SaveManager } from '../utils/SaveManager';

export class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  create(data: { wave: number }): void {
    const W = GC.W, H = GC.H;
    const wave = data?.wave ?? 1;

    // Dark overlay
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.82);

    // Title
    this.add.text(W / 2, H / 2 - 120, '💀', { fontSize: '64px' }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 60, 'GAME OVER', {
      fontSize: '28px', fontStyle: 'bold',
      color: '#ef4444', fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 20, `La cabaña cayó en la Ola ${wave}`, {
      fontSize: '15px', color: '#9ca3af', fontFamily: 'Arial',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 20, `Sobreviviste ${wave - 1} ola${wave - 1 !== 1 ? 's' : ''}`, {
      fontSize: '18px', color: '#fbbf24', fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    // Restart button
    const btn = this.add.text(W / 2, H / 2 + 90, '🔄 Reintentar', {
      fontSize: '20px', fontStyle: 'bold',
      color: '#ffffff', fontFamily: 'Arial Black, Arial',
      backgroundColor: '#16a34a',
      padding: { x: 28, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setAlpha(0.85));
    btn.on('pointerout',   () => btn.setAlpha(1));
    btn.on('pointerdown',  () => {
      SaveManager.clear();
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
      this.scene.stop();
    });

    // Pulse tween on button
    this.tweens.add({
      targets: btn,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    // Zombie emoji drift in from sides
    for (let i = 0; i < 5; i++) {
      const zx   = i % 2 === 0 ? -40 : W + 40;
      const zy   = Phaser.Math.Between(H * 0.6, H * 0.9);
      const icon = this.add.text(zx, zy, '🧟', { fontSize: '28px' }).setAlpha(0.5);
      this.tweens.add({
        targets: icon,
        x: i % 2 === 0 ? W + 40 : -40,
        duration: Phaser.Math.Between(4000, 8000),
        delay: i * 600,
        repeat: -1,
        ease: 'Linear',
      });
    }
  }
}
