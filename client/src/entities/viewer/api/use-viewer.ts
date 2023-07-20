import { useQuery } from 'react-query';
import { post, getResInfo, QueryError, queryClient } from '@/shared';
import { Viewer } from './viewer';
import { AUTH_URL, VIEWER_QUERY_KEY } from './const';
import { AuthErrorCode } from './error-codes';

export type ViewerFetchResult = {
  access: string;
  user: Required<Viewer>;
};

export function useViewer() {
  return useQuery({
    queryKey: [VIEWER_QUERY_KEY],
    queryFn: async (): Promise<ViewerFetchResult | undefined> => {
      const res = await post(`${AUTH_URL}/auth/refresh`);
      return getResInfo(res);
    },
  });
}

export function createTokenQuery<T>(
  key: unknown[],
  fn: (token?: string) => Promise<T>,
) {
  const viewer = useViewer();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return fn(viewer.data?.access);
      } catch (e) {
        if (
          e instanceof QueryError &&
          (e.messageCode === AuthErrorCode.Blocked ||
            e.messageCode === AuthErrorCode.Unauthorised)
        ) {
          await queryClient.invalidateQueries([VIEWER_QUERY_KEY]);
        }

        throw e;
      }
    },
    enabled: !viewer.isLoading,
  });
}
