import type { GameState } from '../data/GameState';

const KEY = 'zcc_v3';

export const SaveManager = {
  save(state: GameState): void {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* full */ }
  },
  load(): GameState | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as GameState) : null;
    } catch { return null; }
  },
  clear(): void { localStorage.removeItem(KEY); },
};
