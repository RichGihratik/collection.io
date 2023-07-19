import { Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Routes } from '@/entities/routes';
import { SigninForm } from '@/features/auth';

const router = createBrowserRouter([
  {
    path: Routes.Landing,
    element: (
      <Typography variant="h3" fontWeight="bold">
        Landing
      </Typography>
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
