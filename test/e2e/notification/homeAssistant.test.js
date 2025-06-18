import loginDetails from '../setup/fixtures/login.json';
import homeAssistantNotification from '../setup/fixtures/notifications/homeAssistant.json';

describe('Notification - HomeAssistant', () => {
  context('create a notification', () => {
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

  context('edit a notification', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/notifications');
    });

    it('should show error if invalid name is given', () => {
      cy.get(
        `[id="notification-configure-${homeAssistantNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(homeAssistantNotification.friendlyName.id, '{}[]||<>');
      cy.get('[id="notification-create-button"]').click();

      cy.equals(
        homeAssistantNotification.friendlyName.error.id,
        homeAssistantNotification.friendlyName.error.value
      );
    });

    it('should change the name and save', () => {
      cy.get(
        `[id="notification-configure-${homeAssistantNotification.friendlyName.value}"]`
      ).click();

      cy.typeText(homeAssistantNotification.friendlyName.id, 'Test');
      cy.get('[id="notification-create-button"]').click();

      cy.get(homeAssistantNotification.friendlyName.error.id).should('not.exist');
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
      const friendlyName = `${homeAssistantNotification.friendlyName.value}Test`;

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
      const friendlyName = `${homeAssistantNotification.friendlyName.value}Test`;

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).click();
      cy.get(`[id="notification-delete-${friendlyName}"]`).click();

      cy.get(`[id="notification-delete-confirm"]`).click();

      cy.get(`[id="notification-dropdown-${friendlyName}"]`).should(
        'not.exist'
      );
    });
  });
}); 