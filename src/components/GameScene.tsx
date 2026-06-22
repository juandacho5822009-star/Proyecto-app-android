import { useRef, useState, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import type { ZombieUnit, ZombieType } from '../types/game';

// ─── Forest Background ───────────────────────────────────────────────
function ForestBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 390 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="60%" stopColor="#2d1b4e" />
          <stop offset="100%" stopColor="#1a2e1a" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a6b20" />
          <stop offset="100%" stopColor="#2a4f18" />
        </linearGradient>
        <radialGradient id="clearingGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4a8a28" />
          <stop offset="100%" stopColor="#2a5a18" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="390" height="480" fill="url(#skyGrad)" />

      {/* Ground */}
      <rect y="300" width="390" height="180" fill="url(#groundGrad)" />

      {/* Clearing ellipse */}
      <ellipse cx="195" cy="350" rx="170" ry="80" fill="url(#clearingGrad)" />

      {/* Stars */}
      {[30,70,110,150,200,240,280,320,360].map((x, i) => (
        <circle key={i} cx={x} cy={20 + (i % 3) * 25} r="1.5" fill="white" opacity="0.6" />
      ))}
      {[50,90,130,170,220,260,300,340].map((x, i) => (
        <circle key={i + 100} cx={x} cy={40 + (i % 4) * 15} r="1" fill="white" opacity="0.4" />
      ))}

      {/* Trees — Left cluster */}
      <Tree x={0}   y={280} w={60}  h={160} shade={0} />
      <Tree x={35}  y={240} w={70}  h={180} shade={1} />
      <Tree x={65}  y={260} w={55}  h={160} shade={0} />
      <Tree x={90}  y={250} w={65}  h={170} shade={2} />
      <Tree x={115} y={270} w={50}  h={150} shade={1} />

      {/* Trees — Right cluster */}
      <Tree x={250} y={270} w={50}  h={150} shade={1} />
      <Tree x={275} y={250} w={65}  h={170} shade={2} />
      <Tree x={300} y={260} w={55}  h={160} shade={0} />
      <Tree x={325} y={240} w={70}  h={180} shade={1} />
      <Tree x={355} y={280} w={60}  h={160} shade={0} />

      {/* Background trees (darker, smaller) */}
      <Tree x={20}  y={210} w={40}  h={110} shade={3} />
      <Tree x={60}  y={200} w={35}  h={100} shade={3} />
      <Tree x={290} y={200} w={35}  h={100} shade={3} />
      <Tree x={330} y={210} w={40}  h={110} shade={3} />

      {/* Torches (appear with upgrades) */}
      <Torch x={155} y={360} />
      <Torch x={230} y={360} />

      {/* Ground path */}
      <ellipse cx="195" cy="430" rx="60" ry="20" fill="#3a5a18" opacity="0.6" />
    </svg>
  );
}

const TREE_COLORS = [
  ['#1c4a1a', '#2a6b26', '#1a3a18'],
  ['#1e5218', '#2e7a24', '#1a4016'],
  ['#174018', '#256020', '#133214'],
  ['#122e12', '#1e4a1e', '#0e2410'],
];

function Tree({ x, y, w, h, shade }: { x: number; y: number; w: number; h: number; shade: number }) {
  const [dark, mid] = TREE_COLORS[shade];
  const cx = x + w / 2;
  const tw = w;
  return (
    <>
      {/* Trunk */}
      <rect x={cx - 5} y={y} width={10} height={20} fill="#4a2a0a" />
      {/* Bottom tier */}
      <polygon points={`${cx - tw/2},${y} ${cx + tw/2},${y} ${cx},${y - h * 0.45}`} fill={dark} />
      {/* Mid tier */}
      <polygon points={`${cx - tw*0.38},${y - h*0.35} ${cx + tw*0.38},${y - h*0.35} ${cx},${y - h*0.75}`} fill={mid} />
      {/* Top tier */}
      <polygon points={`${cx - tw*0.22},${y - h*0.6} ${cx + tw*0.22},${y - h*0.6} ${cx},${y - h}`} fill={dark} />
    </>
  );
}

function Torch({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x - 2} y={y - 25} width={4} height={25} fill="#5c3a1a" />
      <ellipse cx={x} cy={y - 27} rx={5} ry={7} fill="#ff8c00" opacity="0.9" />
      <ellipse cx={x} cy={y - 30} rx={3} ry={4} fill="#ffcc00" opacity="0.8" />
    </>
  );
}

