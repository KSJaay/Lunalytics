Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('equals', (id, value) => {
  return cy.get(id).invoke('text').should('eq', value);
});

Cypress.Commands.add('typeText', (id, value) => {
  return cy.get(id).type(value);
});

Cypress.Commands.add('clearText', (id) => {
  return cy.get(id).clear();
});

Cypress.Commands.add('registerUser', (email, username, password) => {
  cy.visit('/register');

  cy.typeText('[id="email"]', email).clickOutside();
  cy.typeText('[id="username"]', username).clickOutside();

  cy.get('[class="auth-button"]').click();

  cy.typeText('[id="password"]', password).clickOutside();
  cy.typeText('[id="confirmPassword"]', password).clickOutside();

  cy.get('[class="auth-button"]').click();
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/login');

  cy.typeText('[id="email"]', email).clickOutside();
  cy.typeText('[id="password"]', password).clickOutside();

  cy.get('[class="auth-button"]').click();
});

Cypress.Commands.add('createMonitor', (details = {}) => {
  cy.get('[id="home-add-monitor-button"]').click();

  Object.keys(details).forEach((key) => {
    const value = details[key];
    const { id, value: elementValue, error, type, invalidValue } = value;

    if (invalidValue) {
      if (type === 'text') {
        cy.typeText(id, invalidValue);
      }

      cy.get('[id="monitor-create-button"]').click();
      cy.get(error.id).should('be.visible');
      cy.equals(error.id, error.value);
    }

    if (type === 'click') {
      cy.get(id).click();
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
  });

  cy.get('[id="monitor-create-button"]').click();
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
