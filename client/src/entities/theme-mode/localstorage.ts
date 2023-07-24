import { ThemeMode } from './mode';

const THEME_STORAGE_KEY = 'THEME_MODE';

function isThemeMode(item: unknown): item is ThemeMode {
  return typeof item === 'string' && Object.values(ThemeMode).includes(item as ThemeMode);
}

export function loadMode() {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  if (!isThemeMode(value)) return undefined;
  return value;
}

export function saveMode(mode: ThemeMode) {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}
