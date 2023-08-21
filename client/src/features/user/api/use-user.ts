import { USER_QUERY_KEY, getUser } from '@/entities/user';
import { useTokenQuery } from '@/entities/viewer';

export function useUser(id: number) {
  return useTokenQuery([USER_QUERY_KEY, id], async (token) => {
    return getUser(id, token);
  });
}
