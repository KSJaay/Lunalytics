import loginDetails from '../setup/fixtures/login.json';
import appriseNotification from '../setup/fixtures/notifications/apprise.json';
import appriseUpdatedNotification from '../setup/fixtures/notifications/update/apprise.json';

describe('Notification - Apprise', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(appriseNotification);
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
      cy.editNotification(appriseUpdatedNotification);
    });
  });
});
