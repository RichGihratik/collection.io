import { ThemeMode, useThemeMode } from '@/entities/theme-mode';
import { useTheme } from '@/entities/theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';

const MODE_RING = Object.values(ThemeMode);

export function useThemeSwitch() {
  const { mode, setMode } = useThemeMode();
  const { muiTheme, updateOptions, datatableTheme } = useTheme();

  const index = MODE_RING.indexOf(mode);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const selectedMode =
    mode === ThemeMode.System
      ? prefersDarkMode
        ? ThemeMode.Dark
        : ThemeMode.Light
      : mode;

  useEffect(() => {
    updateOptions({
      muiTheme:
        muiTheme.palette.mode !== selectedMode
          ? {
              palette: {
                mode: selectedMode,
              },
            }
          : undefined,
      datatableTheme:
        datatableTheme !== selectedMode ? selectedMode : undefined,
    });
  }, [selectedMode, datatableTheme, muiTheme.palette.mode, updateOptions]);

  function switchMode() {
    const nextIndex = index + 1 >= MODE_RING.length ? 0 : index + 1;
    const nextMode = MODE_RING[nextIndex];

    setMode(nextMode);
  }

  return switchMode;
}
