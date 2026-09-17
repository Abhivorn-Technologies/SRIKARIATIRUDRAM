// Import the shared interface
import { ValidationResult } from './Email';

export const validateUsername = (username: string): ValidationResult => {
  // 1. Check if empty
  if (!username || username.trim() === '') {
    return { isValid: false, errorMessage: 'Username cannot be empty.' };
  }

  // Clean the input of accidental outer spaces, and optionally force it to lowercase
  // (We force lowercase because @JohnDoe and @johndoe should usually be the same person)
  const cleanedUsername = username.trim().toLowerCase();

  // 2. Length Check
  // Usernames that are too short cause database conflicts. Usernames too long break UI layouts.
  if (cleanedUsername.length < 3 || cleanedUsername.length > 20) {
    return { isValid: false, errorMessage: 'Username must be between 3 and 20 characters.' };
  }

  // 3. Strict Format Check
  // ^[a-z0-9_]+$ = ONLY allows lowercase letters, numbers, and underscores (_)
  // It completely blocks spaces, emojis, and dangerous hacker symbols.
  const usernameRegex = /^[a-z0-9_]+$/;

  if (!usernameRegex.test(cleanedUsername)) {
    return { 
      isValid: false, 
      errorMessage: 'Username can only contain letters, numbers, and underscores (no spaces allowed).' 
    };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
