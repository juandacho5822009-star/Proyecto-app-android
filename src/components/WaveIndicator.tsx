import { useGame } from '../store/GameContext';

export function WaveIndicator() {
  const { state } = useGame();
  const { wave, upgrades, cabin } = state;

  const barricadePercent = (upgrades.barricade.hp / upgrades.barricade.maxHp) * 100;
  const cabinPercent = (cabin.hp / cabin.maxHp) * 100;

  return (
    <div className="bg-gray-900 border-b border-green-900 px-3 py-2">
      {/* Health bars */}
      <div className="flex gap-3 mb-2">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>🪵 Barricada</span>
            <span>{Math.floor(upgrades.barricade.hp)}/{upgrades.barricade.maxHp}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, barricadePercent)}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>🏠 Cabaña</span>
            <span>{Math.floor(cabin.hp)}/{cabin.maxHp}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, cabinPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wave status */}
      {wave.isActive ? (
        <div className="flex items-center justify-between">
          <span className="text-red-400 font-bold text-sm animate-pulse">
            🧟 OLEADA {wave.number} — {wave.zombiesAlive}/{wave.zombiesTotal} zombis
          </span>
          <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{ width: `${(wave.zombiesAlive / wave.zombiesTotal) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Próxima oleada: <span className="text-yellow-400 font-bold">
              {Math.ceil(wave.nextWaveCountdown)}s
            </span>
          </span>
          <span className="text-gray-500 text-xs">Oleada {wave.number} superada ✓</span>
        </div>
      )}
    </div>
  );
}
