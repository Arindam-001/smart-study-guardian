
// This file implements the core toast functionality

import * as React from "react";
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

// Define toast options type
export type ToastOptions = Omit<
  ToastProps,
  "id" | "className" | "toast"
> & {
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Create a context to manage toasts
type ToasterToast = ToastOptions & {
  id: string;
};

type ToasterContextValue = {
  toasts: ToasterToast[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToasterContext = React.createContext<ToasterContextValue | null>(null);

// Provider component that manages toast state
export function ToasterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const toast = React.useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, ...options }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToasterContext.Provider>
  );
}

// Hook to use toast functionality
export function useToast() {
  const context = React.useContext(ToasterContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider");
  }
  
  return context;
}

// Standalone toast function for use without hooks
const createStandaloneToast = () => {
  let toastFn: (options: ToastOptions) => string = () => "";
  
  const setToastFn = (fn: (options: ToastOptions) => string) => {
    toastFn = fn;
  };
  
  return {
    toast: (options: ToastOptions) => toastFn(options),
    setToastFn,
  };
};

const standaloneToast = createStandaloneToast();

export const toast = standaloneToast.toast;
export const setToastFunction = standaloneToast.setToastFn;
