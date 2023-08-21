import { IconButton } from '@mui/material';
import { useThemeSwitch } from './use-theme-switch';
import { ThemeModeIcon } from './ThemeModeIcon';

export function ThemeSwitchButton() {
  const switchMode = useThemeSwitch();

  return (
    <IconButton onClick={switchMode}>
      <ThemeModeIcon />
    </IconButton>
  );
}
