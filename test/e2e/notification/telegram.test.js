import loginDetails from '../setup/fixtures/login.json';
import telegramNotification from '../setup/fixtures/notifications/telegram.json';

describe('Notification - Telegram', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.loginUser(email, password);
    cy.visit('/notifications');
  });

  it('should show invalid errors and create notification', () => {
    //cy.clearAllNotifications(); 
    // Creates the notification using the JSON fixture data
    cy.createNotification(telegramNotification);

    // Verify the inputs contain the correct values after creation
    cy.get(telegramNotification.friendlyName.id).should('have.value', telegramNotification.friendlyName.value);
    cy.get(telegramNotification.token.id).should('have.value', telegramNotification.token.value);
    cy.get(telegramNotification.chatId.id).should('have.value', telegramNotification.chatId.value);
  });

  it('should show error if invalid name is given', () => {
    // 1. Clear and type invalid value directly into the input
    cy.get(telegramNotification.friendlyName.id)
      .clear()
      .type(telegramNotification.friendlyName.invalidValue);

    // 2. Click Save button (Action bar style based on Discord test)
    cy.get('.action-bar .luna-button.green').click();

    // 3. Verify error message
    cy.get(telegramNotification.friendlyName.error.id)
      .should('be.visible')
      .and('contain', telegramNotification.friendlyName.error.value);
  });

  it('should change the name and save', () => {
    // 1. Change to a temporary valid name
    cy.get(telegramNotification.friendlyName.id).clear().type('Test');
    cy.get('.action-bar .luna-button.green').click();

    // 2. Ensure error is gone
    cy.get(telegramNotification.friendlyName.error.id).should('not.exist');

    // 3. Revert to original name
    cy.get(telegramNotification.friendlyName.id).clear().type(telegramNotification.friendlyName.value);
    cy.get('.action-bar .luna-button.green').click();
  });

  it('should disable the notification', () => {
    // Target the specific disable toggle for Telegram based on the HTML structure
    // HTML Parent ID is "disableNotification"
    cy.get('#disableNotification .luna-switch-slider')
      .click({ force: true });

    // Save the form
    cy.get('.action-bar .luna-button.green').click({ force: true });

    // Verify switch input is NOT checked
    cy.get('#disableNotification input[type="checkbox"]')
      .should('be.checked');
  });

  it('should delete the notification', () => {
    // Delete using trash icon in header (Standardized across all notifications)
    cy.get('.navigation-header-buttons > div:nth-child(2)').click({ force: true });

    // Confirm delete popup
    cy.get('#notification-delete-confirm').click({ force: true });

    // Return to list and verify removal
    cy.visit('/notifications');
    cy.contains(telegramNotification.friendlyName.value).should('not.exist');
  });
});