import { useMutation } from 'react-query';
import { queryClient } from '@/shared';
import { VIEWER_QUERY_KEY } from '@/entities/viewer';
import { signout } from './queries';

export function useSignout() {
  return useMutation({
    mutationFn: async () => {
      const data = await signout();
      queryClient.setQueryData([VIEWER_QUERY_KEY], undefined);
      return data;
    },
  });
}
