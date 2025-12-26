import loginDetails from '../setup/fixtures/login.json';
import discordNotification from '../setup/fixtures/notifications/discord.json';
import discordUpdatedNotification from '../setup/fixtures/notifications/update/discord.json';

describe('Notification - Discord', () => {
  context('create notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(discordNotification);
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
      cy.editNotification(discordUpdatedNotification);
    });
  });
});
