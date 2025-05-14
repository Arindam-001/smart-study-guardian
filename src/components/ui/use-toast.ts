
// This file re-exports from our hooks for backward compatibility
import { useToast as useToastHook, toast as toastAction } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastAction;
