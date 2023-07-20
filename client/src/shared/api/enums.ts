export enum QueryStatus {
  Unauthorised = 401,
  Forbidden = 403,
  BadRequest = 400,
}

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
}
