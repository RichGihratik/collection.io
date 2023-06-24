import { Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { SigninForm, SignupForm } from '@/features/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Typography variant="h3" fontWeight="bold">
        Landing
      </Typography>
    ),
  },
  {
    path: '/users',
    element: (
      <Typography variant="h3" fontWeight="bold">
        <AccountCircle />
        User
      </Typography>
    ),
  },
  {
    path: '/auth',
    element: (
      <SigninForm redirectTo='/auth'/>
    ),
  },
  {
    path: '/collections',
    element: (
      <SignupForm redirectTo='/collections'/>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