// ─── Cabin + Fortifications ───────────────────────────────────────────
function CabinFortress({ barricadeLevel, watchtowerLevel }: { barricadeLevel: number; watchtowerLevel: number }) {
  const hasFence = barricadeLevel >= 2;
  const hasWalls = barricadeLevel >= 3;
  const hasTowers = watchtowerLevel >= 2;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 390 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Palisade fence - level 2+ barricade */}
      {hasFence && <PalisadeFence hasWalls={hasWalls} />}

      {/* Watchtowers - watchtower level 2+ */}
      {hasTowers && (
        <>
          <Watchtower x={140} y={300} />
          <Watchtower x={230} y={300} />
        </>
      )}

      {/* Main cabin */}
      <Cabin x={195} y={370} />
    </svg>
  );
}

function PalisadeFence({ hasWalls }: { hasWalls: boolean }) {
  const color = hasWalls ? '#6b4423' : '#8b6040';
  const stakes: number[] = [];
  for (let i = 0; i < 14; i++) stakes.push(i);
  const leftX = 128, rightX = 258, topY = 330, botY = 400;

  return (
    <>
      {/* Top row */}
      {stakes.slice(0, 7).map((_, i) => {
        const x = leftX + i * (rightX - leftX) / 6;
        return <Stake key={`t${i}`} x={x} y={topY} color={color} />;
      })}
      {/* Bottom left and right stakes */}
      {[leftX, rightX].map((sx, si) =>
        [topY, topY + 25, topY + 50].map((sy, yi) => (
          <Stake key={`s${si}-${yi}`} x={sx} y={sy} color={color} />
        ))
      )}
      {/* Horizontal beams */}
      <rect x={leftX} y={topY + 10} width={rightX - leftX} height={5} fill={color} opacity="0.8" rx="2" />
      <rect x={leftX} y={topY + 35} width={rightX - leftX} height={5} fill={color} opacity="0.6" rx="2" />
    </>
  );
}

function Stake({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      <rect x={x - 4} y={y} width={8} height={30} fill={color} rx="1" />
      <polygon points={`${x - 4},${y} ${x + 4},${y} ${x},${y - 8}`} fill={color} />
    </>
  );
}

function Watchtower({ x, y }: { x: number; y: number }) {
  return (
    <>
      {/* Legs */}
      <line x1={x - 12} y1={y + 40} x2={x} y2={y} stroke="#5c3a1a" strokeWidth="4" />
      <line x1={x + 12} y1={y + 40} x2={x} y2={y} stroke="#5c3a1a" strokeWidth="4" />
      {/* Platform */}
      <rect x={x - 16} y={y - 5} width={32} height={8} fill="#6b4a22" rx="2" />
      {/* Tower body */}
      <rect x={x - 10} y={y - 30} width={20} height={25} fill="#7a5530" rx="2" />
      {/* Roof */}
      <polygon points={`${x - 12},${y - 30} ${x + 12},${y - 30} ${x},${y - 48}`} fill="#5c3a1a" />
      {/* Torch */}
      <rect x={x - 1} y={y - 20} width={2} height={10} fill="#8b6040" />
      <ellipse cx={x} cy={y - 22} rx={3} ry={4} fill="#ff8c00" opacity="0.9" />
    </>
  );
}

function Cabin({ x, y }: { x: number; y: number }) {
  return (
    <>
      {/* Shadow */}
      <ellipse cx={x} cy={y + 5} rx={55} ry={12} fill="#000" opacity="0.3" />

      {/* Main body */}
      <rect x={x - 48} y={y - 55} width={96} height={60} fill="#8b5e2e" rx="3" />
      {/* Wall detail (log lines) */}
      {[0, 12, 24, 36, 48].map((dy) => (
        <line key={dy} x1={x - 48} y1={y - 55 + dy} x2={x + 48} y2={y - 55 + dy}
          stroke="#6b4423" strokeWidth="2" opacity="0.5" />
      ))}

      {/* Roof */}
      <polygon points={`${x - 58},${y - 55} ${x + 58},${y - 55} ${x},${y - 95}`} fill="#5c3a1a" />
      <polygon points={`${x - 52},${y - 55} ${x + 52},${y - 55} ${x},${y - 90}`} fill="#6b4a22" />

      {/* Door */}
      <rect x={x - 12} y={y - 30} width={24} height={30} fill="#4a2a0a" rx="2" />
      <rect x={x - 10} y={y - 28} width={20} height={26} fill="#3a1e08" rx="1" />
      <circle cx={x + 7} cy={y - 14} r={2} fill="#c8a060" />

      {/* Windows */}
      <rect x={x - 42} y={y - 48} width={18} height={14} fill="#4a2a0a" rx="2" />
      <rect x={x + 24} y={y - 48} width={18} height={14} fill="#4a2a0a" rx="2" />
      {/* Window glow */}
      <rect x={x - 40} y={y - 46} width={14} height={10} fill="#ffcc66" opacity="0.5" rx="1" />
      <rect x={x + 26} y={y - 46} width={14} height={10} fill="#ffcc66" opacity="0.5" rx="1" />

      {/* Chimney */}
      <rect x={x + 18} y={y - 105} width={14} height={30} fill="#7a5030" rx="1" />

      {/* Smoke particles (simple circles) */}
      <circle cx={x + 25} cy={y - 112} r={5} fill="#aaa" opacity="0.3" />
      <circle cx={x + 22} cy={y - 120} r={4} fill="#bbb" opacity="0.2" />
    </>
  );
}

