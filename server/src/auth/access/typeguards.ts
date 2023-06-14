import { UserRole } from '@prisma/client';
import { AccessPayload } from './access-jwt.interface';
import { isJwtPayload, JwtFields } from '../jwt-types';

function isRole(item: unknown): item is UserRole {
  return typeof item === 'string' && Object.keys(UserRole).includes(item);
}

export function isValidPayload(item: unknown): item is AccessPayload {
  return (
    isJwtPayload(item) &&
    JwtFields.Name in item &&
    typeof item[JwtFields.Name] === 'string' &&
    JwtFields.Email in item &&
    typeof item[JwtFields.Email] === 'string' &&
    JwtFields.Role in item &&
    isRole(item[JwtFields.Role])
  );
}
