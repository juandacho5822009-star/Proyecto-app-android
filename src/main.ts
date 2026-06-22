import Phaser from 'phaser';
import { GC } from './data/GameConfig';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { GameOverScene } from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GC.W,
  height: GC.H,
  backgroundColor: '#1a0a2e',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, UIScene, GameOverScene],
};

new Phaser.Game(config);
