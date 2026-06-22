import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';
import { gameReducer, buildInitialState } from './gameReducer';
import { saveGame, loadGame } from './persistence';
import { TICK_MS } from '../constants/gameConfig';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const saved = loadGame();
  const [state, dispatch] = useReducer(gameReducer, saved ?? buildInitialState());

  const lastTickRef = useRef<number>(Date.now());
  const accRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      const now = Date.now();
      accRef.current += now - lastTickRef.current;
      lastTickRef.current = now;
      if (accRef.current >= TICK_MS) {
        const ticks = Math.floor(accRef.current / TICK_MS);
        accRef.current -= ticks * TICK_MS;
        dispatch({ type: 'TICK', payload: { delta: ticks } });
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => saveGame(state), 5000);
    return () => clearInterval(id);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
