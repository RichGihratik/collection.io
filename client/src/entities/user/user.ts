import { UserRole, UserStatus } from '@/shared';

export interface User {
  id: number;
  avatarUrl?: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  role: UserRole;
  status: UserStatus;
  email?: string;
}
