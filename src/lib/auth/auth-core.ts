
import { User } from '../interfaces/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../local-storage';

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found');
      return null;
    }

    // In a real app, you would hash passwords and compare them securely
    // For this demo, we're just checking email existence
    const currentUser = { ...user };
    
    // Store the authenticated user
    setItem(STORAGE_KEYS.AUTH_USER, currentUser);
    
    return currentUser;
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    removeItem(STORAGE_KEYS.AUTH_USER);
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    return getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
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
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
