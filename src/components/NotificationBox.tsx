import { X, Info, CheckCircle, AlertCircle, AlertTriangle, Bell } from 'lucide-react';
import { ReactNode } from 'react';

export type NotificationBoxType = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface NotificationBoxProps {
  title?: string;
  message: string | ReactNode;
  type?: NotificationBoxType;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  icon?: ReactNode;
  className?: string;
}

export function NotificationBox({ 
  title,
  message, 
  type = 'neutral', 
  onClose,
  actions,
  icon,
  className = ''
}: NotificationBoxProps) {

  const getBoxStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50/80 dark:bg-green-900/20',
          border: 'border-green-500/30',
          iconBg: 'bg-green-100 dark:bg-green-900/40',
          defaultIcon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
          titleColor: 'text-green-900 dark:text-green-100',
          textColor: 'text-green-800 dark:text-green-200',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50/80 dark:bg-orange-900/20',
          border: 'border-orange-500/30',
          iconBg: 'bg-orange-100 dark:bg-orange-900/40',
          defaultIcon: <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
          titleColor: 'text-orange-900 dark:text-orange-100',
          textColor: 'text-orange-800 dark:text-orange-200',
        };
      case 'error':
        return {
          bg: 'bg-red-50/80 dark:bg-red-900/20',
          border: 'border-red-500/30',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          defaultIcon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
          titleColor: 'text-red-900 dark:text-red-100',
          textColor: 'text-red-800 dark:text-red-200',
        };
      case 'info':
        return {
          bg: 'bg-blue-50/80 dark:bg-blue-900/20',
          border: 'border-blue-500/30',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40',
          defaultIcon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          titleColor: 'text-blue-900 dark:text-blue-100',
          textColor: 'text-blue-800 dark:text-blue-200',
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-white/70 dark:bg-gray-900/70',
          border: 'border-gray-300/30 dark:border-gray-700/30',
          iconBg: 'bg-gray-100 dark:bg-gray-800',
          defaultIcon: <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
          titleColor: 'text-gray-900 dark:text-white',
          textColor: 'text-gray-700 dark:text-gray-300',
        };
    }
  };

  const styles = getBoxStyles();

  const getActionButtonStyles = (variant?: 'primary' | 'secondary' | 'danger') => {
    switch (variant) {
      case 'primary':
        return 'px-4 py-2 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-lg hover:shadow-lg transition-all';
      case 'danger':
        return 'px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all';
      case 'secondary':
      default:
        return 'px-4 py-2 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg transition-all';
    }
  };

  return (
    <div 
      className={`
        backdrop-blur-xl rounded-2xl border-2 shadow-lg
        ${styles.bg} ${styles.border}
        p-4
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon || styles.defaultIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold mb-1 ${styles.titleColor}`}>
              {title}
            </h4>
          )}
          <div className={`text-sm ${styles.textColor}`}>
            {message}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={getActionButtonStyles(action.variant)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
