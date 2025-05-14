
import { useEffect } from 'react';
import { useAppContext } from '@/lib/context';
import { getItem, STORAGE_KEYS } from '@/lib/local-storage';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to handle real-time data synchronization between tabs and components
 */
export const useRealTimeSync = () => {
  const { 
    subjects,
    assignments,
    warnings,
    updateSubjects,
    user
  } = useAppContext();

  // Handle storage events to sync data between tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Only process events if we have a logged-in user
      if (!user) return;
      
      try {
        // Handle subjects updates
        if (event.key === STORAGE_KEYS.SUBJECTS && event.newValue) {
          const newSubjects = JSON.parse(event.newValue);
          if (JSON.stringify(newSubjects) !== JSON.stringify(subjects)) {
            updateSubjects(newSubjects);
            toast({
              title: "Data updated",
              description: "Subject data has been updated",
              duration: 2000,
            });
          }
        }
        
        // Handle assignments updates
        if (event.key === STORAGE_KEYS.ASSIGNMENTS && event.newValue) {
          const newAssignments = JSON.parse(event.newValue);
          if (JSON.stringify(newAssignments) !== JSON.stringify(assignments)) {
            // The AppContext will handle updating this data
            toast({
              title: "Data updated",
              description: "Assignment data has been updated",
              duration: 2000,
            });
          }
        }
        
        // Handle warnings updates
        if (event.key === STORAGE_KEYS.WARNINGS && event.newValue) {
          const newWarnings = JSON.parse(event.newValue);
          if (JSON.stringify(newWarnings) !== JSON.stringify(warnings)) {
            // The AppContext will handle updating this data
            if (newWarnings.length > warnings.length) {
              toast({
                title: "New warnings",
                description: "New warnings have been detected",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing storage change:', error);
      }
    };

    // Add event listener for storage events
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [subjects, assignments, warnings, updateSubjects, user]);

  // Check for data updates on component mount
  useEffect(() => {
    if (!user) return;
    
    const checkForUpdates = () => {
      try {
        // Check for subject updates
        const storedSubjects = getItem(STORAGE_KEYS.SUBJECTS, []);
        if (JSON.stringify(storedSubjects) !== JSON.stringify(subjects) && storedSubjects.length > 0) {
          updateSubjects(storedSubjects);
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };
    
    // Check for updates immediately and then every 30 seconds
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 30000);
    
    return () => clearInterval(interval);
  }, [user, subjects, updateSubjects]);
  
  return null;
};
