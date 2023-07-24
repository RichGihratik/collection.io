import { AuthRoutes, SigninForm, SignupForm } from '@/widgets/auth-forms';
import { RouteObject } from 'react-router-dom';

export const authSubroutes: RouteObject[] = [
  {
    path: AuthRoutes.Signin,
    element: <SigninForm redirectTo="/" />,
  },
  {
    path: AuthRoutes.Signup,
    element: <SignupForm redirectTo="/" />,
  },
];
