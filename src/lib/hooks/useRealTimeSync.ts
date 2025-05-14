
import { useEffect } from 'react';
import { STORAGE_KEYS, getItem } from '@/lib/local-storage';

/**
 * A hook to handle real-time synchronization of data across browser tabs
 */
export const useRealTimeSync = (updateCallbacks: Record<string, (data: any) => void>) => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;
      
      // Extract the storage key from the event
      const key = event.key;
      
      // Find the corresponding update callback for this key
      const updateCallback = Object.entries(updateCallbacks).find(
        ([callbackKey]) => key.includes(callbackKey)
      );
      
      // If we have a matching callback, execute it with the new data
      if (updateCallback) {
        const [, callback] = updateCallback;
        const newData = JSON.parse(event.newValue);
        callback(newData);
      }
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateCallbacks]);
  
  // Initialize data from localStorage
  useEffect(() => {
    Object.entries(updateCallbacks).forEach(([key, callback]) => {
      const storageKey = Object.values(STORAGE_KEYS).find(
        (storageKey) => storageKey.includes(key.toLowerCase())
      );
      
      if (storageKey) {
        const data = getItem(storageKey, null);
        if (data) {
          callback(data);
        }
      }
    });
  }, [updateCallbacks]);
  
  return null;
};

export default useRealTimeSync;
