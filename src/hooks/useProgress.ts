import { useCallback, useEffect, useState } from "react";
import type { Character } from "../data/types";

export type ProgressState = {
  character: Character | null;
  completedLessons: string[];
  currentStreak: number;
  lastPlayedDate: string | null; // ISO date (yyyy-mm-dd) para calcular streak
  romajiVisible: boolean;
};

const STORAGE_KEY = "sakura:progress";

const initialState: ProgressState = {
  character: null,
  completedLessons: [],
  currentStreak: 0,
  lastPlayedDate: null,
  romajiVisible: true,
};

function load(): ProgressState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}

export type ProgressActions = {
  setCharacter: (c: Character) => void;
  completeLesson: (id: string) => void;
  toggleRomaji: () => void;
  isCompleted: (id: string) => boolean;
  reset: () => void;
};

export function useProgress(): [ProgressState, ProgressActions] {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento lleno o bloqueado: ignoramos */
    }
  }, [state]);

  const setCharacter = useCallback((c: Character) => {
    setState((s) => ({ ...s, character: c }));
  }, []);

  const completeLesson = useCallback((id: string) => {
    setState((s) => {
      const completed = s.completedLessons.includes(id)
        ? s.completedLessons
        : [...s.completedLessons, id];

      // Cálculo de streak
      const today = todayISO();
      let streak = s.currentStreak;
      if (s.lastPlayedDate !== today) {
        const gap = s.lastPlayedDate ? daysBetween(s.lastPlayedDate, today) : 1;
        streak = gap === 1 ? s.currentStreak + 1 : 1;
      } else if (streak === 0) {
        streak = 1;
      }

      return {
        ...s,
        completedLessons: completed,
        currentStreak: streak,
        lastPlayedDate: today,
      };
    });
  }, []);

  const toggleRomaji = useCallback(() => {
    setState((s) => ({ ...s, romajiVisible: !s.romajiVisible }));
  }, []);

  const isCompleted = useCallback(
    (id: string) => state.completedLessons.includes(id),
    [state.completedLessons],
  );

  const reset = useCallback(() => setState(initialState), []);

  return [state, { setCharacter, completeLesson, toggleRomaji, isCompleted, reset }];
}
