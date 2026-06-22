export const AdManager = {
  isWatching: false,

  watchAd(reward: string, onGranted: (reward: string) => void): void {
    if (this.isWatching) return;
    this.isWatching = true;

    // ── INTEGRATION POINT ──────────────────────────────────────────
    // AdMob example (Capacitor):
    //   AdMob.showRewardVideoAd().then(() => { onGranted(reward); this.isWatching = false; });
    //
    // Unity Ads example:
    //   UnityAds.show('rewardedVideo', (result) => {
    //     if (result === UnityAds.FinishState.COMPLETED) onGranted(reward);
    //     this.isWatching = false;
    //   });
    // ──────────────────────────────────────────────────────────────
    // Simulation (2s delay):
    setTimeout(() => {
      onGranted(reward);
      this.isWatching = false;
    }, 2000);
  },
};
