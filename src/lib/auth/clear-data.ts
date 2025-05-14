
import { clearAllData } from '../local-storage';
import { clearAllOTPData } from './password-reset';

export const clearAllAuthData = (): void => {
  // Clear all localStorage data
  clearAllData();
  
  // Clear all OTP data
  clearAllOTPData();
  
  // Also clear any temporary session storage data
  try {
    sessionStorage.removeItem('TEMP_AUTH_USER');
  } catch (err) {
    console.error('Error clearing session storage:', err);
  }
  
  console.log('All authentication data has been cleared');
};
