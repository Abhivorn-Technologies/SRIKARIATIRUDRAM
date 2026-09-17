// Import the shared interface
import { ValidationResult } from './Email';

export const validateDateOfBirth = (dateString: string): ValidationResult => {
  // 1. Check if empty
  if (!dateString || dateString.trim() === '') {
    return { isValid: false, errorMessage: 'Date of birth cannot be empty.' };
  }

  // 2. Ensure the format is standard YYYY-MM-DD (This is what mobile apps and web browsers usually send)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { isValid: false, errorMessage: 'Date must be in YYYY-MM-DD format.' };
  }

  const birthDate = new Date(dateString);
  const today = new Date();

  // 3. Catch impossible dates (like February 30th)
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, errorMessage: 'Please enter a real, valid date.' };
  }

  // 4. Security Check: Block time-travelers (dates in the future)
  if (birthDate > today) {
    return { isValid: false, errorMessage: 'Date of birth cannot be in the future.' };
  }

  // 5. Age Requirement Check: Calculate if they are at least 18 years old
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust the math if they haven't had their birthday yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, errorMessage: 'You must be at least 18 years old to use this app.' };
  }

  // Success!
  return { isValid: true, errorMessage: null };
};
