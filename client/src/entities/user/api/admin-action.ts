import { del, fetchWithToken, getResInfo, patch } from '@/shared';
import { USER_API_URL } from './const';

export type AdminActionOptions = {
  block?: number[];
  unblock?: number[];
  promote?: number[];
  downgrade?: number[];
};

export async function performAdminAction(
  opts: AdminActionOptions,
  token: string,
) {
  return getResInfo(
    await patch(`${USER_API_URL}/admin`, {
      body: opts,
      fetch: fetchWithToken(token),
    }),
  );
}

export async function deleteUsers(users: number[], token: string) {
  return getResInfo(
    await del(`${USER_API_URL}/admin`, {
      body: {
        users,
      },
      fetch: fetchWithToken(token),
    }),
  );
}
