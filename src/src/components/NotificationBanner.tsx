import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export type BannerType = 'info' | 'success' | 'warning' | 'error';

interface NotificationBannerProps {
  message: string;
  type?: BannerType;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationBanner({ 
  message, 
  type = 'info', 
  dismissible = true,
  onDismiss,
  action 
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getBannerStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500/10 via-green-400/5 to-transparent',
          border: 'border-green-500/30',
          icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
          text: 'text-green-900 dark:text-green-100',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent',
          border: 'border-orange-500/30',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
          text: 'text-orange-900 dark:text-orange-100',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent',
          border: 'border-red-500/30',
          icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
          text: 'text-red-900 dark:text-red-100',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-[#5a03cf]/10 via-[#5a03cf]/5 to-transparent',
          border: 'border-[#5a03cf]/30',
          icon: <Info className="w-5 h-5 text-[#5a03cf]" />,
          text: 'text-gray-900 dark:text-white',
        };
    }
  };

  const styles = getBannerStyles();

  return (
    <div 
      className={`
        w-full backdrop-blur-xl border-2 ${styles.border} ${styles.bg}
        px-4 py-3 flex items-center gap-3
        shadow-lg
      `}
    >
      {styles.icon}
      
      <p className={`flex-1 text-sm ${styles.text}`}>
        {message}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-sm transition-all"
        >
          {action.label}
        </button>
      )}

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
