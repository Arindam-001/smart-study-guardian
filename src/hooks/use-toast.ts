
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useToastPrimitive,
  toast as toastPrimitive,
} from "@/components/ui/use-toast";

type ToastOptions = Omit<
  ToastProps,
  "id" | "className" | "toast"
> & {
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const useToast = () => {
  const { toast: hookToast } = useToastPrimitive();

  return {
    toast: (options: ToastOptions) => {
      hookToast(options);
    },
  };
};

const toast = (options: ToastOptions) => {
  toastPrimitive(options);
};

export { useToast, toast };
