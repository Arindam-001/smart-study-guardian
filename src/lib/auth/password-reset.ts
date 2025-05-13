import { getItem, setItem, STORAGE_KEYS } from '../local-storage';
import { User } from '../interfaces/types';

// Simulate OTP storage - in a real app, this would be in a secure database
const otpStore: Record<string, { otp: string, expires: number }> = {};

// Generate a random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userExists = users.some(u => u.email === email);
    
    if (!userExists) {
      console.error('User not found');
      return false;
    }
    
    // Generate a new OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (30 minutes)
    otpStore[email] = { 
      otp, 
      expires: Date.now() + 30 * 60 * 1000 
    };
    
    // In a real app, this would send an email with the OTP
    console.log(`Password reset OTP for ${email}: ${otp}`);
    
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

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const storedData = otpStore[email];
    
    if (!storedData) {
      console.error('No OTP found for this email');
      return false;
    }
    
    if (Date.now() > storedData.expires) {
      console.error('OTP has expired');
      delete otpStore[email];
      return false;
    }
    
    if (storedData.otp !== otp) {
      console.error('Invalid OTP');
      return false;
    }
    
    // OTP is valid, clean up (but keep the entry for the reset token step)
    otpStore[email].otp = '';
    
    return true;
  } catch (error) {
    console.error('OTP verification error:', error);
    return false;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    // In a real app, you would validate the token
    // For this demo, we're using the email as the token
    const email = token;
    
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      console.error('User not found');
      return false;
    }
    
    // In a real app, you would hash the password before storing
    console.log(`Password for ${email} has been reset`);
    
    // Update the password reset request status
    const resetRequests = getItem<Record<string, boolean>>('password_reset_requests', {});
    delete resetRequests[email];
    setItem('password_reset_requests', resetRequests);
    
    // Clean up OTP data
    delete otpStore[email];
    
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
};
