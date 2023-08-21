import { UserRole } from '@/shared';
import { useTokenMutation } from '@/entities/viewer';
import { performAdminAction, AdminActionOptions } from '@/entities/user';

export function useAdminAction() {
  return useTokenMutation(async (viewer, opts: AdminActionOptions) => {
    if (viewer.user.role !== UserRole.Admin)
      throw new Error('Cant perform admin action as user!');
    return performAdminAction(opts, viewer.access);
  });
}
