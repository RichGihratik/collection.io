import { useContext } from 'react';
import { ThemeModeContext } from './ThemeModeProvider';

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx)
    throw new Error(
      'ThemeModeProvider was not found. Be sure to put it as parent',
    );
  return ctx;
}
