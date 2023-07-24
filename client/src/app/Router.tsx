import { Paper, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Routes } from '@/entities/routes';
import { SigninForm } from '@/widgets/auth-forms';
import { ThemeSwitchMenuItem } from '@/features/switch-theme-mode';

const router = createBrowserRouter([
  {
    path: Routes.Landing,
    element: (
      <Paper className="flex flex-col flex-1 justify-center">
        <ThemeSwitchMenuItem/>
      </Paper>
    ),
  },
  {
    path: Routes.Auth,
    element: (
      <SigninForm redirectTo='/auth'/>
    ),
  },
  {
    path: Routes.Users,
    element: (
      <Typography variant="h3" fontWeight="bold">
        <AccountCircle />
        User
      </Typography>
    ),
  },
  {
    path: Routes.Collections,
    element: (
      <Typography variant="h3" fontWeight="bold">
        Collections
      </Typography>
    ),
  },
  {
    path: Routes.Items,
    element: (
      <Typography variant="h3" fontWeight="bold">
        Items
      </Typography>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
