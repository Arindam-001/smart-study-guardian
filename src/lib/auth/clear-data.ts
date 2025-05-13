
import { clearAllData } from '../local-storage';
import { clearAllOTPData } from './password-reset';

export const clearAllAuthData = (): void => {
  // Clear all localStorage data
  clearAllData();
  
  // Clear all OTP data
  clearAllOTPData();
  
  console.log('All authentication data has been cleared');
};
