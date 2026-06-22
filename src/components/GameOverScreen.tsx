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

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-6">
      {/* Background skull pattern */}
      <div className="absolute inset-0 opacity-5 text-6xl flex flex-wrap overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="m-3">💀</span>
        ))}
      </div>

      <div className="relative text-center">
        <div className="text-7xl mb-3 animate-bounce">💀</div>
        <h1 className="text-4xl font-black text-red-500 mb-1 tracking-wider drop-shadow-lg">
          CABAÑA DESTRUIDA
        </h1>
        <p className="text-gray-400 mb-6">Los muertos tomaron tu refugio</p>

        {/* Stats card */}
        <div className="bg-gray-900 border border-red-900 rounded-2xl p-4 mb-6 w-72">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-3xl">🧟</div>
              <div className="text-white font-bold text-lg">{state.stats.zombiesKilled}</div>
              <div className="text-gray-500 text-xs">Muertos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">🌊</div>
              <div className="text-white font-bold text-lg">{state.stats.wavesSurvived}</div>
              <div className="text-gray-500 text-xs">Oleadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">🪙</div>
              <div className="text-white font-bold text-lg">{Math.floor(state.resources.gold)}</div>
              <div className="text-gray-500 text-xs">Oro</div>
            </div>
          </div>
        </div>

        {/* Revive button */}
        <button
          onClick={handleRevive}
          disabled={loading}
          className="w-72 bg-gradient-to-r from-yellow-600 to-yellow-700
            hover:from-yellow-500 hover:to-yellow-600
            disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl mb-3
            flex items-center justify-center gap-2 text-lg shadow-xl
            active:scale-95 transition-all border border-yellow-500"
        >
          {loading ? (
            <span className="animate-spin text-2xl">⏳</span>
          ) : (
            <>
              <span className="text-2xl">📺</span>
              <div className="text-left">
                <div className="text-sm font-black">VER ANUNCIO</div>
                <div className="text-xs text-yellow-200">y revivir gratis</div>
              </div>
            </>
          )}
        </button>

        <button
          onClick={() => { clearSave(); dispatch({ type: 'RESET_GAME' }); }}
          className="w-72 bg-gray-800 hover:bg-gray-700 text-gray-300
            py-3 px-6 rounded-2xl border border-gray-600
            active:scale-95 transition-all"
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
