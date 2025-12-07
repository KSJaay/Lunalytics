import loginDetails from '../setup/fixtures/login.json';
import discordNotification from '../setup/fixtures/notifications/discord.json';

describe('Notification - Discord', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.loginUser(email, password);
    cy.visit('/notifications');
  });

  it('should show invalid errors and create notification', () => {
    cy.clearAllNotifications(); 
    cy.createNotification(discordNotification);

    // You can directly target the inputs after creation
    cy.get('#friendlyName').should('have.value', discordNotification.friendlyName.value);
  });

  it('should show error if invalid name is given', () => {
    // Directly type invalid value
    cy.get('#friendlyName').clear().type('{}[]||<>');
    
    // Click Save button in the new UI
    cy.get('.action-bar .luna-button.green').click();

    // Verify error message
    cy.get('#error-friendlyName')
      .should('be.visible')
      .and('contain', discordNotification.friendlyName.error.value);
  });

  it('should change the name and save', () => {
    cy.get('#friendlyName').clear().type('Test');

    cy.get('.action-bar .luna-button.green').click();

    cy.get('#error-friendlyName').should('not.exist');
    cy.get('#friendlyName').clear().type('Discord');
    cy.get('.action-bar .luna-button.green').click();
  });

  it('should disable the notification', () => {
  // Click the slider to toggle the switch OFF
  cy.get('.checkbox-container .luna-switch .luna-switch-slider')
    .click({ force: true });

  // Save the form
  cy.get('.action-bar .luna-button.green').click({ force: true });

  // Verify switch is OFF
  cy.get('.checkbox-container input[type="checkbox"]')
    .should('not.be.checked');
});


 it('should delete the notification', () => {
  // Create fresh notification first
  //cy.createNotification(discordNotification);
  
  // Now delete it using trash icon in header
  cy.get('.navigation-header-buttons > div:nth-child(2)').click({ force: true });
  
  // Confirm delete popup
  cy.get('#notification-delete-confirm').click({ force: true });
   cy.visit('/notifications');
  // Verify it's gone
  cy.contains(discordNotification.friendlyName.value).should('not.exist');
});




  
});
