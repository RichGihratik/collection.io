import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material';
import { ReactNode, createContext, useContext } from 'react';
import { useDefineTheme, type Themes } from './define-theme';

interface ThemesValue {
  datatableTheme: string | null;
  muiTheme: Theme;
  updateOptions: (opts: Partial<Themes>) => void;
}

const ThemeContext = createContext<ThemesValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const themeInfo = useDefineTheme();

  return (
    <ThemeContext.Provider value={themeInfo}>
      <MuiThemeProvider theme={themeInfo.muiTheme} >{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('Context for theme was not defined');

  return value;
}