// ─── Zombie Sprites ───────────────────────────────────────────────────
const ZOMBIE_CONFIGS: Record<ZombieType, { skin: string; clothes: string; accent: string; scale: number }> = {
  basic:        { skin: '#7a9e6a', clothes: '#4a6a3a', accent: '#8a8a7a', scale: 1.0 },
  soldier:      { skin: '#7a9e6a', clothes: '#3a5a2a', accent: '#4a6a3a', scale: 1.1 },
  construction: { skin: '#8aaa6a', clothes: '#8b6030', accent: '#f5a000', scale: 1.1 },
  chef:         { skin: '#7a9e6a', clothes: '#d0d0d0', accent: '#ffffff', scale: 1.0 },
  boss:         { skin: '#5a7a5a', clothes: '#2a3a2a', accent: '#aa0000', scale: 1.8 },
};

function ZombieSprite({ unit, flipped }: { unit: ZombieUnit; flipped: boolean }) {
  const c = ZOMBIE_CONFIGS[unit.type];
  const s = c.scale;
  const w = 40 * s, h = 70 * s;
  const hpPercent = unit.hp / unit.maxHp;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* HP bar */}
      {unit.type === 'boss' && (
        <div style={{ width: w, height: 4, background: '#333', borderRadius: 2, marginBottom: 2 }}>
          <div style={{ width: `${hpPercent * 100}%`, height: '100%', background: '#e53', borderRadius: 2 }} />
        </div>
      )}
      <svg width={w} height={h} viewBox="0 0 40 70"
        style={{ transform: flipped ? 'scaleX(-1)' : 'none', display: 'block' }}>
        {/* Head */}
        <ellipse cx="20" cy="13" rx="11" ry="12" fill={c.skin} />
        {/* Hat */}
        {unit.type === 'basic' && <>
          <rect x="12" y="3" width="16" height="10" rx="2" fill={c.accent} />
          <rect x="10" y="11" width="20" height="3" rx="1" fill={c.accent} />
        </>}
        {unit.type === 'soldier' && <>
          <ellipse cx="20" cy="6" rx="13" ry="6" fill={c.accent} />
        </>}
        {unit.type === 'construction' && <>
          <ellipse cx="20" cy="6" rx="13" ry="5" fill={c.accent} />
        </>}
        {unit.type === 'chef' && <>
          <rect x="14" y="1" width="12" height="14" rx="3" fill={c.accent} />
        </>}
        {unit.type === 'boss' && <>
          <ellipse cx="20" cy="5" rx="14" ry="6" fill="#222" />
          <rect x="10" y="1" width="20" height="4" rx="1" fill={c.accent} />
        </>}

        {/* Eyes */}
        <circle cx="15" cy="14" r="2.5" fill="#cc3333" />
        <circle cx="25" cy="14" r="2.5" fill="#cc3333" />
        <circle cx="15.5" cy="14.5" r="1" fill="#ff5555" />
        <circle cx="25.5" cy="14.5" r="1" fill="#ff5555" />

        {/* Mouth */}
        <path d="M15 19 Q20 22 25 19" stroke="#2a1a0a" strokeWidth="1.5" fill="none" />

        {/* Neck */}
        <rect x="17" y="23" width="6" height="5" fill={c.skin} />

        {/* Body */}
        <rect x="11" y="27" width="18" height="22" rx="3" fill={c.clothes} />

        {/* Outstretched arms */}
        <rect x="1" y="27" width="11" height="7" rx="3.5" fill={c.skin}
          transform="rotate(-15 6 30)" />
        <rect x="28" y="22" width="11" height="7" rx="3.5" fill={c.skin}
          transform="rotate(20 34 25)" />

        {/* Legs */}
        <rect x="12" y="49" width="8" height="18" rx="3" fill={c.clothes} />
        <rect x="20" y="49" width="8" height="18" rx="3" fill={c.clothes} />

        {/* Feet */}
        <rect x="10" y="64" width="10" height="5" rx="2" fill="#2a1a0a" />
        <rect x="20" y="64" width="10" height="5" rx="2" fill="#2a1a0a" />
      </svg>
    </div>
  );
}

