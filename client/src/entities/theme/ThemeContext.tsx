import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material';
import { ReactNode, createContext } from 'react';
import { useDefineTheme, type Themes } from './define-theme';

interface ThemesValue {
  datatableTheme: string | null;
  muiTheme: Theme;
  updateOptions: (opts: Partial<Themes>) => void;
}

export const ThemeContext = createContext<ThemesValue | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const themeInfo = useDefineTheme();

  return (
    <ThemeContext.Provider value={themeInfo}>
      <MuiThemeProvider theme={themeInfo.muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
