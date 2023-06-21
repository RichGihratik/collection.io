import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClientProvider } from 'react-query';
import { Router } from '@/pages';
import { queryClient } from '@/shared';

import './index.css';

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 50,
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
