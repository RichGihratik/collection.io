import { USER_QUERY_KEY, getUser } from '@/entities/user';
import { createTokenQuery } from '@/entities/viewer';

export function useUser(id: number) {
  return createTokenQuery([USER_QUERY_KEY, id], async (token) => {
    return getUser(id, token);
  });
}
