
// This file is maintained for backward compatibility
// It re-exports all authentication functions from the new modular structure
export {
  signIn,
  signOut,
  getCurrentUser,
  setupAuthListener,
  signUp,
  requestPasswordReset,
  resetPassword
} from './auth/index';
