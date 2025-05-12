
// Re-export all authentication functions from a single entry point
import { signIn, signOut, getCurrentUser, setupAuthListener } from './auth-core';
import { signUp } from './user-management';
import { requestPasswordReset, resetPassword } from './password-reset';

export {
  signIn,
  signOut,
  getCurrentUser,
  setupAuthListener,
  signUp,
  requestPasswordReset,
  resetPassword
};
