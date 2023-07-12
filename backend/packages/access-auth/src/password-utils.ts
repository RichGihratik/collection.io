import { hash, compare, hashSync } from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export function hashPasswordSync(password: string) {
  return hashSync(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string) {
  return await compare(password, hash);
}
