import loginDetails from '../setup/fixtures/login.json';
import webhookNotification from '../setup/fixtures/notifications/webhooks.json';

describe('Notification - Telegram', () => {
  context('create a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show invalid errors and create notification', () => {
      cy.createNotification(webhookNotification);

      cy.get(
        `[id="notification-configure-${webhookNotification.friendlyName.value}"]`
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
        `[id="notification-configure-${webhookNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(webhookNotification.friendlyName.id, '{}[]||<>');
      cy.get('[id="notification-create-button"]').click();

      cy.equals(
        webhookNotification.friendlyName.error.id,
        webhookNotification.friendlyName.error.value
      );
    });

    it('should change the name and save', () => {
      cy.get(
        `[id="notification-configure-${webhookNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(webhookNotification.friendlyName.id, 'Test');
      cy.get('[id="notification-create-button"]').click();

      cy.get(webhookNotification.friendlyName.error.id).should('not.exist');
    });
  });

  context('disable a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should disable a notification', () => {
      const friendlyName = `${webhookNotification.friendlyName.value}Test`;

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
      const friendlyName = `${webhookNotification.friendlyName.value}Test`;

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-delete-${friendlyName}"]`).click();

      cy.get(`[id="notification-delete-confirm"]`).click();

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).should(
        'not.exist'
      );
    });
  });
});
