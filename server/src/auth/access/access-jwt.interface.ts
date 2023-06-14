import { UserRole } from '@prisma/client';

export enum RawFields {
  Id = 'sub',
  Name = 'nickname',
  Email = 'email',
  Role = 'roles',
}

export type RawJwt = {
  [RawFields.Id]: number;
  [RawFields.Name]: string;
  [RawFields.Email]: string;
  [RawFields.Role]: UserRole;
};

export type AccessJwt = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
