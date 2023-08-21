import { UserRole } from '@/shared';
import { useTokenMutation } from '@/entities/viewer';
import { deleteUsers } from '@/entities/user';

export function useDelete() {
  return useTokenMutation(async (viewer, ids: number[]) => {
    if (viewer.user.role !== UserRole.Admin)
      throw new Error('Cant perform admin action as user!');
    return deleteUsers(ids, viewer.access);
  });
}
