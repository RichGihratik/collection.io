import { useQuery } from 'react-query';
import { getResInfo, get } from '@/shared';
import { User } from './user';
import { USER_API_URL, USER_QUERY_KEY } from './const';


export function useUsers(searchBy: string) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, { searchBy }],
    queryFn: async (): Promise<User[]> =>
      getResInfo(await get(`${USER_API_URL}/${searchBy}`)),
  });
}
