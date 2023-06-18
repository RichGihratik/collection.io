import { ThemeProvider, createTheme } from '@mui/material';
import { Router } from '@/pages';

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
      <Router />
    </ThemeProvider>
  );
}
