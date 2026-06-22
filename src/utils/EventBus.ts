import Phaser from 'phaser';

// Singleton event bus for cross-scene communication
export const EventBus = new Phaser.Events.EventEmitter();

export const EV = {
  RESOURCES_CHANGED:  'resourcesChanged',
  UPGRADES_CHANGED:   'upgradesChanged',
  WAVE_CHANGED:       'waveChanged',
  UPGRADE_REQUESTED:  'upgradeRequested',
  AD_REWARD_REQUESTED:'adRewardRequested',
  WAVE_STARTED:       'waveStarted',
  WAVE_COMPLETED:     'waveCompleted',
} as const;
