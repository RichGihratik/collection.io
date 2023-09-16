import { useMutation, useQuery } from 'react-query';
import { post, getResInfo, QueryError, queryClient, UserRole } from '@/shared';
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
      try {
        return getResInfo(res);
      } catch (e) {
        if (
          e instanceof QueryError &&
          (e.messageCode === AuthErrorCode.Blocked ||
            e.messageCode === AuthErrorCode.Unauthorised)
        ) {
          return undefined;
        } else throw e;
      }
    },
  });
}

export function makeTokenRequest<T>(fn: () => Promise<T>): () => Promise<T> {
  return () => {
    try {
      return fn();
    } catch (e) {
      if (
        e instanceof QueryError &&
        (e.messageCode === AuthErrorCode.Blocked ||
          e.messageCode === AuthErrorCode.Unauthorised)
      ) {
        queryClient.invalidateQueries([VIEWER_QUERY_KEY]);
      }

      throw e;
    }
  };
}

export function useTokenQuery<T>(
  key: unknown[],
  fn: (token?: string) => Promise<T>,
) {
  const viewer = useViewer();

  return useQuery({
    queryKey: key,
    queryFn: async () => makeTokenRequest(() => fn(viewer.data?.access)),
    enabled: !viewer.isLoading,
  });
}

export function useTokenMutation<T>(
  fn: (viewer: ViewerFetchResult, params: T) => Promise<unknown>,
) {
  const viewer = useViewer();
  const mutation = useMutation({
    mutationFn: async (params: T) => {
      const data = viewer.data;
      if (!data || data.user.role !== UserRole.Admin)
        throw new Error('Mutation is not available, auth required');
      return makeTokenRequest(() => fn(data, params));
    },
  });

  return {
    available: !!viewer.data && !mutation.isLoading,
    mutation,
  };
}
