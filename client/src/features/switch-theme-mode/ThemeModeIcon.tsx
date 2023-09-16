import { LightMode, DarkMode, Computer } from '@mui/icons-material';
import { ThemeMode, useThemeMode } from '@/entities/theme-mode';

export function ThemeModeIcon() {
  const { mode } = useThemeMode();

  const className = 'text-white';

  switch (mode) {
    case ThemeMode.Dark:
      return <DarkMode className={className} />;
    case ThemeMode.Light:
      return <LightMode className={className} />;
    case ThemeMode.System:
      return <Computer className={className} />;
  }
}
