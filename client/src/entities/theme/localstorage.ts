import { ThemeMode } from './mode';

const THEME_STORAGE_KEY = 'THEME_MODE';

function isThemeValue(item: unknown): item is ThemeMode {
  return typeof item === 'string' && Object.keys(ThemeMode).includes(item);
}

export function loadTheme() {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  if (!isThemeValue(value)) return undefined;
  return value;
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
