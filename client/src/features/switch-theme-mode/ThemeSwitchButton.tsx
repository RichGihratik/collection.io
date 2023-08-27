import { IconButton } from '@mui/material';
import { useThemeSwitch } from './use-theme-switch';
import { ThemeModeIcon } from './ThemeModeIcon';

export function ThemeSwitchButton() {
  const switchMode = useThemeSwitch();

  return (
    <IconButton sx={{ mx: 1 }} onClick={switchMode}>
      <ThemeModeIcon/>
    </IconButton>
  );
}
