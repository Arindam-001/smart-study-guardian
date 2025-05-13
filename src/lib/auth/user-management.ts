
import { User, UserRole } from '../interfaces/types';
import { getItem, setItem, STORAGE_KEYS } from '../local-storage';

export const signUp = async (
  name: string,
  email: string,
  password: string,
  id: string,
  role: UserRole,
  currentSemester: number = 1,
  phone?: string
): Promise<boolean> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format');
      return false;
    }

    // Get existing users
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    
    // Check if email already exists
    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
      console.error('Email already exists');
      return false;
    }
    
    // Check if ID already exists
    const existingId = users.find(u => u.id === id);
    if (existingId) {
      console.error('ID already exists');
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id,
      name,
      email,
      role,
      phone,
      currentSemester: role === 'student' ? currentSemester : 0,
      accessibleSemesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
    };
    
    // Add user to users array and save to localStorage
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

// Add method to update user's phone number
export const updateUserPhone = async (
  email: string,
  phone: string
): Promise<boolean> => {
  try {
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      console.error('User not found');
      return false;
    }
    
    users[userIndex].phone = phone;
    setItem(STORAGE_KEYS.USERS, users);
    
    // Update the current user if logged in
    const currentUser = getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
    if (currentUser && currentUser.email === email) {
      currentUser.phone = phone;
      setItem(STORAGE_KEYS.AUTH_USER, currentUser);
    }
    
    return true;
  } catch (error) {
    console.error('Update user phone error:', error);
    return false;
  }
};
