import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-50/80 dark:bg-green-900/20';
      case 'error':
        return 'border-red-500/30 bg-red-50/80 dark:bg-red-900/20';
      case 'warning':
        return 'border-orange-500/30 bg-orange-50/80 dark:bg-orange-900/20';
      case 'info':
      default:
        return 'border-[#5a03cf]/30 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10';
    }
  };

  const getToastIcon = (type: ToastType) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600 dark:text-green-400`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-orange-600 dark:text-orange-400`} />;
      case 'info':
      default:
        return <Info className={`${iconClass} text-[#5a03cf]`} />;
    }
  };

  const getTextColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'text-green-900 dark:text-green-100';
      case 'error':
        return 'text-red-900 dark:text-red-100';
      case 'warning':
        return 'text-orange-900 dark:text-orange-100';
      case 'info':
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              min-w-[320px] max-w-md
              backdrop-blur-xl rounded-xl
              border-2 shadow-2xl
              p-4
              flex items-start gap-3
              animate-in slide-in-from-right-full duration-300
              ${getToastStyles(toast.type)}
            `}
          >
            {getToastIcon(toast.type)}
            <p className={`flex-1 text-sm ${getTextColor(toast.type)}`}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
