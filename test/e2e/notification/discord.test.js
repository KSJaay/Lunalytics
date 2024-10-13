import loginDetails from '../setup/fixtures/login.json';
import discordNotification from '../setup/fixtures/notifications/discord.json';

describe('Notification - Discord', () => {
  context('create a notification', () => {
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

  context('edit a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show error if invalid name is given', () => {
      cy.get(
        `[id="notification-configure-${discordNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(discordNotification.friendlyName.id, '{}[]||<>');
      cy.get('[id="notification-create-button"]').click();

      cy.equals(
        discordNotification.friendlyName.error.id,
        discordNotification.friendlyName.error.value
      );
    });

    it('should change the name and save', () => {
      cy.get(
        `[id="notification-configure-${discordNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(discordNotification.friendlyName.id, 'Test');
      cy.get('[id="notification-create-button"]').click();

      cy.get(discordNotification.friendlyName.error.id).should('not.exist');
    });
  });

  context('disable a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    // Disable by clicking the three dots and then click disable

    it('should disable a notification', () => {
      const friendlyName = `${discordNotification.friendlyName.value}Test`;

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-toggle-${friendlyName}"]`).click();

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-toggle-${friendlyName}"]`).should(
        'have.text',
        'Enable'
      );
    });
  });

  context('delete a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should delete a notification', () => {
      const friendlyName = `${discordNotification.friendlyName.value}Test`;

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-delete-${friendlyName}"]`).click();

      cy.get(`[id="notification-delete-confirm"]`).click();

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).should(
        'not.exist'
      );
    });
  });
});
