import { post, getResInfo, QueryStatus } from '@/shared';
import { User } from './user';

export const AUTH_URL = 'https://collection-io-auth.onrender.com';

export type ViewerFetchResult = {
  access: string;
  user: Required<User>;
}

export async function refresh(): Promise<ViewerFetchResult | undefined> {
  const res = await post(`${AUTH_URL}/auth/refresh`);
  if (res.status === QueryStatus.Unauthorised) return undefined;
  return getResInfo(res);
}
