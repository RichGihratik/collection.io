import { get, getResInfo } from '@/shared';

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
}

export interface User {
  id: number;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  role: UserRole;
  status: UserStatus;
  email?: string;
}


// TODO: Add api url
const API_URL = '';

export async function getUserInfo(id: number): Promise<User> {
  return getResInfo(await get(`${API_URL}/${id}`));
}

