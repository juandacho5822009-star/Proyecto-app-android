import { useGame } from '../store/GameContext';
import type { RewardType } from '../types/game';

/**
 * Hook de integración con SDKs de anuncios recompensados.
 * Reemplazar `simulateAdWatch` con la llamada real al SDK (AdMob, Unity Ads, etc.)
 * cuando se integre en la app nativa.
 */
export function useRewardedAd() {
  const { dispatch } = useGame();

  const watchAd = (reward: RewardType): Promise<boolean> => {
    return new Promise((resolve) => {
      // --- INTEGRATION POINT ---
      // Aquí va la llamada al SDK real, ej:
      // AdMob.showRewardedAd().then(result => { if (result.rewarded) onRewardGranted(reward) })
      //
      // Por ahora simulamos un delay de 2s
      setTimeout(() => {
        onRewardGranted(reward);
        resolve(true);
      }, 2000);
    });
  };

  const onRewardGranted = (reward: RewardType) => {
    dispatch({ type: 'GRANT_REWARD', payload: { reward } });
  };

  return { watchAd };
}
