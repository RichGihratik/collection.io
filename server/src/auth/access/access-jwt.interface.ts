import { UserRole } from '@prisma/client';
import { JwtPayload, JwtFields } from '../jwt-types';

export interface AccessPayload extends JwtPayload {
  [JwtFields.Email]: string;
  [JwtFields.Name]: string;
  [JwtFields.Role]: UserRole;
}

export type ParsedAccessPayload = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};
