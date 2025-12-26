import loginDetails from '../setup/fixtures/login.json';
import emailNotification from '../setup/fixtures/notifications/email.json';
import emailUpdatedNotification from '../setup/fixtures/notifications/update/email.json';

describe('Notification - Apprise', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(emailNotification);
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
      cy.editNotification(emailUpdatedNotification);
    });
  });
});
