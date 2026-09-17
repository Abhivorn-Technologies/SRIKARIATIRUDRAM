// Import the shared interface
import { ValidationResult } from './Email';

export interface ButtonValidationOptions {
  /** Array of validation results from your form fields (e.g., Email, Password) */
  validations: ValidationResult[];
  
  /** An error message returned from your backend server (e.g., "Invalid Credentials") */
  serverError?: string | null;
  
  /** The timestamp (Date.now()) of the last time they clicked. Used to prevent double-clicks. */
  lastClickedTimestamp?: number | null;
  
  /** How many milliseconds must pass before they can click again. Default is 1000ms (1 second). */
  debounceMs?: number;

  /** Is the user's phone currently connected to the internet? Default is true. */
  isOnline?: boolean;
}

export const validateButton = (options: ButtonValidationOptions): ValidationResult => {
  const { 
    validations, 
    serverError = null,
    lastClickedTimestamp = null, 
    debounceMs = 1000, 
    isOnline = true 
  } = options;

  // 1. NETWORK CHECK: Prevent submission if they are offline
  if (!isOnline) {
    return { isValid: false, errorMessage: 'No internet connection. Please check your network and try again.' };
  }

  // 2. SERVER/API ERROR: If the backend rejected them (e.g., "Invalid Credentials")
  if (serverError) {
    return { isValid: false, errorMessage: serverError };
  }

  // 3. SPAM / DOUBLE-CLICK CHECK
  if (lastClickedTimestamp) {
    const timeSinceLastClick = Date.now() - lastClickedTimestamp;
    if (timeSinceLastClick < debounceMs) {
      return { isValid: false, errorMessage: 'Please wait a moment before clicking again.' };
    }
  }

  // 4. EMPTY FORM CHECK: Ensure they actually passed validations to check
  if (validations.length === 0) {
    return { isValid: false, errorMessage: 'Form is empty. Please fill out the required fields.' };
  }

  // 5. MASTER VALIDATION LOOP (The Smart Messenger)
  // Instead of a generic error, we grab the EXACT error from the specific field!
  for (const validation of validations) {
    if (!validation.isValid) {
      return { 
        isValid: false, 
        // This will automatically pull "Email cannot be empty" or "Password is too short"!
        errorMessage: validation.errorMessage 
      };
    }
  }

  // Success! All checks passed.
  return { isValid: true, errorMessage: null };
};
