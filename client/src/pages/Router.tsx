import { Typography } from '@mui/material';
import { AccountCircle, CollectionsBookmark } from '@mui/icons-material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
      <Typography variant="h3" fontWeight="bold">
        <AccountCircle />
        Auth
      </Typography>
    ),
  },
  {
    path: '/collections',
    element: (
      <Typography variant="h3" fontWeight="bold">
        <CollectionsBookmark />
        Collection search
      </Typography>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
