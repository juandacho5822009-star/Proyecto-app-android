import { useGame } from '../store/GameContext';

export function HUD() {
  const { state } = useGame();
  const { resources, cabin, wave } = state;
  const hpPercent = (cabin.hp / cabin.maxHp) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-3 pt-2 pointer-events-none">
      {/* Left: Gold + Wood */}
      <div className="flex flex-col gap-1">
        <ResourceChip icon="🪙" value={Math.floor(resources.gold)} color="text-yellow-300" />
        <ResourceChip icon="🪵" value={Math.floor(resources.wood)} color="text-amber-300" />
      </div>

      {/* Center: Wave indicator */}
      <div className="flex flex-col items-center">
        {wave.isActive ? (
          <div className="bg-red-900/80 border border-red-500 rounded-lg px-3 py-1 text-center">
            <div className="text-red-300 text-xs font-bold animate-pulse">⚔️ OLEADA {wave.number}</div>
            <div className="text-white text-xs">🧟 {wave.zombiesAlive}/{wave.zombiesTotal}</div>
          </div>
        ) : (
          <div className="bg-black/50 border border-gray-600 rounded-lg px-3 py-1 text-center">
            <div className="text-gray-300 text-xs">Próxima oleada</div>
            <div className="text-yellow-300 text-sm font-bold">{Math.ceil(wave.nextWaveCountdown)}s</div>
          </div>
        )}
      </div>

      {/* Right: HP */}
      <div className="flex flex-col items-end gap-1">
        <div className="bg-black/60 border border-red-800 rounded-lg px-2 py-1 text-right">
          <div className="text-xs text-gray-400">❤️ SALUD</div>
          <div className={`text-sm font-bold ${hpPercent > 50 ? 'text-green-400' : hpPercent > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
            {Math.floor(cabin.hp)}/{cabin.maxHp}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceChip({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <div className="bg-black/60 border border-gray-600 rounded-lg px-2 py-0.5 flex items-center gap-1.5">
      <span className="text-base leading-none">{icon}</span>
      <span className={`text-sm font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
  );
}
