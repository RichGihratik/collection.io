import { UserRole } from '@prisma/client';
import { RawFields, RawJwt } from './access-jwt.interface';

function isRole(item: unknown): item is UserRole {
  return typeof item === 'string' && Object.keys(UserRole).includes(item);
}

export function isValidPayload(item: unknown): item is RawJwt {
  return (
    typeof item === 'object' &&
    item !== null &&
    RawFields.Id in item &&
    typeof item[RawFields.Id] === 'number' &&
    RawFields.Name in item &&
    typeof item[RawFields.Name] === 'string' &&
    RawFields.Email in item &&
    typeof item[RawFields.Email] === 'string' &&
    RawFields.Role in item &&
    isRole(item[RawFields.Role])
  );
}
