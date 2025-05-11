
import { supabase } from './supabase';
import { User, UserRole } from './interfaces/types';
import { Tables } from './supabase';
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

export const signUp = async (
  name: string,
  email: string,
  password: string,
  id: string,
  role: UserRole,
  currentSemester: number = 1
): Promise<boolean> => {
  try {
    // First, check if the email or ID already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .or(`email.eq.${email},id.eq.${id}`)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return false;
    }

    if (existingUser) {
      return false;
    }

    // Register with Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Auth registration error:', error?.message);
      return false;
    }

    // Create user in database
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id,
        name,
        email,
        role,
        current_semester: role === 'student' ? currentSemester : 0,
        accessible_semesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
        auth_id: data.user.id,
      });

    if (insertError) {
      console.error('Database registration error:', insertError);
      // If user creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
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
