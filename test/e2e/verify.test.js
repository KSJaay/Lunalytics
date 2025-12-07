import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const username = 'test' + Date.now();
    const secondUsername = 'test2nd' + Date.now();

    it('Register two users', () => {
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');

      cy.clearCookies();
      cy.clearLocalStorage();

      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
    });

    it('Accept member from settings', () => {
      cy.clearCookies();
      cy.clearLocalStorage();

      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Load settings
      cy.visit('/settings');

      // Wait for page to stabilize
      cy.contains('Manage Team', { timeout: 10000 })
        .should('exist')
        .should('be.visible');

      // Re-query before click to prevent detachment
      cy.contains('Manage Team')
        .should('be.visible')
        .click();

      cy.wait(300); // minor UI re-render delay

      // Accept user button
      cy.get(`[id="accept-${username}"]`, { timeout: 8000 })
        .should('exist')
        .should('be.visible')
        .click();

      cy.get('[id="manage-approve-button"]', { timeout: 8000 })
        .should('exist')
        .should('be.visible')
        .click();

      cy.clearCookies();
      cy.clearLocalStorage();

      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');

      cy.url({ timeout: 8000 }).should('include', '/home');
    });

    it('Decline member from settings', () => {
      cy.clearCookies();
      cy.clearLocalStorage();

      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');

      cy.contains('Manage Team', { timeout: 10000 })
        .should('exist')
        .should('be.visible');

      cy.contains('Manage Team')
        .should('be.visible')
        .click();

      cy.wait(300); // allow re-render

      cy.get(`[id="decline-${secondUsername}"]`, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .click();

      cy.get('[id="manage-decline-button"]', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .click();

      cy.clearCookies();
      cy.clearLocalStorage();

      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      cy.url({ timeout: 8000 }).should('include', '/login');
    });
  });
});
