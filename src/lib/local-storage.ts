
// Utility functions for working with localStorage

// Generic function to get an item from localStorage
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return defaultValue;
  }
}

// Generic function to set an item in localStorage
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
}

// Remove an item from localStorage
export function removeItem(key: string): void {
  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
}

// Clear all items in localStorage
export function clearAllData(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Keys used in localStorage
export const STORAGE_KEYS = {
  AUTH_USER: 'auth_user',
  USERS: 'users',
  SUBJECTS: 'subjects',
  NOTES: 'notes',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  WARNINGS: 'warnings',
  STUDENT_PERFORMANCE: 'student_performance',
};
