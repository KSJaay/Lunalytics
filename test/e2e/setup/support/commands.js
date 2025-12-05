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
  cy.get('[class="luna-button primary flat"]', { timeout: 10000 }).click();

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

      cy.get('[class="luna-button green flat"]', { timeout: 10000 }).click();

      if (error) {
        cy.get(error.id, { timeout: 10000 }).should('be.visible');
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
  cy.get('[class="luna-button green flat"]', { timeout: 10000 }).click();
});

Cypress.Commands.add('createNotification', (details = {}) => {
  cy.get('[id="home-add-notification-button"]').click();

  Object.keys(details).forEach((key) => {
    const value = details[key];
    const { id, type, value: elementValue, error, invalidValue } = value;

    if (invalidValue) {
      if (type === 'text') {
        cy.typeText(id, invalidValue);
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(invalidValue).click();
      }

      cy.get('[id="notification-create-button"]').click();

      cy.get(error.id).should('be.visible');
      cy.equals(error.id, error.value);
    }

    if (elementValue) {
      if (type === 'text') {
        cy.clearText(id);
        cy.typeText(id, elementValue);
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(elementValue).click();
      }
    }

    if (type === 'checkbox') {
      cy.get(id).click();
    }
  });

  cy.get('[id="notification-create-button"]').click();
});
