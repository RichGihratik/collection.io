import { ThemeProvider } from '@mui/material';
import { QueryClientProvider } from 'react-query';
import { Router } from './Router';
import { queryClient } from '@/shared';
import { theme } from '@/entities/theme';
import { loadDayJS } from './dayjs-setup';

import './index.css';

export function setup() {
  loadDayJS();
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
