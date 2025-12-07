Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('equals', (id, value) => {
  return cy.get(id).invoke('text').should('eq', value);
});

Cypress.Commands.add('typeText', (id, value) => {
  return cy.get(id).type(`${value}`, { parseSpecialCharSequences: false });
});

Cypress.Commands.add('clearText', (id) => {
  return cy.get(id).clear();
});

Cypress.Commands.add('registerUser', (email, username, password) => {
  cy.visit('/register');

  cy.typeText('[id="email"]', email).clickOutside();
  cy.get('[class="luna-button-content"]').click();
  cy.typeText('[id="username"]', username).clickOutside();

  cy.typeText('[id="password"]', password).clickOutside();
  cy.typeText('[id="confirmPassword"]', password).clickOutside();

  cy.get('[class="luna-button-content"]').click();
  cy.wait(1000);
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/login');

  cy.typeText('[id="email"]', email).clickOutside();
  cy.get('[class="luna-button-content"]').click();
  cy.typeText('[id="password"]', password).clickOutside();

  cy.get('[class="luna-button-content"]').click();
});

Cypress.Commands.add('createMonitor', (details = {}) => {
  // Start creating monitor
  cy.get('[class="luna-button primary flat"]', { timeout: 15000 }).click();

  const advancedKeys = ['headers', 'body', 'interval', 'retryInterval', 'timeout', 'statusCodes', 'ignoreTls'];

  let advancedOpened = false;

  Object.keys(details).forEach((key) => {
    const field = details[key];
    if (!field) return;

    const { id, value, error, type, invalidValue } = field;

    // Open Advanced panel if this is an advanced field and not yet opened
    if (advancedKeys.includes(key) && !advancedOpened) {
      cy.contains('div.monitor-configure-page-button', 'Advanced')
        .should('be.visible')
        .click({ force: true });
      cy.wait(300);
      advancedOpened = true;
    }

    // Handle invalid value tests first (optional)
    if (invalidValue) {
      if (type === 'text' || type === 'textarea') {
        cy.get(id).type(invalidValue, { parseSpecialCharSequences: false });
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(invalidValue).click();
      }

      cy.get('[class="luna-button green flat"]', { timeout: 15000 }).click();

      if (error) {
        cy.get(error.id, { timeout: 15000 }).should('be.visible');
        cy.equals(error.id, error.value);
      }
    }

    // Apply valid value
    if (value !== undefined) {
      if (type === 'text' || type === 'textarea') {
        cy.get(id).clear().type(value, { parseSpecialCharSequences: true });
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(value).click();
      } else if (type === 'switch') {
        if (value) cy.get(id).click({ force: true });
      }
    }
  });

  // Save monitor
  cy.get('[class="luna-button green flat"]', { timeout: 15000 }).click();
});

Cypress.Commands.add('typeTextSafe', (selector, text) => {
  cy.get(selector, { timeout: 15000 })
    .should('be.visible')
    .then($el => {
      cy.wrap($el).clear().type(text, { parseSpecialCharSequences: false });
    });
});

Cypress.Commands.add('typeTextSafe', (selector, text) => {
  cy.get(selector, { timeout: 15000 })
    .should('be.visible')
    .then($el => {
      cy.wrap($el).clear().type(text, { parseSpecialCharSequences: false });
    });
});

Cypress.Commands.add('createNotification', (details = {}) => {
  // Open Add Notification modal
  cy.get('.luna-button-content')
    .contains('Add Notification')
    .click({ force: true });

  Object.keys(details).forEach((key) => {
    const field = details[key];
    if (!field) return;

    const { id, type, value: elementValue, error, invalidValue } = field;

    // Handle invalid value first, only if error element exists
    if (invalidValue && error && error.id) {
      if (type === 'text' || type === 'textarea') {
        cy.typeTextSafe(id, invalidValue);
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(invalidValue).click();
      }

      cy.get('#notification-create-button').click();

      cy.get(error.id, { timeout: 15000 })
        .should('be.visible')
        .and('contain', error.value);
    }

    // Handle valid value
    if (elementValue !== undefined) {
      if (type === 'text' || type === 'textarea') {
        cy.typeTextSafe(id, elementValue);
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(elementValue).click();
      } else if (type === 'checkbox' || type === 'switch') {
        if (elementValue) cy.get(id).click({ force: true });
      }
    }
  });

  // Final Create button click **only once**
  cy.get('#notification-create-button').click();

  // Wait for modal to close (optional, improves stability)
  cy.get('.modal-container', { timeout: 15000 }).should('not.exist');
});
// In commands.js
Cypress.Commands.add('clearAllNotifications', () => {
  // 1. Setup a spy on the API call that fetches the list
  //    (This ensures we don't check the UI before the data arrives)
  cy.intercept('GET', '/api/notifications').as('getNotifications');

  // 2. Navigate to the page
  cy.visit('/notifications');

  // 3. CRITICAL: Wait for the API data to load completely
  cy.wait('@getNotifications');
  
  // 4. Optional: Small UI wait to ensure the DOM renders the data
  cy.wait(200);

  // 5. Now safely check the body
  cy.get('body').then(($body) => {
    // Check if items exist in the DOM
    const $items = $body.find('.navigation-notification-items .item');

    // Case A: List is empty. We are done!
    if ($items.length === 0) {
      cy.log('Success: No notifications found.');
      return; 
    }

    // Case B: Items found. Delete the FIRST one.
    cy.log(`Deleting 1 of ${$items.length} notifications...`);
    
    // Click the first item to open details
    cy.wrap($items.first()).click();

    // Click Delete Icon (Ensure buttons are visible first)
    cy.get('.navigation-header-buttons')
      .should('be.visible')
      .find('> div:nth-child(2)')
      .click({ force: true });

    // Click Confirm on the popup
    cy.get('#notification-delete-confirm')
      .should('be.visible')
      .click({ force: true });

    // 6. RECURSION: Start over to delete the next one.
    //    We do this recursively to avoid "detached element" errors.
    cy.clearAllNotifications();
  });
});






