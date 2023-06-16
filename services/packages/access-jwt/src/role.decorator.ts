import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@collection.io/prisma';

export const ROLES_METADATA_KEY = 'role';
export const Role = (role: UserRole = 'CUSTOMER') =>
  SetMetadata(ROLES_METADATA_KEY, role);
