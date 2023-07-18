import { useQuery } from 'react-query';
import { post, getResInfo, QueryStatus } from '@/shared';
import { User } from './user';
import { AUTH_URL, VIEWER_QUERY_KEY } from './const';

export type ViewerFetchResult = {
  access: string;
  user: Required<User>;
};

export function useViewer() {
  return useQuery({
    queryKey: [VIEWER_QUERY_KEY],
    queryFn: async (): Promise<ViewerFetchResult | undefined> => {
      const res = await post(`${AUTH_URL}/auth/refresh`);
      if (res.status === QueryStatus.Unauthorised) return undefined;
      return getResInfo(res);
    },
  });
}
