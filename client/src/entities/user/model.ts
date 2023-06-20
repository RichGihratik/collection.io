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
}