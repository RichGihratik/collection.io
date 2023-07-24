import { ThemeSwitchButton } from '@/features/switch-theme-mode';
import { AppBar, Toolbar, Typography } from '@mui/material';

export function HeaderBar() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Collection IO
        </Typography>
        <ThemeSwitchButton />
      </Toolbar>
    </AppBar>
  );
}
