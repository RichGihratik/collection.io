import { MenuItem } from '@mui/material';
import { useThemeMode } from '@/entities/theme-mode';
import { useThemeSwitch } from './use-theme-switch';
import { ThemeModeIcon } from './ThemeModeIcon';

export function ThemeSwitchMenuItem() {
  const { mode } = useThemeMode();
  const switchMode = useThemeSwitch();

  return (
    <MenuItem onClick={switchMode}>
      <ThemeModeIcon/>
      Theme: {mode}
    </MenuItem>
  );
}
