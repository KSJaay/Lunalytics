import loginDetails from '../setup/fixtures/login.json';
import homeAssistantNotification from '../setup/fixtures/notifications/homeAssistant.json';
import homeAssistantUpdatedNotification from '../setup/fixtures/notifications/update/homeAssistant.json';

describe('Notification - Home Assistant', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(homeAssistantNotification);
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
      cy.editNotification(homeAssistantUpdatedNotification);
    });
  });
});
