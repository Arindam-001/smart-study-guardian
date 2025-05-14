
import { User, UserRole } from '../interfaces/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../local-storage';
import { supabase } from '../supabase';
import { getSemesterCountByProgram } from '../auth-service';

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

// Domain validation for different roles
const validateDomain = (email: string, role: UserRole): boolean => {
  if (role === 'admin' && !email.endsWith('@admin.com')) {
    return false;
  }
  
  if (role === 'teacher' && !email.endsWith('@faculty.com')) {
    return false;
  }
  
  if (role === 'student' && !email.endsWith('@college.com')) {
    return false;
  }
  
  return true;
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  id: string,
  role: UserRole,
  currentSemester: number = 1,
  phone?: string,
  enrolledCourse?: string
): Promise<boolean> => {
  try {
    // Validate email format with enhanced regex
    if (!validateEmail(email)) {
      console.error('Invalid email format');
      return false;
    }

    // Validate domain
    if (!validateDomain(email, role)) {
      console.error(`Invalid domain for role ${role}`);
      return false;
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      console.error('Invalid phone format');
      return false;
    }

    // Calculate accessible semesters based on enrolled course
    let accessibleSemesters = [1];
    if (role === 'student' && enrolledCourse) {
      const semesterCount = getSemesterCountByProgram(enrolledCourse);
      accessibleSemesters = [currentSemester];
    } else if (role !== 'student') {
      accessibleSemesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    // Try to persist to Supabase first
    try {
      // First try to create auth user
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!authError) {
        // Then create user in our users table
        const { error: dbError } = await supabase.from('users').insert({
          id,
          name,
          email,
          role,
          current_semester: role === 'student' ? currentSemester : 0,
          accessible_semesters: accessibleSemesters,
          enrolled_course: enrolledCourse || null,
          phone: phone || null,
        });
        
        if (!dbError) {
          console.log('User successfully registered in database');
          // Still update local storage for offline functionality
          updateLocalUserStorage(name, email, id, role, currentSemester, accessibleSemesters, phone, enrolledCourse);
          return true;
        }
      }
    } catch (dbError) {
      console.log('Database registration failed, falling back to local storage', dbError);
    }
    
    // Fall back to local storage if database fails
    return updateLocalUserStorage(name, email, id, role, currentSemester, accessibleSemesters, phone, enrolledCourse);
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

// Helper function to update local storage
const updateLocalUserStorage = (
  name: string,
  email: string,
  id: string,
  role: UserRole,
  currentSemester: number,
  accessibleSemesters: number[],
  phone?: string,
  enrolledCourse?: string
): boolean => {
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
    enrolledCourse,
    currentSemester: role === 'student' ? currentSemester : 0,
    accessibleSemesters,
  };
  
  // Add user to users array and save to localStorage
  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  
  return true;
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
    
    // Try database update first
    try {
      const { error } = await supabase
        .from('users')
        .update({ phone })
        .eq('email', email);
        
      if (!error) {
        console.log('Phone updated in database');
      }
    } catch (dbError) {
      console.log('Database update failed', dbError);
    }
    
    // Also update local storage
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

// Delete user method
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Try database delete first
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (!error) {
        console.log('User deleted from database');
      }
    } catch (dbError) {
      console.log('Database delete failed', dbError);
    }
    
    // Also delete from local storage
    const users = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      console.error('User not found');
      return false;
    }
    
    setItem(STORAGE_KEYS.USERS, filteredUsers);
    
    // Check if this was the currently logged in user
    const currentUser = getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
    if (currentUser && currentUser.id === id) {
      removeItem(STORAGE_KEYS.AUTH_USER);
    }
    
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
};
