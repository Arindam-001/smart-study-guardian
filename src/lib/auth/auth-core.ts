
import { User } from '../interfaces/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../local-storage';
import { supabase } from '../supabase';

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    // First try to authenticate with Supabase
    let currentUser = null;
    
    try {
      // Attempt to sign in using Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!authError && authData.user) {
        // Fetch user data from our users table
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
          
        if (data) {
          // Convert to our User type
          currentUser = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            currentSemester: data.current_semester,
            accessibleSemesters: data.accessible_semesters,
            phone: data.phone || undefined,
            enrolledCourse: data.enrolled_course || undefined,
          };
        }
      }
    } catch (dbError) {
      console.log('Database auth failed, falling back to local storage', dbError);
    }
    
    // If database auth failed, try local storage
    if (!currentUser) {
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);
      
      if (!user) {
        console.error('User not found');
        return null;
      }
      
      currentUser = { ...user };
    }
    
    if (currentUser) {
      // Store the authenticated user
      setItem(STORAGE_KEYS.AUTH_USER, currentUser);
      return currentUser;
    }
    
    return null;
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Check if this is an admin returning to their account
    const adminUser = getItem('ADMIN_USER_BACKUP', null);
    if (adminUser) {
      // If admin was viewing someone else's account, restore admin and clear backup
      setItem(STORAGE_KEYS.AUTH_USER, adminUser);
      removeItem('ADMIN_USER_BACKUP');
      return;
    }
    
    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch (dbError) {
      console.log('Database signout error', dbError);
    }
    
    // Remove from local storage
    removeItem(STORAGE_KEYS.AUTH_USER);
    // Also clear any admin backup
    removeItem('ADMIN_USER_BACKUP');
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check local storage
    const localUser = getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
    
    if (localUser) {
      // Try to verify with Supabase if possible
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email === localUser.email) {
          return localUser;
        }
      } catch (dbError) {
        console.log('Database verification failed, using local user', dbError);
        return localUser;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const setupAuthListener = (callback: (user: User | null) => void): (() => void) => {
  // Create a simple "listener" using localStorage events
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.AUTH_USER) {
      try {
        const user = event.newValue ? JSON.parse(event.newValue) as User : null;
        callback(user);
      } catch (error) {
        console.error('Error parsing auth user from storage event:', error);
        callback(null);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  // Set up Supabase auth listener if available
  let unsubscribe: (() => void) | null = null;
  
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        callback(null);
      } else if (session?.user) {
        // We need to convert the Supabase user to our User type
        // This would typically fetch the user from our users table
        // For now, just trigger a check of local storage
        const localUser = getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
        if (localUser && localUser.email === session.user.email) {
          callback(localUser);
        }
      }
    });
    
    unsubscribe = subscription.unsubscribe;
  } catch (error) {
    console.error('Error setting up Supabase auth listener', error);
  }
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    if (unsubscribe) unsubscribe();
  };
};
