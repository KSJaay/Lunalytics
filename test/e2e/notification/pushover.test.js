import loginDetails from '../setup/fixtures/login.json';
import pushoverNotification from '../setup/fixtures/notifications/pushover.json';
import pushoverUpdatedNotification from '../setup/fixtures/notifications/update/pushover.json';

describe('Notification - Pushover', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(pushoverNotification);
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
      cy.editNotification(pushoverUpdatedNotification);
    });
  });
});
