import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { useRewardedAd } from '../hooks/useAds';
import { UPGRADE_HAMMER_COST_GOLD } from '../constants/gameConfig';
import { ModalOverlay } from './UpgradeModal';

export function ShopModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const { watchAd } = useRewardedAd();
  const [adLoading, setAdLoading] = useState(false);

  const handleWatchAd = async () => {
    setAdLoading(true);
    await watchAd('gold_boost');
    setAdLoading(false);
  };

  const canBuyHammer = state.resources.gold >= UPGRADE_HAMMER_COST_GOLD;

  return (
    <ModalOverlay onClose={onClose}>
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 drop-shadow">
          🏪 ZOMBIE ARMORY SHOP
        </h2>
        <p className="text-gray-500 text-xs">Equípate para sobrevivir</p>
      </div>

      <div className="space-y-3">
        {/* Gem Pack - IAP */}
        <ShopItem
          icon="💎"
          title="GEM PACK"
          subtitle="Hard Currency"
          label="10 Gemas"
          badge="PREMIUM"
          badgeColor="bg-purple-700"
          action={
            <button className="bg-green-700 hover:bg-green-600 text-white font-bold
              py-2 px-4 rounded-lg text-sm active:scale-95 transition-transform">
              BUY: $0.99
            </button>
          }
        />

        {/* Reward Box - Watch Ad */}
        <ShopItem
          icon="🎁"
          title="REWARD BOX"
          subtitle="Premium Consumable"
          label="+1,000 🪙 Gratis"
          badge="GRATIS"
          badgeColor="bg-blue-700"
          action={
            <button
              onClick={handleWatchAd}
              disabled={adLoading}
              className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50
                text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-1
                active:scale-95 transition-transform"
            >
              {adLoading ? <span className="animate-spin">⏳</span> : <span>📺</span>}
              <span>WATCH AD</span>
            </button>
          }
        />

        {/* Upgrade Hammer - Soft currency */}
        <ShopItem
          icon="🔨"
          title="UPGRADE HAMMER"
          subtitle="Soft Currency"
          label="Mejora instantánea ×2"
          badge="HOT"
          badgeColor="bg-red-700"
          action={
            <button
              onClick={() => dispatch({ type: 'BUY_UPGRADE_HAMMER' })}
              disabled={!canBuyHammer}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40
                text-white font-bold py-2 px-3 rounded-lg text-xs flex flex-col items-center
                active:scale-95 transition-transform"
            >
              <span className="text-yellow-300">🪙 {UPGRADE_HAMMER_COST_GOLD.toLocaleString()}</span>
              <span className="text-[9px] text-gray-300">GOLD</span>
            </button>
          }
        />

        {/* Barricade Repair */}
        <ShopItem
          icon="🧱"
          title="REPARAR BARRICADA"
          subtitle="Emergencia"
          label="Barricada al 100% HP"
          badge="⚡"
          badgeColor="bg-orange-700"
          action={
            <button
              onClick={async () => {
                setAdLoading(true);
                await watchAd('repair_barricade');
                setAdLoading(false);
                onClose();
              }}
              disabled={adLoading}
              className="bg-orange-700 hover:bg-orange-600 disabled:opacity-50
                text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center gap-1
                active:scale-95 transition-transform"
            >
              📺 <span className="text-xs">VER AD</span>
            </button>
          }
        />
      </div>

      {/* Resources display */}
      <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
        <span>🪙 {Math.floor(state.resources.gold)}</span>
        <span>💎 {state.resources.gems}</span>
      </div>
    </ModalOverlay>
  );
}

function ShopItem({
  icon, title, subtitle, label, badge, badgeColor, action,
}: {
  icon: string; title: string; subtitle: string; label: string;
  badge: string; badgeColor: string; action: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex items-center gap-3">
      <div className="relative">
        <div className="text-4xl leading-none w-14 h-14 bg-gray-700 rounded-xl
          flex items-center justify-center text-3xl">
          {icon}
        </div>
        <span className={`absolute -top-1 -right-1 ${badgeColor} text-white
          text-[8px] font-bold rounded px-1 py-0.5`}>
          {badge}
        </span>
      </div>
      <div className="flex-1">
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-gray-500 text-[10px]">{subtitle}</div>
        <div className="text-green-400 text-xs mt-0.5">{label}</div>
      </div>
      <div>{action}</div>
    </div>
  );
}
