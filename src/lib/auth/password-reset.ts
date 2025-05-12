
import { getItem, setItem, STORAGE_KEYS } from '../local-storage';
import { User } from '../interfaces/types';

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userExists = users.some(u => u.email === email);
    
    if (!userExists) {
      console.error('User not found');
      return false;
    }
    
    // In a real app, you would send an email with a reset link
    // For this demo, we'll just log that a reset was requested
    console.log('Password reset requested for:', email);
    
    // Store the reset request in localStorage (in a real app you'd use a token system)
    const resetRequests = getItem<Record<string, boolean>>('password_reset_requests', {});
    resetRequests[email] = true;
    setItem('password_reset_requests', resetRequests);
    
    return true;
  } catch (error) {
    console.error('Password reset request error:', error);
    return false;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    // In a real app, you would validate the token
    // For this demo, we'll simulate updating a user's password
    
    // Get the email from the token (in a real app this would be encoded/decoded properly)
    const email = token;
    
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      console.error('User not found');
      return false;
    }
    
    // In a real app, you would hash the password
    // For this demo, we're not actually storing passwords in localStorage for security reasons
    
    // Update the password reset request status
    const resetRequests = getItem<Record<string, boolean>>('password_reset_requests', {});
    delete resetRequests[email];
    setItem('password_reset_requests', resetRequests);
    
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
};
