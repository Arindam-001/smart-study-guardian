
// Re-export all authentication functions from a single entry point
import { signIn, signOut, getCurrentUser, setupAuthListener, impersonateUser } from './auth-core';
import { signUp } from './user-management';
import { requestPasswordReset, resetPassword, clearAllOTPData, verifyOTP } from './password-reset';
import { clearAllAuthData } from './clear-data';

export {
  signIn,
  signOut,
  getCurrentUser,
  setupAuthListener,
  signUp,
  requestPasswordReset,
  resetPassword,
  clearAllOTPData,
  verifyOTP,
  impersonateUser, // Export the impersonateUser function
  clearAllAuthData
};
