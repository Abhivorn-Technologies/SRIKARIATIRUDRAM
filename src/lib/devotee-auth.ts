import crypto from 'crypto';
import { validatePhone, validatePassword } from '@/lib/input-validations';

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const selectedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, selectedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: selectedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return calculated === hash;
}

export function validateDevoteePhone(phone: string) {
  return validatePhone(phone);
}

export function validateDevoteePassword(password: string) {
  return validatePassword(password);
}
