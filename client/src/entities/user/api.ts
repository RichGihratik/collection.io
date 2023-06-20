import { useQuery } from 'react-query';
import { get, getResInfo } from '@/shared';
import { User } from './model';

// TODO: Add api url
const API_URL = '';

async function getUserInfo(id: number): Promise<User> {
  return getResInfo(await get(`${API_URL}/${id}`));
}

export const USER_QUERY_KEY = 'user';

export function userQueryKey(id: number) {
  return [USER_QUERY_KEY, id];
}

export function useUserInfo(id: number) {
  return useQuery({
    queryKey: userQueryKey(id),
    queryFn: () => getUserInfo(id),
  });
}
