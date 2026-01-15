import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoCloseOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface InAppNotificationBannerProps {
  notification: InAppNotification;
  onClose: (id: string) => void;
}

const InAppNotificationBanner = ({ notification, onClose }: InAppNotificationBannerProps) => {
  const { id, title, message, type = 'info', action } = notification;

  const colors = {
    info: {
      bg: 'from-indigo-600 to-purple-600',
      icon: 'text-white',
    },
    success: {
      bg: 'from-emerald-600 to-teal-600',
      icon: 'text-white',
    },
    warning: {
      bg: 'from-amber-600 to-orange-600',
      icon: 'text-white',
    },
    error: {
      bg: 'from-red-600 to-rose-600',
      icon: 'text-white',
    },
  };

  const Icon = type === 'success' ? IoCheckmarkCircleOutline : IoNotificationsOutline;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="mx-4 mb-3 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
      <div className={`bg-gradient-to-r ${colors[type].bg} p-4`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl">
            <Icon className={colors[type].icon} size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <p className="mt-1 line-clamp-2 text-xs text-white/90">{message}</p>

            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  onClose(id);
                }}
                className="mt-2 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                {action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => onClose(id)}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white">
            <IoCloseOutline size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const InAppNotificationContainer = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event: CustomEvent<InAppNotification>) => {
      const notification = event.detail;

      // Add notification
      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after duration
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    };

    window.addEventListener('show-in-app-notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('show-in-app-notification', handleNotification as EventListener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="pt-safe pointer-events-none fixed inset-x-0 top-0 z-[9999]">
      <div className="pointer-events-auto flex flex-col-reverse">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <InAppNotificationBanner key={notification.id} notification={notification} onClose={removeNotification} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 알림
export const showInAppNotification = (notification: Omit<InAppNotification, 'id'>) => {
  const event = new CustomEvent('show-in-app-notification', {
    detail: {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
    },
  });
  window.dispatchEvent(event);
};
