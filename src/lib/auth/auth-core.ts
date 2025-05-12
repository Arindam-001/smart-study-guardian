
import { supabase } from '../supabase';
import { User, UserRole } from '../interfaces/types';
import { toast } from '@/components/ui/use-toast';

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Authentication error:', authError.message);
      return null;
    }

    if (!authData.user) {
      return null;
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authData.user.email)
      .single();

    if (userError || !userData) {
      console.error('User data fetch error:', userError?.message);
      return null;
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      currentSemester: userData.current_semester,
      accessibleSemesters: userData.accessible_semesters,
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return null;
    }
    
    if (!sessionData.session?.user) {
      return null;
    }
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', sessionData.session.user.email)
      .single();
      
    if (userError || !userData) {
      console.error('User data fetch error:', userError?.message);
      return null;
    }
    
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      currentSemester: userData.current_semester,
      accessibleSemesters: userData.accessible_semesters,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Setup auth state change listener
export const setupAuthListener = (callback: (user: User | null) => void): (() => void) => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Get user data when signed in
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();
        
      if (userError || !userData) {
        console.error('User data fetch error:', userError?.message);
        callback(null);
        return;
      }
      
      callback({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        currentSemester: userData.current_semester,
        accessibleSemesters: userData.accessible_semesters,
      });
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
  
  return () => {
    data.subscription.unsubscribe();
  };
};
