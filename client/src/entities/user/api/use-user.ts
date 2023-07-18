import { useQuery } from 'react-query';
import { getResInfo, get } from '@/shared';
import { User } from './user';
import { USER_API_URL, USER_QUERY_KEY } from './const';


export function useUser(id: number) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: async (): Promise<User> =>
      getResInfo(await get(`${USER_API_URL}/${id}`)),
  });
}
