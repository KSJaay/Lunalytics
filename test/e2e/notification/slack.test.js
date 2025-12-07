import loginDetails from '../setup/fixtures/login.json';
import slackNotification from '../setup/fixtures/notifications/slack.json';

describe('Notification - Slack', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.loginUser(email, password);
    cy.visit('/notifications');
  });

  it('should show invalid errors and create notification', () => {
    // Creates the notification using the JSON fixture data
    cy.createNotification(slackNotification);

    // Verify the inputs contain the correct values after creation
    cy.get(slackNotification.friendlyName.id).should('have.value', slackNotification.friendlyName.value);
    cy.get(slackNotification.url.id).should('have.value', slackNotification.url.value);
    cy.get(slackNotification.channel.id).should('have.value', slackNotification.channel.value);
  });

  it('should show error if invalid name is given', () => {
    // Directly type invalid value
    cy.get(slackNotification.friendlyName.id)
      .clear()
      .type(slackNotification.friendlyName.invalidValue);

    // Click Save button in the new UI
    cy.get('.action-bar .luna-button.green').click();

    // Verify error message
    cy.get(slackNotification.friendlyName.error.id)
      .should('be.visible')
      .and('contain', slackNotification.friendlyName.error.value);
  });

  it('should change the name and save', () => {
    // 1. Change to a temporary valid name
    cy.get(slackNotification.friendlyName.id).clear().type('Test');
    cy.get('.action-bar .luna-button.green').click();

    // 2. Ensure error is gone
    cy.get(slackNotification.friendlyName.error.id).should('not.exist');

    // 3. Revert to original name
    cy.get(slackNotification.friendlyName.id).clear().type(slackNotification.friendlyName.value);
    cy.get('.action-bar .luna-button.green').click();
  });

  it('should disable the notification', () => {
    // Click the slider to toggle the switch OFF
    // Note: Assuming 'Disable Notification' is the first switch or targeting generic container like Discord test
    cy.get('.checkbox-container .luna-switch .luna-switch-slider')
      .first()
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
    cy.contains(slackNotification.friendlyName.value).should('not.exist');
  });
});