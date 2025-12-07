import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const timestamp = Date.now();
    const username = 'test_' + timestamp;
    const secondUsername = 'test2nd_' + timestamp;

    before(() => {
      // Clear all storage once before all tests
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    beforeEach(() => {
      // Just visit logout to clear session if possible
      cy.visit('/logout');
    });

    it('Register two users', () => {
      // Register first user
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');
      
      // Register second user
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
      // Debug: log what we're looking for
      console.log('Looking for user:', username);
      
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');
      
      // Debug: check what's on the page
      cy.get('body').then(($body) => {
        console.log('Page contains:', $body.text().substring(0, 200));
      });

      // Look for any team management related text
      cy.get('a, button, span, div').contains(/manage.*team|team.*manage/i, { timeout: 10000 })
        .click();
      
      // Wait and look for the accept button
      cy.get(`button[id*="accept"], button:contains("Accept")`, { timeout: 15000 })
        .first()
        .click();
      
      // Look for confirmation button
      cy.get('button:contains("Approve"), button:contains("Confirm")', { timeout: 10000 })
        .click();
      
      cy.wait(2000);
      
      // Try to login as accepted user
      cy.visit('/logout');
      cy.visit('/login');
      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');
      
      cy.url().should('include', '/home');
    });

    it('Decline member from settings', () => {
      console.log('Declining user:', secondUsername);
      
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');
      
      cy.contains(/manage.*team|team.*manage/i, { timeout: 10000 })
        .click();
      
      cy.get(`button[id*="decline"], button:contains("Decline")`, { timeout: 15000 })
        .first()
        .click();
      
      cy.get('button:contains("Decline"), button:contains("Reject")', { timeout: 10000 })
        .click();
      
      cy.wait(2000);
      
      cy.visit('/logout');
      cy.visit('/login');
      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');
      
      // Should fail to login
      cy.url().should('include', '/login');
    });
  });
});
