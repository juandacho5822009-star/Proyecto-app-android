import { useGame } from '../store/GameContext';
import { canAfford, getTileDifficulty, TILE_COSTS, TILE_ZOMBIES, MAP_SIZE } from '../constants/gameConfig';

const TILE_LABELS: Record<string, string> = {
  easy:   '🌿',
  medium: '🏚️',
  hard:   '🏭',
};

export function MapView() {
  const { state, dispatch } = useGame();
  const { territory, resources } = state;

  const isAdjacentToOwned = (row: number, col: number): boolean =>
    territory.some((tRow) =>
      tRow.some((t) => t.owned && Math.abs(t.row - row) + Math.abs(t.col - col) === 1)
    );

  return (
    <div className="px-3 py-3">
      <h2 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">
        Territorio
      </h2>
      <div
        className="grid gap-1 mx-auto"
        style={{ gridTemplateColumns: `repeat(${MAP_SIZE}, 1fr)`, maxWidth: 280 }}
      >
        {territory.flat().map((tile) => {
          const center = Math.floor(MAP_SIZE / 2);
          const isCenter = tile.row === center && tile.col === center;
          const diff = getTileDifficulty(tile.row, tile.col);
          const cost = TILE_COSTS[diff];
          const adjacent = isAdjacentToOwned(tile.row, tile.col);
          const affordable = canAfford(resources, cost);
          const attackable = !tile.owned && adjacent;

          return (
            <button
              key={`${tile.row}-${tile.col}`}
              onClick={() => {
                if (attackable) {
                  dispatch({ type: 'ATTACK_TILE', payload: { row: tile.row, col: tile.col } });
                }
              }}
              disabled={tile.owned || (!attackable)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 text-center transition-all
                ${tile.owned
                  ? 'bg-green-900 border border-green-600 cursor-default'
                  : attackable && affordable
                    ? 'bg-gray-700 border border-yellow-600 hover:bg-gray-600 active:scale-95'
                    : attackable && !affordable
                      ? 'bg-gray-800 border border-red-800 opacity-70'
                      : 'bg-gray-900 border border-gray-700 opacity-40 cursor-not-allowed'
                }`}
            >
              <span className="text-2xl leading-none">
                {tile.owned ? (isCenter ? '🏠' : '✅') : TILE_LABELS[diff]}
              </span>
              {!tile.owned && (
                <div className="mt-0.5 text-[9px] leading-tight">
                  <div className="text-red-400">🧟{TILE_ZOMBIES[diff]}</div>
                  <div className="text-gray-400">
                    {cost.wood > 0 && `🪵${cost.wood} `}
                    {cost.food > 0 && `🍖${cost.food} `}
                    {cost.scrap > 0 && `⚙️${cost.scrap}`}
                  </div>
                </div>
              )}
              {tile.owned && !isCenter && (
                <div className="text-[9px] text-green-400">+Bonus</div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-gray-600 text-xs mt-2">
        Tiles adyacentes resaltados en amarillo
      </p>
    </div>
  );
}
