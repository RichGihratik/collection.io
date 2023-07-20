import { del, fetchWithToken, getResInfo, patch } from '@/shared';
import { USER_API_URL } from './const';

export type AdminActionOptions = {
  block: number[];
  unblock: number[];
  promote: number[];
  downgrade: number[];
};

export async function performAdminAction(
  id: number,
  opts: AdminActionOptions,
  token: string,
) {
  return getResInfo(
    await patch(`${USER_API_URL}/admin/${id}`, {
      body: opts,
      fetch: fetchWithToken(token),
    }),
  );
}

export type DeleteUsersOpts = {
  users: number[];
};

export async function deleteUsers(id: number, opts: DeleteUsersOpts, token: string) {
  return getResInfo(
    await del(`${USER_API_URL}/admin/${id}`, {
      body: opts,
      fetch: fetchWithToken(token),
    }),
  );
}
