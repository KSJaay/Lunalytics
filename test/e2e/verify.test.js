import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const timestamp = Date.now();
    const username = 'test_' + timestamp;
    const secondUsername = 'test2nd_' + timestamp;

    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('Register two users', () => {
      // Register first user
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');
      
      // Wait for success
      cy.contains(/registered|success|welcome/i, { timeout: 10000 }).should('exist');
      cy.wait(1000);
      
      // Register second user
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
      
      // Wait for success
      cy.contains(/registered|success|welcome/i, { timeout: 10000 }).should('exist');
    });

    it('Accept member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Wait for successful login
      cy.url().should('not.include', '/login', { timeout: 10000 });
      cy.wait(2000); // Wait for full page load

      // Go to settings - use a more direct approach
      cy.visit('/settings');
      
      // Debug: Take a screenshot to see what's on the page
      cy.screenshot('settings-page-before-manage-team');
      
      // Wait for settings page to load completely
      cy.get('body').should('be.visible');
      cy.wait(1000);

      // Try different approaches to find the Manage Team section
      // Approach 1: Look for tabs/links
      cy.get('body').then(($body) => {
        const teamSelectors = [
          'a:contains("Manage Team")',
          'button:contains("Manage Team")',
          'span:contains("Manage Team")',
          'div:contains("Manage Team")',
          '[data-testid*="team"]',
          '[href*="team"]',
          '.team-tab',
          '#team-tab'
        ];
        
        let found = false;
        teamSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            found = true;
            cy.get(selector).first().click({ force: true });
          }
        });
        
        if (!found) {
          // If no specific selector found, try to click on anything that looks like a tab
          cy.get('nav a, .tab, .nav-item, [role="tab"]').first().click();
        }
      });

      // Wait for the team management section to load
      cy.wait(3000);
      
      // Take another screenshot to see what's displayed
      cy.screenshot('after-clicking-team-tab');

      // Now look for pending users - try multiple strategies
      cy.get('body').then(($body) => {
        // Strategy 1: Look for user by name in the page
        if ($body.text().includes(username)) {
          cy.contains(username, { timeout: 10000 })
            .parents('tr, div, li')
            .within(() => {
              cy.get('button:contains("Accept"), button:contains("Approve")')
                .first()
                .click({ force: true });
            });
        } 
        // Strategy 2: Look for any accept buttons
        else if ($body.find('button:contains("Accept")').length > 0) {
          cy.get('button:contains("Accept")').first().click({ force: true });
        }
        // Strategy 3: Look for specific ID
        else if ($body.find(`[id*="accept-${username}"]`).length > 0) {
          cy.get(`[id*="accept-${username}"]`).click({ force: true });
        }
        else {
          // Last resort: get all buttons and click the first one that might be accept
          cy.get('button').each(($btn) => {
            if ($btn.text().match(/accept|approve/i)) {
              cy.wrap($btn).click({ force: true });
              return false; // break the loop
            }
          });
        }
      });

      // Wait for modal to appear
      cy.wait(1000);
      
      // Click confirm button in modal
      cy.get('body').then(($body) => {
        if ($body.find('[id="manage-approve-button"]').length > 0) {
          cy.get('[id="manage-approve-button"]').click();
        } else if ($body.find('button:contains("Confirm")').length > 0) {
          cy.get('button:contains("Confirm")').first().click();
        } else if ($body.find('button:contains("Approve")').length > 0) {
          cy.get('button:contains("Approve")').first().click();
        } else {
          // Try to find any button in a modal/dialog
          cy.get('.modal button, .dialog button, [role="dialog"] button')
            .contains(/approve|confirm|yes|ok/i)
            .click();
        }
      });

      // Wait for action to complete
      cy.wait(3000);
      
      // Clear state and test login
      cy.clearCookies();
      cy.clearLocalStorage();
      
      cy.visit('/login');
      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');
      
      // Should be able to login now
      cy.url().should('include', '/home', { timeout: 10000 });
    });

    it('Decline member from settings', () => {
      // Login as owner
      cy.visit('/login');
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      // Wait for login
      cy.url().should('not.include', '/login', { timeout: 10000 });
      cy.wait(2000);

      // Go to settings
      cy.visit('/settings');
      cy.wait(1000);

      // Find and click Manage Team - with better element handling
      cy.get('body').then(($body) => {
        const teamLink = $body.find('a:contains("Manage Team"), button:contains("Manage Team")').first();
        if (teamLink.length) {
          // Store the selector and click it separately to avoid detachment
          const selector = teamLink.is('a') ? 'a:contains("Manage Team")' : 'button:contains("Manage Team")';
          cy.get(selector).first().click();
        } else {
          // Try to find any navigation to team settings
          cy.get('[href*="team"], [data-testid*="team"]').first().click();
        }
      });

      // Wait for content to load
      cy.wait(3000);
      
      // Look for the second user to decline
      cy.get('body').then(($body) => {
        // Try to find the decline button for the specific user
        const declineSelectors = [
          `[id*="decline-${secondUsername}"]`,
          `button:contains("Decline"):has(+ *:contains(${secondUsername}))`,
          `tr:contains(${secondUsername}) button:contains("Decline")`,
          `div:contains(${secondUsername}) ~ button:contains("Decline")`
        ];
        
        let clicked = false;
        declineSelectors.forEach((selector, index) => {
          if (!$body.find(selector).length) return;
          
          // Use alias to prevent detachment issues
          cy.get(selector).as(`declineBtn${index}`).should('be.visible');
          cy.get(`@declineBtn${index}`).click({ force: true });
          clicked = true;
        });
        
        if (!clicked) {
          // Fallback: click first decline button found
          cy.get('button:contains("Decline")').first().click({ force: true });
        }
      });

      // Handle confirmation modal
      cy.wait(1000);
      cy.get('body').then(($body) => {
        const confirmSelectors = [
          '[id="manage-decline-button"]',
          'button:contains("Confirm Decline")',
          'button:contains("Reject")',
          '.modal button:contains("Yes")',
          '.modal button:contains("Confirm")'
        ];
        
        confirmSelectors.forEach((selector, index) => {
          if ($body.find(selector).length) {
            cy.get(selector).as(`confirmBtn${index}`).should('be.visible');
            cy.get(`@confirmBtn${index}`).click();
          }
        });
      });

      // Wait for decline to process
      cy.wait(3000);
      
      // Clear state
      cy.clearCookies();
      cy.clearLocalStorage();
      
      // Try to login as declined user
      cy.visit('/login');
      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');
      
      // Should fail to login - stay on login page
      cy.url().should('include', '/login', { timeout: 5000 });
      
      // Optional: check for error message
      cy.get('body').should('contain', /error|invalid|declined|unverified/i);
      // Add this anywhere to debug
      cy.get('body').then(($body) => {
        console.log('All buttons on page:', $body.find('button').map((i, el) => el.outerHTML).get());
        console.log('All links on page:', $body.find('a').map((i, el) => el.outerHTML).get());
});
    });
  });
});
