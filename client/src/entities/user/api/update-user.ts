import { fetchWithToken, getResInfo, patch } from '@/shared';
import { USER_API_URL } from './const';

export type UpdateUserOpts = {
  avatarUrl?: string | null;
  name?: string;
  password?: {
    new: string;
    old: string;
  };
};

export async function updateUser(
  id: number,
  opts: UpdateUserOpts,
  token: string,
) {
  return getResInfo(
    await patch(`${USER_API_URL}/user/${id}`, {
      body: opts,
      fetch: fetchWithToken(token),
    }),
  );
}
