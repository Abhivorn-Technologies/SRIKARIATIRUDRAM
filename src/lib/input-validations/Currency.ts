// Import the shared interface
import { ValidationResult } from './Email';

export const validateCurrency = (amount: string): ValidationResult => {
  // 1. Check if empty
  if (!amount || amount.trim() === '') {
    return { isValid: false, errorMessage: 'Amount cannot be empty.' };
  }

  const trimmedAmount = amount.trim();

  // 2. Strict Mathematical Format Check
  // ^\d+          = Must start with at least one number
  // (\.\d{1,2})?$ = Optionally allow a decimal point, but ONLY followed by 1 or 2 numbers max.
  // This blocks negative numbers, letters, and numbers like 10.555
  const currencyRegex = /^\d+(\.\d{1,2})?$/;

  if (!currencyRegex.test(trimmedAmount)) {
    return { 
      isValid: false, 
      errorMessage: 'Please enter a valid positive amount with up to 2 decimal places (e.g., 100.50).' 
    };
  }

  // 3. Zero Check
  // Technically "0.00" passes the format check above, but usually you want people to pay more than zero!
  const numericAmount = parseFloat(trimmedAmount);
  if (numericAmount <= 0) {
    return { isValid: false, errorMessage: 'Amount must be greater than zero.' };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
