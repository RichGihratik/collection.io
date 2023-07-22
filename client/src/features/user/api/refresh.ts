import { USER_QUERY_KEY, UsersSearchOptions } from '@/entities/user';
import { queryClient } from '@/shared';

export function refreshUsers(opts: UsersSearchOptions) {
  queryClient.invalidateQueries([USER_QUERY_KEY, opts]);
}
