// Import the shared interface
import { ValidationResult } from './Email';

export const validateAccountNumber = (accountNumber: string): ValidationResult => {
  // 1. Check if empty
  if (!accountNumber || accountNumber.trim() === '') {
    return { isValid: false, errorMessage: 'Account number cannot be empty.' };
  }

  // 2. Clean the input: Automatically remove any spaces or dashes the user typed
  // Example: "1234 5678-90" becomes "1234567890"
  const cleanedAccount = accountNumber.replace(/[\s\-]/g, '');

  // 3. Strict Check: Ensure the cleaned string contains ONLY numbers
  if (!/^\d+$/.test(cleanedAccount)) {
    return { isValid: false, errorMessage: 'Account number can only contain numbers.' };
  }

  // 4. Length Check
  // Global bank account numbers are usually between 8 and 17 digits long.
  if (cleanedAccount.length < 8 || cleanedAccount.length > 17) {
    return { isValid: false, errorMessage: 'Account number must be between 8 and 17 digits.' };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
