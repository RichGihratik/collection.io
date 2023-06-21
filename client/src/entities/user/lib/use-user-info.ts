import { useQuery } from 'react-query';
import { getUserInfo } from '../api';

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
