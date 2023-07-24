import { Routes } from "@/entities/routes";

export enum AuthRoutes {
  Signin = 'signin',
  Signup = 'signup'
}

export function getAuthSubroute(route: AuthRoutes) {
  return `/${Routes.Auth}/${route}`;
}
