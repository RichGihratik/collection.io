import {
  USER_QUERY_KEY,
  type UsersSearchOptions,
  getUsers,
} from '@/entities/user';
import { createTokenQuery } from '@/entities/viewer';

export function useUsers(opts: UsersSearchOptions) {
  return createTokenQuery([USER_QUERY_KEY, opts], async (token) => {
    return getUsers(opts, token);
  });
}
