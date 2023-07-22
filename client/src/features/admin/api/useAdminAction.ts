import { UserRole } from '@/shared';
import { createTokenMutation } from '@/entities/viewer';
import { performAdminAction, AdminActionOptions } from '@/entities/user';

export function useAdminAction() {
  return createTokenMutation(async (viewer, opts: AdminActionOptions) => {
    if (viewer.user.role !== UserRole.Admin)
      throw new Error('Cant perform admin action as user!');
    return performAdminAction(opts, viewer.access);
  });
}
