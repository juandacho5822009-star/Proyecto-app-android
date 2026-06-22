import { useGame } from '../store/GameContext';
import { canAfford } from '../constants/gameConfig';
import type { Resources } from '../types/game';
import type { GameAction } from '../types/game';

interface UpgradeItem {
  icon: string;
  name: string;
  desc: string;
  level: number;
  cost: Resources;
  action: GameAction['type'];
  stat: string;
}

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const { upgrades, resources } = state;

  const items: UpgradeItem[] = [
    {
      icon: '🧱', name: 'Barricada', level: upgrades.barricade.level,
      desc: `HP: ${upgrades.barricade.maxHp} → ${Math.floor(upgrades.barricade.maxHp * 1.6)}`,
      cost: upgrades.barricade.upgradeCost, action: 'UPGRADE_BARRICADE',
      stat: `HP actual: ${Math.floor(upgrades.barricade.hp)}/${upgrades.barricade.maxHp}`,
    },
    {
      icon: '🪤', name: 'Trampas', level: upgrades.traps.level,
      desc: `DMG: ${upgrades.traps.damage} → ${Math.floor(upgrades.traps.damage * 1.4)}/s`,
      cost: upgrades.traps.upgradeCost, action: 'UPGRADE_TRAPS',
      stat: `Daño actual: ${upgrades.traps.damage}/s`,
    },
    {
      icon: '🗼', name: 'Atalaya', level: upgrades.watchtower.level,
      desc: `DMG: ${upgrades.watchtower.damage} → ${Math.floor(upgrades.watchtower.damage * 1.4)}/s`,
      cost: upgrades.watchtower.upgradeCost, action: 'UPGRADE_WATCHTOWER',
      stat: `Daño actual: ${upgrades.watchtower.damage}/s`,
    },
    {
      icon: '🪚', name: 'Aserradero', level: upgrades.sawmill.level,
      desc: `+${(upgrades.sawmill.perSecond * 1.5).toFixed(1)}/s 🪵`,
      cost: upgrades.sawmill.upgradeCost, action: 'UPGRADE_SAWMILL',
      stat: `Actual: +${upgrades.sawmill.perSecond}/s 🪵`,
    },
    {
      icon: '🌾', name: 'Granja', level: upgrades.farm.level,
      desc: `+${(upgrades.farm.perSecond * 1.5).toFixed(1)}/s 🍖`,
      cost: upgrades.farm.upgradeCost, action: 'UPGRADE_FARM',
      stat: `Actual: +${upgrades.farm.perSecond}/s 🍖`,
    },
    {
      icon: '🔧', name: 'Taller', level: upgrades.workshop.level,
      desc: `+${(upgrades.workshop.perSecond * 1.5).toFixed(1)}/s ⚙️`,
      cost: upgrades.workshop.upgradeCost, action: 'UPGRADE_WORKSHOP',
      stat: `Actual: +${upgrades.workshop.perSecond}/s ⚙️`,
    },
  ];

  return (
    <ModalOverlay onClose={onClose}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 drop-shadow">🔧 MENÚ DE MEJORAS</h2>
        <p className="text-gray-400 text-xs mt-1">Fortalece tu cabaña contra los muertos</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const affordable = canAfford(resources, item.cost);
          return (
            <button
              key={item.action}
              onClick={() => dispatch({ type: item.action as GameAction['type'] } as GameAction)}
              className={`flex flex-col p-3 rounded-xl border text-left transition-all active:scale-95
                ${affordable
                  ? 'bg-gray-800 border-yellow-700 hover:bg-gray-700'
                  : 'bg-gray-900 border-gray-700 opacity-60'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-white text-xs font-bold">{item.name}</div>
                  <div className="text-yellow-400 text-[10px]">Nv.{item.level}</div>
                </div>
              </div>
              <div className="text-green-400 text-[10px] mb-1">▲ {item.desc}</div>
              <div className="text-gray-500 text-[9px] mb-2">{item.stat}</div>
              <CostChips cost={item.cost} />
            </button>
          );
        })}
      </div>
    </ModalOverlay>
  );
}

function CostChips({ cost }: { cost: Resources }) {
  return (
    <div className="flex flex-wrap gap-1">
      {cost.gold > 0 && <Chip icon="🪙" val={cost.gold} />}
      {cost.wood > 0 && <Chip icon="🪵" val={cost.wood} />}
      {cost.food > 0 && <Chip icon="🍖" val={cost.food} />}
      {cost.scrap > 0 && <Chip icon="⚙️" val={cost.scrap} />}
    </div>
  );
}

function Chip({ icon, val }: { icon: string; val: number }) {
  return (
    <span className="bg-gray-700 text-gray-300 text-[9px] rounded px-1 py-0.5">
      {icon}{val}
    </span>
  );
}

export function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-gray-900 border-t-2 border-yellow-800
        rounded-t-3xl px-4 pt-4 pb-6 max-h-[85vh] overflow-y-auto modal-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-800 text-gray-400 rounded-xl text-sm border border-gray-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
