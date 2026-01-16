import nodemailer from 'nodemailer';
import NotificationBase from './base.js';
import {
  EmailTemplateMessages,
  EmailTemplateObjects,
} from '../../shared/notifications/email.js';
import NotificationReplacers from '../../shared/notifications/replacers/notification.js';

class Email extends NotificationBase {
  name = 'Email';

  async send(notification, monitor, heartbeat) {
    try {
      if (
        !EmailTemplateMessages[notification.messageType] ||
        !EmailTemplateObjects[notification.messageType]
      )
        return null;

      const content = NotificationReplacers(
        EmailTemplateObjects[notification.messageType],
        monitor,
        heartbeat
      );

      const template =
        await EmailTemplateMessages[notification.messageType](content);

      const transporter = nodemailer.createTransport({
        host: notification.token,
        port: notification.data?.port || 587,
        secure: notification.data?.security,
        auth: {
          user: notification.data?.username,
          pass: notification.data?.password,
        },
      });

      const emailOptions = {
        from: notification.data?.fromEmail || notification.data?.username,
        to: notification.data?.toEmail,
        cc: notification.data?.ccEmail,
        bcc: notification.data?.bccEmail,
        subject: `Lunalytics - ${monitor.name} is down!`,
        html: template,
      };

      await transporter.sendMail(emailOptions);
      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async test(notification) {
    try {
      const transporter = nodemailer.createTransport({
        host: notification.token,
        port: notification.data?.port || 587,
        secure: notification.data?.security,
        auth: {
          user: notification.data?.username,
          pass: notification.data?.password,
        },
      });

      const emailComponent = EmailTemplateMessages.basic({
        serviceName: 'Lunalytics',
        dashboardUrl: 'https://lunalytics.xyz',
        timestamp: new Date().toISOString(),
      });

      const emailOptions = {
        from: notification.data?.fromEmail || notification.data?.username,
        to: notification.data?.toEmail,
        cc: notification.data?.ccEmail,
        bcc: notification.data?.bccEmail,
        subject: `Lunalytics - Test SMTP Email!`,
        html: emailComponent,
      };

      await transporter.sendMail(emailOptions);

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendRecovery(notification, monitor, heartbeat) {
    try {
      const content = NotificationReplacers(
        EmailTemplateObjects.recovery,
        monitor,
        heartbeat
      );

      const template = EmailTemplateMessages.recovery(content);

      const transporter = nodemailer.createTransport({
        host: notification.token,
        port: notification.data?.port || 587,
        secure: notification.data?.security,
        auth: {
          user: notification.data?.username,
          pass: notification.data?.password,
        },
      });

      const emailOptions = {
        from: notification.data?.fromEmail || notification.data?.username,
        to: notification.data?.toEmail,
        cc: notification.data?.ccEmail,
        bcc: notification.data?.bccEmail,
        subject: `Lunalytics - ${monitor.name} has recovered!`,
        html: template,
      };

      await transporter.sendMail(emailOptions);

      return this.success;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default Email;
