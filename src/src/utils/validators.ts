/**
 * Utility functions for validation
 */

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if email is valid
 * 
 * @example
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid') // false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate French phone number
 * @param phone - Phone number to validate
 * @returns True if phone is valid
 * 
 * @example
 * isValidPhone('0123456789') // true
 * isValidPhone('01 23 45 67 89') // true
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  const phoneRegex = /^0[1-9]\d{8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 * 
 * @example
 * validatePassword('weak') // { isValid: false, message: 'Password too short' }
 */
export const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins 8 caractères',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une majuscule',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une minuscule',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins un chiffre',
    };
  }

  return { isValid: true, message: 'Mot de passe valide' };
};

/**
 * Validate required field
 * @param value - Value to validate
 * @returns True if value is not empty
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return true;
};

/**
 * Validate number range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};
