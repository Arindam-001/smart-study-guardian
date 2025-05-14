
// This file is maintained for backward compatibility
// It re-exports all authentication functions from the new modular structure
export {
  signIn,
  signOut,
  getCurrentUser,
  setupAuthListener,
  signUp,
  requestPasswordReset,
  resetPassword
} from './auth/index';

// Add domain validation helpers
export const validateEmailDomain = (email: string, role: string): boolean => {
  if (!email) return false;
  
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

// Get semester count based on course name
export const getSemesterCountByProgram = (course: string): number => {
  // Course names should be case insensitive
  const normalizedCourse = course.toLowerCase();
  
  // Engineering courses (4 years = 8 semesters)
  if (normalizedCourse.includes('b.tech') || 
      normalizedCourse.includes('btech') || 
      normalizedCourse.includes('engineering') ||
      normalizedCourse.includes('b.e.')) {
    return 8;
  }
  
  // Medical courses (5.5 years = 11 semesters)
  if (normalizedCourse.includes('mbbs') || 
      normalizedCourse.includes('medicine')) {
    return 10;
  }
  
  // Standard bachelor degrees (3 years = 6 semesters)
  if (normalizedCourse.includes('bca') || 
      normalizedCourse.includes('bba') || 
      normalizedCourse.includes('bsc') || 
      normalizedCourse.includes('b.a') || 
      normalizedCourse.includes('b.sc') || 
      normalizedCourse.includes('b.com')) {
    return 6;
  }
  
  // Master degrees (2 years = 4 semesters)
  if (normalizedCourse.includes('mca') || 
      normalizedCourse.includes('mba') || 
      normalizedCourse.includes('m.tech') || 
      normalizedCourse.includes('mtech') || 
      normalizedCourse.includes('m.a') || 
      normalizedCourse.includes('m.sc')) {
    return 4;
  }
  
  // Default to 6 semesters (3 years) if not recognized
  return 6;
};
