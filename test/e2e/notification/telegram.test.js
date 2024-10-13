import loginDetails from '../setup/fixtures/login.json';
import telegramNotification from '../setup/fixtures/notifications/telegram.json';

describe('Notification - Telegram', () => {
  context('create a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(telegramNotification);

      cy.get(
        `[id="notification-configure-${telegramNotification.friendlyName.value}"]`
      ).should('exist');
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
        `[id="notification-configure-${telegramNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(telegramNotification.friendlyName.id, '{}[]||<>');
      cy.get('[id="notification-create-button"]').click();

      cy.equals(
        telegramNotification.friendlyName.error.id,
        telegramNotification.friendlyName.error.value
      );
    });

    it('should change the name and save', () => {
      cy.get(
        `[id="notification-configure-${telegramNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(telegramNotification.friendlyName.id, 'Test');
      cy.get('[id="notification-create-button"]').click();

      cy.get(telegramNotification.friendlyName.error.id).should('not.exist');
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
      const friendlyName = `${telegramNotification.friendlyName.value}Test`;

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
      const friendlyName = `${telegramNotification.friendlyName.value}Test`;

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-delete-${friendlyName}"]`).click();

      cy.get(`[id="notification-delete-confirm"]`).click();

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).should(
        'not.exist'
      );
    });
  });
});
