
import { supabase } from '../supabase';
import { toast } from '@/components/ui/use-toast';

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error('Password reset request error:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Password reset request error:', error);
    return false;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    // Note: token is automatically included in the URL when user clicks the reset link in email
    // Supabase extracts this from the session - we don't need to explicitly pass it
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
};
