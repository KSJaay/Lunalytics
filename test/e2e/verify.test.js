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

      // Wait for page to load and stabilize
      cy.contains('Manage Team', { timeout: 10000 }).should('be.visible');

      // Use alias pattern to prevent detachment
      cy.contains('Manage Team').as('manageTeamTab');
      cy.get('@manageTeamTab').click();

      // Wait for the team management section to load
      cy.wait(500);

      // Accept user - use alias to prevent detachment
      cy.get(`[id="accept-${username}"]`, { timeout: 8000 })
        .should('be.visible')
        .as('acceptBtn');
      
      cy.get('@acceptBtn').click();

      // Confirm approval
      cy.get('[id="manage-approve-button"]', { timeout: 8000 })
        .should('be.visible')
        .as('approveBtn');
      
      cy.get('@approveBtn').click();

      // Verify acceptance was successful (wait for modal to close or success message)
      cy.wait(1000);

      // Login as the newly approved user
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

      // Wait for page load
      cy.contains('Manage Team', { timeout: 10000 }).should('be.visible');

      // Use alias to prevent detachment
      cy.contains('Manage Team').as('manageTeamTab');
      cy.get('@manageTeamTab').click();

      // Wait for team section to render
      cy.wait(500);

      // Decline user - use alias pattern
      cy.get(`[id="decline-${secondUsername}"]`, { timeout: 10000 })
        .should('be.visible')
        .as('declineBtn');
      
      cy.get('@declineBtn').click();

      // Confirm decline
      cy.get('[id="manage-decline-button"]', { timeout: 10000 })
        .should('be.visible')
        .as('confirmDeclineBtn');
      
      cy.get('@confirmDeclineBtn').click();

      // Wait for action to complete
      cy.wait(1000);

      // Try to login as declined user - should fail and redirect to login
      cy.clearCookies();
      cy.clearLocalStorage();

      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      cy.url({ timeout: 8000 }).should('include', '/login');
    });
  });
});
