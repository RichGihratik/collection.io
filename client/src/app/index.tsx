import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from 'react-query';
import { Router } from './Router';
import { queryClient } from '@/shared';
import { ThemeModeProvider } from '@/entities/theme-mode';
import { ThemeProvider } from '@/entities/theme';
import { MainLayout } from '@/pages/MainLayout';

import './index.css';

export default function App() {
  return (
    <ThemeModeProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <CssBaseline />
            <Router />
          </MainLayout>
        </QueryClientProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}
