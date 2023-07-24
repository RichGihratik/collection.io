import { ReactNode, createContext, useState } from 'react';
import { loadMode, saveMode } from './localstorage';
import { ThemeMode } from './mode';

interface ThemeModeValue {
  readonly mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeValue | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode[] | ReactNode }) {
  const [mode, setModeState] = useState(loadMode() ?? ThemeMode.System);

  function setMode(mode: ThemeMode) {
    setModeState(mode);
    saveMode(mode);
  }

  return (
    <ThemeModeContext.Provider value={{mode, setMode}}>
      {children}
    </ThemeModeContext.Provider>
  );
}
