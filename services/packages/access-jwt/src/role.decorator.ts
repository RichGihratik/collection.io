import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@collection.io/prisma';

export const ROLES_METAKEY = 'role';
export const Role = (role: UserRole = UserRole.CUSTOMER) =>
  SetMetadata(ROLES_METAKEY, role);
