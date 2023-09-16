import { getResInfo, get, fetchWithToken } from '@/shared';
import { USER_API_URL } from './const';
import { User } from '../user';

export type UsersSearchOptions = {
  searchBy?: string;
};

export async function getUsers(
  opts: UsersSearchOptions,
  token?: string,
): Promise<User[]> {
  return getResInfo(
    await get(`${USER_API_URL}`, {
      query: opts,
      fetch: token ? fetchWithToken(token) : fetch,
    }),
  );
}

export async function getUser(id: number, token?: string): Promise<User> {
  return getResInfo(
    await get(`${USER_API_URL}/${id}`, {
      fetch: token ? fetchWithToken(token) : fetch,
    }),
  );
}
