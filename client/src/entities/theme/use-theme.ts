import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('Context for theme was not defined');

  return value;
}
