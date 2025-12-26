import loginDetails from '../setup/fixtures/login.json';
import webhookNotification from '../setup/fixtures/notifications/webhooks.json';
import webhookUpdatedNotification from '../setup/fixtures/notifications/update/webhooks.json';

describe('Notification - Webhook', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(webhookNotification);
    });
  });

  context('edit & delete notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    after(() => {
      cy.deleteNotification();
    });

    it('should show invalid errors and update notification', () => {
      cy.editNotification(webhookUpdatedNotification);
    });
  });
});
