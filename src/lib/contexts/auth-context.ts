
import { User, UserRole } from '@/lib/interfaces/types';
import { signIn } from '@/lib/auth/auth-core';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/local-storage';

// Auth-related context functions
export const useAuthFunctions = (
  usersList: User[], 
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use the signIn function from auth-core
      const foundUser = await signIn(email, password);
      
      if (foundUser) {
        setUser(foundUser);
        setItem(STORAGE_KEYS.AUTH_USER, foundUser);
        return true;
      }
      
      // If signIn failed, try to find user in local storage as fallback
      const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
      const localUser = users.find(u => u.email === email);
      
      if (localUser) {
        setUser(localUser);
        setItem(STORAGE_KEYS.AUTH_USER, localUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
    // Remove user from local storage
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  // Register user function - Updated to match the type definition in app-context-types.ts
  const registerUser = async (
    userData: Omit<User, "id"> | {
      name: string;
      email: string;
      password: string;
      id: string;
      role: string;
      currentSemester?: number;
      phone?: string;
      enrolledCourse?: string;
    }
  ): Promise<boolean> => {
    // Handle both object formats
    // Check if we have the second format with an id property
    const hasIdProperty = 'id' in userData;
    
    // Extract common properties
    const { 
      name, email, role, currentSemester = 1, phone, enrolledCourse 
    } = userData;
    
    // Extract id if it exists, otherwise generate a new one
    const id = hasIdProperty ? (userData as { id: string }).id : `user-${Date.now()}`;
    
    // Password might be included in the object but not in the User type
    const password = 'password' in userData ? (userData as { password: string }).password : '';
    
    // Check if user with same email already exists
    const existingUser = usersList.find(u => u.email === email || u.id === id);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id,
      name,
      email,
      role: role as UserRole,
      currentSemester: typeof currentSemester === 'number' ? currentSemester : 1,
      accessibleSemesters: role === 'student' ? [currentSemester as number] : [1, 2, 3, 4, 5, 6, 7, 8],
      phone,
      enrolledCourse,
    };

    // Add user to list and update state
    const updatedUsers = [...usersList, newUser];
    setUsers(updatedUsers);
    
    // Store in local storage
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    
    return true;
  };

  return { login, logout, registerUser };
};
