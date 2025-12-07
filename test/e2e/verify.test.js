import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const username = 'test' + Date.now();
    const secondUsername = 'test2nd' + Date.now();

    it('Register two users', () => {
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');

      cy.clearCookies();

      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
    });

    it('Accept member from settings', () => {
      cy.clearCookies();
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');

      // Wait for settings page to fully render
      cy.contains('Manage Team', { timeout: 8000 }).should('be.visible');

      // Re-get right before clicking to avoid detachment
      cy.contains('Manage Team').click();

      // Accept user
      cy.get(`[id="accept-${username}"]`)
        .should('be.visible')
        .click();

      cy.get('[id="manage-approve-button"]')
        .should('be.visible')
        .click();

      cy.clearCookies();
      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');

      cy.url().should('include', '/home');
    });

    it('Decline member from settings', () => {
      cy.clearCookies();

      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');

      // Again, wait for menu to be stable
      cy.contains('Manage Team', { timeout: 8000 }).should('be.visible');

      cy.contains('Manage Team').click();

      // Decline user
      cy.get(`[id="decline-${secondUsername}"]`)
        .should('be.visible')
        .click();

      cy.get('[id="manage-decline-button"]')
        .should('be.visible')
        .click();

      cy.clearCookies();
      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      cy.url().should('include', '/login');
    });
  });
});
