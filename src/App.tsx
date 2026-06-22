import { useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { ResourceBar } from './components/ResourceBar';
import { WaveIndicator } from './components/WaveIndicator';
import { CabinView } from './components/CabinView';
import { DefensePanel } from './components/DefensePanel';
import { MapView } from './components/MapView';
import { GameOverScreen } from './components/GameOverScreen';

type Tab = 'cabin' | 'defense' | 'map';

function GameUI() {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('cabin');

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-gray-900 px-3 py-2 border-b border-green-900 flex items-center justify-between">
        <h1 className="text-green-400 font-bold text-sm tracking-wide">🧟 Zombie Cabaña Conquest</h1>
        <span className="text-xs text-gray-500">Oleada {state.wave.number}</span>
      </div>

      {/* Resources */}
      <ResourceBar />

      {/* Wave / HP status */}
      <WaveIndicator />

      {/* Tab content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'cabin' && <CabinView />}
        {activeTab === 'defense' && <DefensePanel />}
        {activeTab === 'map' && <MapView />}
      </div>

      {/* Bottom Tab Navigation */}
      <nav className="bg-gray-900 border-t border-green-900 flex">
        <TabButton
          label="Cabaña"
          icon="🏠"
          active={activeTab === 'cabin'}
          onClick={() => setActiveTab('cabin')}
          alert={state.wave.isActive}
        />
        <TabButton
          label="Defensa"
          icon="🧱"
          active={activeTab === 'defense'}
          onClick={() => setActiveTab('defense')}
          alert={state.upgrades.barricade.hp < state.upgrades.barricade.maxHp * 0.3}
        />
        <TabButton
          label="Mapa"
          icon="🗺️"
          active={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
        />
      </nav>

      {/* Game Over overlay */}
      {state.gameOver && <GameOverScreen />}
    </div>
  );
}

function TabButton({
  label, icon, active, onClick, alert = false,
}: {
  label: string; icon: string; active: boolean; onClick: () => void; alert?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center py-2 text-xs transition-all relative
        ${active ? 'text-green-400 bg-gray-800' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {alert && (
        <span className="absolute top-1 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
      <span className="text-xl leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}
