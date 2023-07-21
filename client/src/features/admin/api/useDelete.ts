import { useMutation } from 'react-query';
import { UserRole } from '@/shared';
import { useViewer, makeTokenRequest } from '@/entities/viewer';
import { deleteUsers } from '@/entities/user';

export function useDelete() {
  const viewer = useViewer();
  const mutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const data = viewer.data;
      if (!data || data.user.role !== UserRole.Admin)
        throw new Error('Mutation is not available, auth and role required');
      return makeTokenRequest(() => deleteUsers(ids, data.access));
    },
  });

  return {
    mutation,
    available: viewer.data && !mutation.isLoading
  }
}
