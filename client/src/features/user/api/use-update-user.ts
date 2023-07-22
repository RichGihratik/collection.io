import { UpdateUserOpts, updateUser } from '@/entities/user';
import { createTokenMutation } from '@/entities/viewer';
import { UserRole } from '@/shared';

export function useUpdateUser() {
  return createTokenMutation(
    async (viewer, opts: UpdateUserOpts & { id?: number }) => {
      if (
        opts.id &&
        viewer.user.id !== opts.id &&
        viewer.user.role !== UserRole.Admin
      )
        throw new Error('Cant perform admin action as user!');
      const targetId = opts.id ?? viewer.user.id;
      return updateUser(targetId, opts, viewer.access);
    },
  );
}
