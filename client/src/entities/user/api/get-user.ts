import { getResInfo, get, fetchWithToken } from '@/shared';
import { USER_API_URL } from './const';
import { User } from '../user';

export async function getUsers(searchBy: string, token?: string): Promise<User[]> {
  return getResInfo(await get(`${USER_API_URL}`, {
    query: { searchBy: searchBy },
    fetch: token ? fetchWithToken(token) : fetch,
  }));
}

export async function getUser(id: number, token?: string): Promise<User>  {
  return getResInfo(await get(`${USER_API_URL}/${id}`, {
    fetch: token ? fetchWithToken(token) : fetch,
  }));
}