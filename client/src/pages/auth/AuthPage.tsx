import { Routes } from '@/entities/routes';
import { AuthRoutes } from '@/widgets/auth-forms';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthPage() {
  const { pathname } = useLocation();

  return pathname === '/' + Routes.Auth ? (
    <Navigate to={`/${Routes.Auth}/${AuthRoutes.Signin}`} />
  ) : (
    <Outlet />
  );
}
