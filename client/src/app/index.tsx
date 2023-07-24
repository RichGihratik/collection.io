import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from 'react-query';
import { Router } from './Router';
import { queryClient } from '@/shared';
import { ThemeModeProvider } from '@/entities/theme-mode';
import { ThemeProvider } from '@/entities/theme';
import { loadDayJS } from './dayjs-setup';

import './index.css';

export function setup() {
  loadDayJS();
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Router />
        </QueryClientProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}