// ─── Zombie Layer ─────────────────────────────────────────────────────
const LANE_Y = [310, 330, 350, 330, 310]; // vertical positions per lane

function ZombieLayer({ units }: { units: ZombieUnit[] }) {
  return (
    <>
      {units.map((unit) => {
        const y = LANE_Y[unit.lane] ?? 340;
        const isLeft = unit.side === 'left';
        return (
          <div
            key={unit.id}
            className={`absolute zombie-walk`}
            style={{
              bottom: `calc(100% - ${y / 4.8}%)`,
              [isLeft ? 'left' : 'right']: '-10px',
              animationDuration: unit.type === 'boss' ? '12s' : '8s',
              animationDelay: `${unit.lane * 0.3}s`,
              transform: `scale(${ZOMBIE_CONFIGS[unit.type].scale * 0.7})`,
            }}
          >
            <ZombieSprite unit={unit} flipped={!isLeft} />
          </div>
        );
      })}
    </>
  );
}

// ─── Click Feedback ───────────────────────────────────────────────────
interface ClickPop { id: number; x: number; y: number }
let popId = 0;

// ─── Main GameScene ───────────────────────────────────────────────────
export function GameScene({ onCabinClick }: { onCabinClick: () => void }) {
  const { state } = useGame();
  const { wave, upgrades } = state;
  const [pops, setPops] = useState<ClickPop[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    onCabinClick();
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    let cx: number, cy: number;
    if ('touches' in e) { cx = e.touches[0].clientX - rect.left; cy = e.touches[0].clientY - rect.top; }
    else { cx = e.clientX - rect.left; cy = e.clientY - rect.top; }
    const pop: ClickPop = { id: popId++, x: cx, y: cy };
    setPops(prev => [...prev, pop]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== pop.id)), 800);
  };

  // Shake effect during attacks
  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (wave.isActive && wave.zombiesAlive > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 400);
      return () => clearTimeout(t);
    }
  }, [Math.floor(wave.nextWaveCountdown), wave.isActive]);

  return (
    <div
      ref={sceneRef}
      className={`relative w-full flex-1 overflow-hidden cursor-pointer select-none ${shaking ? 'scene-shake' : ''}`}
      onClick={handleTap}
      onTouchStart={handleTap}
      style={{ minHeight: 340 }}
    >
      {/* Background */}
      <ForestBackground />

      {/* Cabin + fortifications */}
      <CabinFortress
        barricadeLevel={upgrades.barricade.level}
        watchtowerLevel={upgrades.watchtower.level}
      />

      {/* Zombie units */}
      {wave.isActive && wave.activeUnits.length > 0 && (
        <ZombieLayer units={wave.activeUnits} />
      )}

      {/* Click pop feedback */}
      {pops.map(pop => (
        <div
          key={pop.id}
          className="absolute pointer-events-none text-yellow-300 font-bold text-sm click-pop z-30"
          style={{ left: pop.x - 20, top: pop.y - 30 }}
        >
          +🪙5
        </div>
      ))}

      {/* Barricade HP bar (bottom of scene) */}
      <div className="absolute bottom-2 left-4 right-4 z-10">
        <div className="flex justify-between text-xs text-gray-300 mb-0.5">
          <span>🧱 Barricada Nv.{upgrades.barricade.level}</span>
          <span>{Math.floor(upgrades.barricade.hp)}/{upgrades.barricade.maxHp}</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full border border-gray-600 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, (upgrades.barricade.hp / upgrades.barricade.maxHp) * 100)}%`,
              background: upgrades.barricade.hp > upgrades.barricade.maxHp * 0.5
                ? '#ca8a04' : upgrades.barricade.hp > upgrades.barricade.maxHp * 0.25
                  ? '#ea580c' : '#dc2626',
            }}
          />
        </div>
      </div>

      {/* Tap hint */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <span className="text-white/30 text-xs">Toca la pantalla para saquear</span>
      </div>
    </div>
  );
}
