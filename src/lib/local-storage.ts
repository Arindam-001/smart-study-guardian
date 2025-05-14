
// Add the new STORAGE_KEYS
export const STORAGE_KEYS = {
  AUTH_USER: 'AUTH_USER',
  USERS: 'USERS',
  SUBJECTS: 'SUBJECTS',
  ASSIGNMENTS: 'ASSIGNMENTS',
  SUBMISSIONS: 'SUBMISSIONS',
  WARNINGS: 'WARNINGS',
  PERFORMANCE: 'PERFORMANCE',
};

// Get item from localStorage with proper type casting
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Set item in localStorage with proper serialization
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
}

// Remove item from localStorage
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}
