import { useRef, useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import { CLICK_POWER } from '../constants/gameConfig';

interface FloatText {
  id: number;
  x: number;
  y: number;
  value: string;
}

let floatId = 0;

export function CabinView() {
  const { state, dispatch } = useGame();
  const { wave, upgrades } = state;
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Shake when under attack
  useEffect(() => {
    if (wave.isActive && wave.zombiesAlive > 0) {
      setIsShaking(true);
      const t = setTimeout(() => setIsShaking(false), 300);
      return () => clearTimeout(t);
    }
  }, [wave.zombiesAlive, wave.isActive]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (state.gameOver) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    dispatch({ type: 'CLICK_CABIN', payload: { x, y } });

    const newFloat: FloatText = {
      id: floatId++,
      x,
      y,
      value: `+${CLICK_POWER.wood}🪵`,
    };
    setFloatTexts((prev) => [...prev, newFloat]);
    setTimeout(() => {
      setFloatTexts((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 900);
  };

  const barricadePercent = (upgrades.barricade.hp / upgrades.barricade.maxHp) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center py-6 cursor-pointer select-none
        ${isShaking ? 'animate-shake' : ''}`}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      {/* Float texts */}
      {floatTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute text-green-400 font-bold text-sm pointer-events-none z-10 animate-bounce"
          style={{
            left: ft.x,
            top: ft.y - 20,
            transform: 'translateX(-50%)',
            animation: 'floatUp 0.9s ease-out forwards',
          }}
        >
          {ft.value}
        </div>
      ))}

      {/* Cabin illustration */}
      <div className="relative text-center">
        {/* Zombie horde indicator */}
        {wave.isActive && (
          <div className="absolute -top-8 left-0 right-0 flex justify-center gap-1 flex-wrap">
            {Array.from({ length: Math.min(wave.zombiesAlive, 8) }).map((_, i) => (
              <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                🧟
              </span>
            ))}
            {wave.zombiesAlive > 8 && (
              <span className="text-red-400 text-xs self-center">+{wave.zombiesAlive - 8}</span>
            )}
          </div>
        )}

        {/* Main cabin emoji */}
        <div
          className={`text-8xl leading-none transition-transform active:scale-90
            ${wave.isActive ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]'}`}
        >
          🏠
        </div>

        <p className="text-gray-400 text-xs mt-1">Toca para saquear</p>
        <p className="text-green-400 text-xs">
          +{CLICK_POWER.wood}🪵 +{CLICK_POWER.food}🍖 +{CLICK_POWER.scrap}⚙️
        </p>
      </div>

      {/* Barricade visual */}
      <div className="mt-4 w-full px-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span>🧱 Barricada Nv.{upgrades.barricade.level}</span>
          <span className="ml-auto text-yellow-400">
            {Math.floor(upgrades.barricade.hp)}/{upgrades.barricade.maxHp}
          </span>
        </div>
        <div className="relative h-4 bg-gray-700 rounded border border-gray-600 overflow-hidden">
          <div
            className={`h-full rounded transition-all duration-300
              ${barricadePercent > 50 ? 'bg-yellow-600' : barricadePercent > 25 ? 'bg-orange-600' : 'bg-red-700'}`}
            style={{ width: `${Math.max(0, barricadePercent)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {'🧱'.repeat(Math.ceil(barricadePercent / 20))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>🧟 Muertos: {state.stats.zombiesKilled}</span>
        <span>👆 Clics: {state.stats.totalClicks}</span>
        <span>🌊 Oleadas: {state.stats.wavesSurvived}</span>
      </div>
    </div>
  );
}
