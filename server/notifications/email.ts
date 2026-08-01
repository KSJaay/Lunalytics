import nodemailer from 'nodemailer';
import NotificationBase from './base.js';
import {
  EmailTemplateMessages,
  EmailTemplateObjects,
} from '../../shared/notifications/email.js';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';
import type { NotificationEmail } from '../../shared/types/notifications.js';
import type {
  MonitorProps,
  HeartbeatProps,
} from '../../shared/types/monitor.js';

class Email extends NotificationBase {
  name = 'Email';

  async send(
    notification: NotificationEmail,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      if (
        !EmailTemplateMessages[notification.messageType] ||
        !EmailTemplateObjects[notification.messageType]
      )
        return;

      const content = NotificationReplacers(
        EmailTemplateObjects[notification.messageType],
        monitor as any,
        heartbeat as any
      );

      const template = EmailTemplateMessages[notification.messageType](content);

      const emailOptions = {
        subject: `Lunalytics - ${monitor.name} is down!`,
        html: template,
      };

      await this.sendNotification(notification, emailOptions);
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification: NotificationEmail): Promise<void | string> {
    try {
      const emailComponent = EmailTemplateMessages.basic({
        serviceName: 'Lunalytics',
        dashboardUrl: 'https://lunalytics.xyz',
        timestamp: new Date().toISOString(),
      });

      const emailOptions = {
        subject: `Lunalytics - Test SMTP Email!`,
        html: emailComponent,
      };

      await this.sendNotification(notification, emailOptions);

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(
    notification: NotificationEmail,
    monitor: MonitorProps,
    heartbeat: HeartbeatProps
  ): Promise<void | string> {
    try {
      const content = NotificationReplacers(
        EmailTemplateObjects.recovery,
        monitor as any,
        heartbeat as any
      );

      const template = EmailTemplateMessages.recovery(content);

      const emailOptions = {
        subject: `Lunalytics - ${monitor.name} has recovered!`,
        html: template,
      };

      await this.sendNotification(notification, emailOptions);

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendNotification(
    notification: NotificationEmail,
    emailOptions: nodemailer.SendMailOptions
  ): Promise<nodemailer.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: notification.token,
      port: notification.data?.port || 587,
      secure: notification.data?.security,
      auth: {
        user: notification.data?.username,
        pass: notification.data?.password,
      },
    });

    return transporter.sendMail({
      from: notification.data?.fromEmail || notification.data?.username,
      to: notification.data?.toEmail,
      cc: notification.data?.ccEmail,
      bcc: notification.data?.bccEmail,
      ...emailOptions,
    });
  }
}

export default Email;
