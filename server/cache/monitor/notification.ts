import { isMonitorDown } from '../../database/queries/heartbeat.js';
import { fetchMonitor } from '../../database/queries/monitor.js';
import { fetchNotificationById } from '../../database/queries/notification.js';
import NotificationServices from '../../notifications/index.js';
import logger from '../../utils/logger.js';

const sendMonitorNotification = async (
  monitor: any,
  heartbeat: any,
  isDown: boolean,
  isRecovered: boolean
) => {
  try {
    if (!isDown && !isRecovered) return;

    const notifyOutage =
      monitor.notificationType === 'All' ||
      monitor.notificationType === 'Outage';

    const notifyRecovery =
      monitor.notificationType === 'All' ||
      monitor.notificationType === 'Recovery';

    const hasOutage = notifyOutage && isDown;

    const hasRecovered = notifyRecovery && isRecovered;

    if (!hasOutage && !hasRecovered) return;
    if (!monitor.notificationId) return;

    if (hasOutage && monitor.parentId) {
      const parentMonitor = await fetchMonitor(
        monitor.parentId,
        monitor.workspaceId
      ).catch(() => false);

      if (parentMonitor) {
        const isDown = await isMonitorDown(
          parentMonitor.monitorId,
          parentMonitor.workspaceId,
          parentMonitor.retry
        );

        if (isDown) return;
      }
    }

    const notification = await fetchNotificationById(
      monitor.notificationId,
      monitor.workspaceId
    );

    const platform =
      notification?.platform as keyof typeof NotificationServices;

    if (!notification?.isEnabled || !NotificationServices[platform]) {
      return;
    }

    const ServiceClass = NotificationServices[platform];

    if (!ServiceClass) return;

    const service = new ServiceClass();

    if (hasOutage) {
      // @ts-ignore
      await service.send(notification, monitor, heartbeat);
    }

    if (hasRecovered) {
      // @ts-ignore
      await service.sendRecovery(notification, monitor, heartbeat);
    }
  } catch (error: any) {
    logger.error('Notification - sendNotification', {
      error: error.message,
      stack: error.stack,
    });
  }
};

export default sendMonitorNotification;
