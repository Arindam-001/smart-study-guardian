
// This file re-exports from our hooks for backward compatibility
import { useToast as useToastHook, toast as toastAction } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastAction;

// Add a function to handle cross-tab notifications
export const notifyAcrossTabs = (title: string, message: string) => {
  // Use the toast action directly
  toastAction({
    title,
    description: message,
  });
  
  // In a real application, you might use BroadcastChannel API or localStorage events
  // to communicate between tabs
  try {
    localStorage.setItem('lastNotification', JSON.stringify({
      title,
      message,
      timestamp: new Date().getTime()
    }));
  } catch (e) {
    console.error('Failed to store notification in localStorage', e);
  }
};
