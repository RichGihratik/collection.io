import { useMutation } from 'react-query';
import { UserRole } from '@/shared';
import { useViewer, makeTokenRequest } from '@/entities/viewer';
import { performAdminAction, AdminActionOptions } from '@/entities/user';

export function useAdminAction() {
  const viewer = useViewer();
  const mutation = useMutation({
    mutationFn: async (opts: AdminActionOptions) => {
      const data = viewer.data;
      if (!data || data.user.role !== UserRole.Admin)
        throw new Error('Mutation is not available, auth required');
      return makeTokenRequest(() => performAdminAction(opts, data.access));
    },
  });

  return {
    available: viewer.data && !mutation.isLoading,
    mutation,
  };
}
