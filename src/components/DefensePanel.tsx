import { useGame } from '../store/GameContext';
import { canAfford } from '../constants/gameConfig';
import type { Resources } from '../types/game';
import type { GameAction } from '../types/game';
import { useRewardedAd } from '../hooks/useAds';
import { useState } from 'react';

export function DefensePanel() {
  const { state, dispatch } = useGame();
  const { upgrades, resources } = state;
  const { watchAd } = useRewardedAd();
  const [adLoading, setAdLoading] = useState<string | null>(null);

  const handleAd = async (type: string) => {
    setAdLoading(type);
    if (type === 'repair') {
      await watchAd('repair_barricade');
    } else if (type === 'resources') {
      await watchAd('resources');
    }
    setAdLoading(null);
  };

  return (
    <div className="px-3 py-3 space-y-2">
      <h2 className="text-green-400 font-bold text-sm uppercase tracking-wider">Mejoras</h2>

      <div className="grid grid-cols-2 gap-2">
        <UpgradeCard
          icon="🧱"
          name="Barricada"
          level={upgrades.barricade.level}
          description={`HP: ${upgrades.barricade.maxHp}`}
          cost={upgrades.barricade.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_BARRICADE' })}
        />
        <UpgradeCard
          icon="🪤"
          name="Trampas"
          level={upgrades.traps.level}
          description={`DMG: ${upgrades.traps.damage}/s`}
          cost={upgrades.traps.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_TRAPS' })}
        />
        <UpgradeCard
          icon="🗼"
          name="Atalaya"
          level={upgrades.watchtower.level}
          description={`DMG: ${upgrades.watchtower.damage}/s`}
          cost={upgrades.watchtower.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_WATCHTOWER' })}
        />
        <UpgradeCard
          icon="🪚"
          name="Aserradero"
          level={upgrades.sawmill.level}
          description={`+${upgrades.sawmill.perSecond}/s 🪵`}
          cost={upgrades.sawmill.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_SAWMILL' })}
        />
        <UpgradeCard
          icon="🌾"
          name="Granja"
          level={upgrades.farm.level}
          description={`+${upgrades.farm.perSecond}/s 🍖`}
          cost={upgrades.farm.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_FARM' })}
        />
        <UpgradeCard
          icon="🔧"
          name="Taller"
          level={upgrades.workshop.level}
          description={`+${upgrades.workshop.perSecond}/s ⚙️`}
          cost={upgrades.workshop.upgradeCost}
          resources={resources}
          onUpgrade={() => dispatch({ type: 'UPGRADE_WORKSHOP' })}
        />
      </div>

      {/* Rewarded Ad buttons */}
      <div className="mt-3 border-t border-gray-700 pt-3">
        <p className="text-xs text-gray-500 mb-2">📺 Ver anuncio para obtener bonus:</p>
        <div className="flex gap-2">
          <AdButton
            label="Reparar barricada"
            loading={adLoading === 'repair'}
            onClick={() => handleAd('repair')}
          />
          <AdButton
            label="+100🪵 +50🍖 +50⚙️"
            loading={adLoading === 'resources'}
            onClick={() => handleAd('resources')}
          />
        </div>
      </div>
    </div>
  );
}

function UpgradeCard({
  icon, name, level, description, cost, resources, onUpgrade,
}: {
  icon: string;
  name: string;
  level: number;
  description: string;
  cost: Resources;
  resources: Resources;
  onUpgrade: () => void;
}) {
  const affordable = canAfford(resources, cost);

  return (
    <button
      onClick={onUpgrade}
      className={`flex flex-col p-2 rounded-lg border text-left transition-all active:scale-95
        ${affordable
          ? 'border-green-700 bg-gray-800 hover:bg-gray-700'
          : 'border-gray-700 bg-gray-900 opacity-60'
        }`}
    >
      <div className="flex items-center gap-1 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-white">{name}</span>
        <span className="ml-auto text-xs text-yellow-400">Nv.{level}</span>
      </div>
      <span className="text-xs text-gray-400 mb-1">{description}</span>
      <div className="text-[10px] text-gray-500 space-x-1">
        {cost.wood > 0 && <span>🪵{cost.wood}</span>}
        {cost.food > 0 && <span>🍖{cost.food}</span>}
        {cost.scrap > 0 && <span>⚙️{cost.scrap}</span>}
      </div>
    </button>
  );
}

function AdButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-1 bg-yellow-700 hover:bg-yellow-600
        disabled:opacity-50 text-xs text-white py-2 px-2 rounded-lg transition-all active:scale-95"
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          <span>📺</span>
          <span className="text-[10px]">{label}</span>
        </>
      )}
    </button>
  );
}
