import nodemailer from 'nodemailer';
import Email from '../email.js';
import NotificationReplacers from '../../../shared/notifications/replacers/notification.js';
import {
  EmailTemplateMessages,
  EmailTemplateObjects,
} from '../../../shared/notifications/email.js';

jest.mock('nodemailer');
jest.mock('../../../shared/notifications/replacers/notification.js');

describe('Email Notifications', () => {
  let email;
  const mockNotification = {
    messageType: 'alert',
    token: 'smtp.example.com',
    data: {
      port: 587,
      security: false,
      username: 'user@example.com',
      password: 'password',
      fromEmail: 'from@example.com',
      toEmail: 'to@example.com',
    },
    payload: {},
  };
  const mockMonitor = { name: 'Test Monitor' };
  const mockHeartbeat = { status: 'up' };

  const mockTransporter = { sendMail: jest.fn() };

  beforeEach(() => {
    email = new Email();

    // Mock NotificationReplacers
    NotificationReplacers.mockImplementation(() => 'Processed content');

    // Mock EmailTemplateMessages functions
    EmailTemplateMessages.alert = jest.fn(async (content) => `<p>${content}</p>`);
    EmailTemplateMessages.recovery = jest.fn((content) => `<p>${content}</p>`);
    EmailTemplateMessages.basic = jest.fn((data) => `<p>Basic email</p>`);

    // Mock EmailTemplateObjects
    EmailTemplateObjects.alert = {};
    EmailTemplateObjects.recovery = {};

    // Mock nodemailer
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    mockTransporter.sendMail.mockClear();
  });

  it('should send notification successfully', async () => {
    mockTransporter.sendMail.mockResolvedValue({});

    const result = await email.send(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      EmailTemplateObjects.alert,
      mockMonitor,
      mockHeartbeat
    );
    expect(EmailTemplateMessages.alert).toHaveBeenCalledWith('Processed content');
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'Lunalytics - Test Monitor is down!',
      html: '<p>Processed content</p>',
    }));
    expect(result).toEqual(email.success);
  });

  it('should handle errors in send', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

    await expect(email.send(mockNotification, mockMonitor, mockHeartbeat))
      .rejects.toThrow('Error: SMTP Error');
  });

  it('should send test notification successfully', async () => {
    mockTransporter.sendMail.mockResolvedValue({});

    const result = await email.test(mockNotification);

    expect(EmailTemplateMessages.basic).toHaveBeenCalled();
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Lunalytics - Test SMTP Email!',
    }));
    expect(result).toEqual(email.success);
  });

  it('should handle errors in test', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

    await expect(email.test(mockNotification))
      .rejects.toThrow('Error: SMTP Error');
  });

  it('should send recovery notification successfully', async () => {
    mockTransporter.sendMail.mockResolvedValue({});

    const result = await email.sendRecovery(mockNotification, mockMonitor, mockHeartbeat);

    expect(NotificationReplacers).toHaveBeenCalledWith(
      EmailTemplateObjects.recovery,
      mockMonitor,
      mockHeartbeat
    );
    expect(EmailTemplateMessages.recovery).toHaveBeenCalledWith('Processed content');
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Lunalytics - Test Monitor has recovered!',
      html: '<p>Processed content</p>',
    }));
    expect(result).toEqual(email.success);
  });

  it('should handle errors in sendRecovery', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

    await expect(email.sendRecovery(mockNotification, mockMonitor, mockHeartbeat))
      .rejects.toThrow('Error: SMTP Error');
  });

  it('should return null if template or object is missing', async () => {
    const badNotification = { ...mockNotification, messageType: 'unknown' };
    const result = await email.send(badNotification, mockMonitor, mockHeartbeat);
    expect(result).toBeNull();
  });
});


