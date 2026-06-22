import { useGame } from '../store/GameContext';
import { ModalOverlay } from './UpgradeModal';

export function WorldMapModal({ onClose }: { onClose: () => void }) {
  const { state } = useGame();

  return (
    <ModalOverlay onClose={onClose}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-400">🗺️ MAPA DEL MUNDO</h2>
        <p className="text-gray-400 text-xs">Bosque actual: Nv.{state.wave.number}</p>
      </div>

      {/* World progress bar */}
      <div className="bg-green-900/30 border border-green-800 rounded-xl p-3 mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>🌲 MUNDO ACTUAL: BOSQUE MALDITO</span>
          <span>{state.wave.number}/10</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-all"
            style={{ width: `${Math.min(100, (state.wave.number / 10) * 100)}%` }}
          />
        </div>
      </div>

      {/* Zone list */}
      <div className="space-y-2">
        {state.world.map((zone, i) => (
          <ZoneRow
            key={zone.zone}
            zone={zone}
            isCurrent={i === 0}
            isNext={i === 1}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <StatBox label="Zombies" value={state.stats.zombiesKilled} icon="🧟" />
        <StatBox label="Oleadas" value={state.stats.wavesSurvived} icon="🌊" />
        <StatBox label="Clics" value={state.stats.totalClicks} icon="👆" />
      </div>
    </ModalOverlay>
  );
}

function ZoneRow({ zone, isCurrent, isNext }: {
  zone: { zone: string; name: string; icon: string; level: number; maxLevel: number; unlocked: boolean };
  isCurrent: boolean;
  isNext: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border
      ${isCurrent ? 'bg-green-900/40 border-green-700' :
        zone.unlocked ? 'bg-gray-800 border-gray-700' :
          'bg-gray-900/50 border-gray-800 opacity-50'}`}>
      <span className="text-3xl">{zone.icon}</span>
      <div className="flex-1">
        <div className={`font-bold text-sm ${isCurrent ? 'text-green-400' : 'text-gray-300'}`}>
          {zone.name}
          {isCurrent && <span className="ml-2 text-yellow-400 text-xs">← AQUÍ</span>}
        </div>
        {zone.unlocked ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(zone.level / zone.maxLevel) * 100}%` }}
              />
            </div>
            <span className="text-gray-500 text-[10px]">{zone.level}/{zone.maxLevel}</span>
          </div>
        ) : (
          <div className="text-gray-600 text-xs mt-0.5">
            🔒 {isNext ? 'Alcanza Oleada 10 para desbloquear' : 'Bloqueado'}
          </div>
        )}
      </div>
      {isCurrent && (
        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{zone.level}</span>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-2">
      <div className="text-xl">{icon}</div>
      <div className="text-white font-bold text-sm">{value.toLocaleString()}</div>
      <div className="text-gray-500 text-[10px]">{label}</div>
    </div>
  );
}
