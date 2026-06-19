import { createContext, useContext, type ReactNode } from "react";
import { useProgress, type ProgressActions, type ProgressState } from "./useProgress";

type ProgressContextValue = [ProgressState, ProgressActions];

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const value = useProgress();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext debe usarse dentro de <ProgressProvider>");
  return ctx;
}
