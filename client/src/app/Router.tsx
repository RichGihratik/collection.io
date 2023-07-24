import { Paper, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Routes } from '@/entities/routes';
import { AuthPage, authSubroutes } from '@/pages/auth';

const router = createBrowserRouter([
  {
    path: Routes.Landing,
    element: (
      <Paper className="flex flex-col flex-1 justify-center">
      </Paper>
    ),
  },
  {
    path: Routes.Auth,
    element: <AuthPage/>,
    children: authSubroutes,
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
