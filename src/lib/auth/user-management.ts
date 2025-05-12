
import { User, UserRole } from '../interfaces/types';
import { getItem, setItem, STORAGE_KEYS } from '../local-storage';

export const signUp = async (
  name: string,
  email: string,
  password: string,
  id: string,
  role: UserRole,
  currentSemester: number = 1
): Promise<boolean> => {
  try {
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
