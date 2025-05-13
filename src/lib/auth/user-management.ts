
import { User, UserRole } from '../interfaces/types';
import { getItem, setItem, STORAGE_KEYS } from '../local-storage';

// Enhanced email validation regex that validates most real-world email formats
const validateEmail = (email: string): boolean => {
  // RFC 5322 compliant regex for email validation
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

// Phone number validation
const validatePhone = (phone: string): boolean => {
  // Allows international format with or without '+' and spaces
  const phoneRegex = /^(\+?\d{1,3}[-\s]?)?\(?[\d\s]{3,}\)?[-\s]?[\d\s]{3,}$/;
  return phoneRegex.test(phone);
};

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
    // Validate email format with enhanced regex
    if (!validateEmail(email)) {
      console.error('Invalid email format');
      return false;
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      console.error('Invalid phone format');
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
    if (!validatePhone(phone)) {
      console.error('Invalid phone format');
      return false;
    }
    
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
