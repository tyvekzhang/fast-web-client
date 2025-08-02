import { message as antdMessage, notification as antdNotification } from 'antd';
import type { ArgsProps as MessageArgsProps } from 'antd/es/message';
import type { ArgsProps as NotificationArgsProps } from 'antd/es/notification';

/**
 * Custom hook for globally managed toasts.
 * Ensures only one toast (message/notification) is visible at a time.
 */
export function useGlobalToast() {
  // Destroy all existing messages and notifications
  const destroyAll = () => {
    antdMessage.destroy();
    antdNotification.destroy();
  };

  // Generic wrapper to create methods with auto-clear behavior
  const createMessageMethods = () => {
    const types = ['success', 'error', 'info', 'warning', 'loading'] as const;
    const methods = {} as {
      [K in (typeof types)[number]]: (
        content: React.ReactNode,
        duration?: number,
      ) => void;
    };

    types.forEach((type) => {
      methods[type] = (content, duration) => {
        destroyAll();
        antdMessage[type](content, duration);
      };
    });

    return {
      ...methods,
      open: (config: MessageArgsProps) => {
        destroyAll();
        antdMessage.open(config);
      },
      destroy: destroyAll,
    };
  };

  const createNotificationMethods = () => {
    const types = ['success', 'error', 'info', 'warning'] as const;
    const methods = {} as {
      [K in (typeof types)[number]]: (config: NotificationArgsProps) => void;
    };

    types.forEach((type) => {
      methods[type] = (config) => {
        destroyAll();
        antdNotification[type](config);
      };
    });

    return {
      ...methods,
      open: (config: NotificationArgsProps) => {
        destroyAll();
        antdNotification.open(config);
      },
      destroy: destroyAll,
    };
  };

  return {
    message: createMessageMethods(),
    notification: createNotificationMethods(),
  };
}
