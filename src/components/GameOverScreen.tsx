import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { useRewardedAd } from '../hooks/useAds';
import { clearSave } from '../store/persistence';

export function GameOverScreen() {
  const { state, dispatch } = useGame();
  const { watchAd } = useRewardedAd();
  const [loading, setLoading] = useState(false);

  const handleRevive = async () => {
    setLoading(true);
    await watchAd('heal');
    setLoading(false);
  };

  const handleRestart = () => {
    clearSave();
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 px-6">
      <div className="text-6xl mb-4">💀</div>
      <h1 className="text-3xl font-bold text-red-500 mb-2">CABAÑA DESTRUIDA</h1>
      <p className="text-gray-400 text-center mb-2">
        Los zombis tomaron tu refugio
      </p>

      <div className="bg-gray-800 rounded-xl p-4 mb-6 text-center w-full max-w-xs">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-2xl">🧟</div>
            <div className="text-white font-bold">{state.stats.zombiesKilled}</div>
            <div className="text-gray-500 text-xs">Muertos</div>
          </div>
          <div>
            <div className="text-2xl">🌊</div>
            <div className="text-white font-bold">{state.stats.wavesSurvived}</div>
            <div className="text-gray-500 text-xs">Oleadas</div>
          </div>
          <div>
            <div className="text-2xl">👆</div>
            <div className="text-white font-bold">{state.stats.totalClicks}</div>
            <div className="text-gray-500 text-xs">Clics</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleRevive}
        disabled={loading}
        className="w-full max-w-xs bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50
          text-white font-bold py-3 px-6 rounded-xl mb-3 flex items-center justify-center gap-2
          transition-all active:scale-95"
      >
        {loading ? (
          <span className="animate-spin text-xl">⏳</span>
        ) : (
          <>
            <span>📺</span>
            <span>Ver anuncio y revivir</span>
          </>
        )}
      </button>

      <button
        onClick={handleRestart}
        className="w-full max-w-xs bg-gray-700 hover:bg-gray-600
          text-white py-3 px-6 rounded-xl transition-all active:scale-95"
      >
        Empezar de nuevo
      </button>
    </div>
  );
}
