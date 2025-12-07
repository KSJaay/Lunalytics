import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const username = 'test' + Date.now();
    const secondUsername = 'test2nd' + Date.now();

    it('Register two users', () => {
      // Register first user
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');

      cy.clearCookies();
      cy.clearLocalStorage();

      // Register second user
      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
      
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('Accept member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Navigate to settings
      cy.visit('/settings', { timeout: 10000 });
      
      // Wait for settings page to fully load
      cy.url().should('include', '/settings');
      cy.wait(1000);

      // Find and click Manage Team tab - force click if needed
      cy.contains('Manage Team', { timeout: 10000 })
        .should('exist')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      // Wait for team management section to render
      cy.wait(1000);

      // Find the accept button for the first user
      cy.get(`[id="accept-${username}"]`, { timeout: 10000 })
        .should('exist')
        .scrollIntoView()
        .wait(300)
        .click({ force: true });

      // Wait for modal to appear
      cy.wait(500);

      // Click the approve button in the modal
      cy.get('[id="manage-approve-button"]', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .wait(300)
        .click({ force: true });

      // Wait for approval to process
      cy.wait(2000);

      // Logout
      cy.clearCookies();
      cy.clearLocalStorage();

      // Login as the approved user
      cy.visit('/login');
      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');

      // Should be redirected to home
      cy.url({ timeout: 10000 }).should('include', '/home');
    });

    it('Decline member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Navigate to settings
      cy.visit('/settings', { timeout: 10000 });
      
      // Wait for settings page
      cy.url().should('include', '/settings');
      cy.wait(1000);

      // Click Manage Team tab
      cy.contains('Manage Team', { timeout: 10000 })
        .should('exist')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      // Wait for team section
      cy.wait(1000);

      // Find the decline button for second user
      cy.get(`[id="decline-${secondUsername}"]`, { timeout: 10000 })
        .should('exist')
        .scrollIntoView()
        .wait(300)
        .click({ force: true });

      // Wait for modal
      cy.wait(500);

      // Click decline confirmation button
      cy.get('[id="manage-decline-button"]', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .wait(300)
        .click({ force: true });

      // Wait for decline to process
      cy.wait(2000);

      // Logout
      cy.clearCookies();
      cy.clearLocalStorage();

      // Try to login as declined user - should fail
      cy.visit('/login');
      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      // Should stay on login page or show error
      cy.url({ timeout: 10000 }).should('include', '/login');
    });
  });
});
