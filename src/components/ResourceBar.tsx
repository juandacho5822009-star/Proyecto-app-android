import { useGame } from '../store/GameContext';

export function ResourceBar() {
  const { state } = useGame();
  const { resources, upgrades } = state;

  const rateWood = upgrades.sawmill.perSecond;
  const rateFood = upgrades.farm.perSecond;
  const rateScrap = upgrades.workshop.perSecond;

  return (
    <div className="bg-gray-900 border-b border-green-800 px-3 py-2 flex justify-around text-sm">
      <ResourceItem icon="🪵" label="Madera" value={resources.wood} rate={rateWood} />
      <ResourceItem icon="🍖" label="Comida"  value={resources.food}  rate={rateFood} />
      <ResourceItem icon="⚙️" label="Chatarra" value={resources.scrap} rate={rateScrap} />
    </div>
  );
}

function ResourceItem({
  icon, label, value, rate,
}: {
  icon: string; label: string; value: number; rate: number;
}) {
  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-green-400 font-bold text-sm">{Math.floor(value)}</span>
      <span className="text-gray-500 text-[10px]">+{rate.toFixed(1)}/s</span>
    </div>
  );
}
