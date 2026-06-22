import { useState } from 'react';
import { GameProvider, useGame } from './store/GameContext';
import { HUD } from './components/HUD';
import { GameScene } from './components/GameScene';
import { ActionBar, type Modal } from './components/ActionBar';
import { UpgradeModal } from './components/UpgradeModal';
import { ShopModal } from './components/ShopModal';
import { WorldMapModal } from './components/WorldMapModal';
import { GameOverScreen } from './components/GameOverScreen';

function GameUI() {
  const { state, dispatch } = useGame();
  const [modal, setModal] = useState<Modal>(null);

  const handleCabinClick = () => {
    dispatch({ type: 'CLICK_CABIN' });
  };

  return (
    <div className="relative flex flex-col w-full h-screen max-h-screen bg-gray-950 overflow-hidden max-w-md mx-auto">
      {/* Main scene — fills available space */}
      <div className="relative flex-1 overflow-hidden">
        <GameScene onCabinClick={handleCabinClick} />
        {/* HUD overlaid on scene */}
        <HUD />
      </div>

      {/* Bottom action bar */}
      <ActionBar onOpen={setModal} />

      {/* Modals */}
      {modal === 'upgrade' && <UpgradeModal onClose={() => setModal(null)} />}
      {modal === 'shop'    && <ShopModal    onClose={() => setModal(null)} />}
      {modal === 'map'     && <WorldMapModal onClose={() => setModal(null)} />}

      {/* Game Over */}
      {state.gameOver && <GameOverScreen />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}
