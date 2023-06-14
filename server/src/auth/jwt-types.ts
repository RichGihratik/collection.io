export enum JwtFields {
  Id = 'sub',
  Name = 'nickname',
  Email = 'email',
  Role = 'roles',
}

export interface JwtPayload {
  [JwtFields.Id]: number;
  [JwtFields.Email]: string;
}

export function isJwtPayload(item: unknown): item is JwtPayload {
  return (
    typeof item === 'object' &&
    item !== null &&
    JwtFields.Id in item &&
    typeof item[JwtFields.Id] === 'number' &&
    JwtFields.Email in item &&
    typeof item[JwtFields.Email] === 'string'
  );
}
