import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    // Use static but unique usernames for the test run
    const timestamp = Date.now();
    const username = 'test_' + timestamp;
    const secondUsername = 'test2nd_' + timestamp;

    beforeEach(() => {
      // Clear state before each test
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.clearSessionStorage();
    });

    it('Register two users', () => {
      // Register first user
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');
      cy.wait(1000); // Wait for registration to complete
      
      // Clear state
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.wait(500);

      // Register second user
      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
      cy.wait(1000); // Wait for registration to complete
    });

    it('Accept member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Wait for login to complete and redirect
      cy.url().should('not.include', '/login', { timeout: 10000 });
      cy.wait(1000);

      // Navigate to settings - using a more reliable approach
      cy.get('a[href="/settings"]', { timeout: 10000 })
        .should('exist')
        .click({ force: true });
      
      // Verify we're on settings page
      cy.url().should('include', '/settings', { timeout: 10000 });
      
      // Look for the team management section - try multiple selectors
      cy.get('[data-testid="manage-team-tab"], [href*="team"], .manage-team-tab, a:contains("Manage Team")', { timeout: 10000 })
        .first()
        .should('be.visible')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      // Wait for team management section to load
      cy.get('.team-management, [data-testid="team-list"], #team-list', { timeout: 10000 })
        .should('exist')
        .and('be.visible');

      // Check if the user is in the pending list
      cy.get(`[id="accept-${username}"], [data-testid="accept-${username}"], button:contains("Accept")`, { timeout: 15000 })
        .first()
        .should('exist')
        .and('be.visible')
        .scrollIntoView()
        .wait(300)
        .click({ force: true });

      // Wait for modal and confirm
      cy.get('[id="manage-approve-button"], [data-testid="approve-button"], button:contains("Approve")', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .wait(300)
        .click({ force: true });

      // Wait for approval to complete with visual confirmation
      cy.get(`[id="accept-${username}"], [data-testid="accept-${username}"]`, { timeout: 10000 })
        .should('not.exist');
      
      // Alternatively, look for success message
      cy.contains('accepted|approved|verified', { matchCase: false, timeout: 5000 })
        .should('exist')
        .wait(1000);

      // Logout
      cy.get('[data-testid="logout"], a[href="/logout"], button:contains("Logout")')
        .first()
        .click({ force: true });
      
      cy.wait(1000);
      cy.url().should('include', '/login');

      // Login as the approved user
      cy.visit('/login');
      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');

      // Verify successful login - should redirect to home/dashboard
      cy.url({ timeout: 10000 }).should('include', '/home');
      cy.contains('Welcome|Dashboard|Home', { matchCase: false, timeout: 5000 })
        .should('exist');
    });

    it('Decline member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Wait for login to complete
      cy.url().should('not.include', '/login', { timeout: 10000 });
      cy.wait(1000);

      // Navigate to settings
      cy.get('a[href="/settings"]', { timeout: 10000 })
        .should('exist')
        .click({ force: true });
      
      cy.url().should('include', '/settings', { timeout: 10000 });
      
      // Go to team management
      cy.get('[data-testid="manage-team-tab"], [href*="team"], .manage-team-tab, a:contains("Manage Team")', { timeout: 10000 })
        .first()
        .should('be.visible')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      // Wait for team section to load
      cy.get('.team-management, [data-testid="team-list"], #team-list', { timeout: 10000 })
        .should('exist')
        .and('be.visible');

      // Find and click decline button
      cy.get(`[id="decline-${secondUsername}"], [data-testid="decline-${secondUsername}"], button:contains("Decline")`, { timeout: 15000 })
        .first()
        .should('exist')
        .and('be.visible')
        .scrollIntoView()
        .wait(300)
        .click({ force: true });

      // Confirm decline in modal
      cy.get('[id="manage-decline-button"], [data-testid="decline-button"], button:contains("Confirm Decline")', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .wait(300)
        .click({ force: true });

      // Wait for decline to complete
      cy.get(`[id="decline-${secondUsername}"], [data-testid="decline-${secondUsername}"]`, { timeout: 10000 })
        .should('not.exist');
      
      cy.contains('declined|rejected', { matchCase: false, timeout: 5000 })
        .should('exist')
        .wait(1000);

      // Logout properly
      cy.get('[data-testid="logout"], a[href="/logout"], button:contains("Logout")')
        .first()
        .click({ force: true });
      
      cy.wait(1000);
      cy.url().should('include', '/login');

      // Try to login as declined user - should fail
      cy.visit('/login');
      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      // Should show error or stay on login page
      cy.url({ timeout: 5000 }).should('include', '/login');
      
      // Look for error message
      cy.contains('invalid|error|declined|not verified', { matchCase: false, timeout: 5000 })
        .should('exist');
    });
  });
});
