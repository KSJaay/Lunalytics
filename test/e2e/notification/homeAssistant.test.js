import loginDetails from '../setup/fixtures/login.json';
import homeAssistantNotification from '../setup/fixtures/notifications/homeAssistant.json';

describe('Notification - HomeAssistant', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.loginUser(email, password);
    cy.visit('/notifications');
  });

  it('should show invalid errors and create notification', () => {
    // Uses the custom command with the updated JSON structure
    cy.createNotification(homeAssistantNotification);

    // Verify inputs contain correct values after creation
    cy.get('#friendlyName').should('have.value', homeAssistantNotification.friendlyName.value);
    cy.get('#homeAssistantUrl').should('have.value', homeAssistantNotification.homeAssistantUrl.value);
    cy.get('#homeAssistantNotificationService').should('have.value', homeAssistantNotification.homeAssistantNotificationService.value);
  });

  it('should show error if invalid name is given', () => {
    // Directly type invalid value
    cy.get('#friendlyName').clear().type(homeAssistantNotification.friendlyName.invalidValue);
    
    // Click Save button in the action bar (Edit View)
    cy.get('.action-bar .luna-button.green').click();

    // Verify error message
    cy.get(homeAssistantNotification.friendlyName.error.id)
      .should('be.visible')
      .and('contain', homeAssistantNotification.friendlyName.error.value);
  });

  it('should change the name and save', () => {
    // Change to temp name
    cy.get('#friendlyName').clear().type('Test');
    cy.get('.action-bar .luna-button.green').click();

    // Verify error gone
    cy.get(homeAssistantNotification.friendlyName.error.id).should('not.exist');
    
    // Revert to original
    cy.get('#friendlyName').clear().type(homeAssistantNotification.friendlyName.value);
    cy.get('.action-bar .luna-button.green').click();
  });

  it('should disable the notification', () => {
    // Click the slider to toggle the switch OFF
    cy.get('.checkbox-container .luna-switch .luna-switch-slider')
      .first() // Ensures we target the first switch (Disable) if multiple exist
      .click({ force: true });

    // Save the form
    cy.get('.action-bar .luna-button.green').click({ force: true });

    // Verify switch is OFF
    cy.get('.checkbox-container input[type="checkbox"]')
      .first()
      .should('not.be.checked');
  });

  it('should delete the notification', () => {
    // Delete using trash icon in header
    cy.get('.navigation-header-buttons > div:nth-child(2)').click({ force: true });

    // Confirm delete popup
    cy.get('#notification-delete-confirm').click({ force: true });

    // Return to list and verify removal
    cy.visit('/notifications');
    cy.contains(homeAssistantNotification.friendlyName.value).should('not.exist');
  });
});