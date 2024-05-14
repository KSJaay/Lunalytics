Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('equals', (id, value) => {
  return cy.get(id).invoke('text').should('eq', value);
});

Cypress.Commands.add('typeText', (id, value) => {
  return cy.get(id).type(value);
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

Cypress.Commands.add(
  'createMonitor',
  (name, type, url, method, interval, retryInterval, timeout) => {
    cy.visit('/');
    cy.get('[id="home-add-monitor-button"]').click();

    if (name && type) {
      cy.typeText(name.id, name.value);
      cy.get(type.id).click();
      cy.get(type.value).click();

      cy.get('[id="Next"]').click();
    }

    if (url && method) {
      cy.typeText(url.id, url.value);

      cy.get(method.id).click();
      cy.get(method.value).click();

      cy.get('[id="Next"]').click();
    }

    if (interval && retryInterval && timeout) {
      cy.typeText(interval.id, interval.value);
      cy.typeText(retryInterval.id, retryInterval.value);
      cy.typeText(timeout.id, timeout.value);

      cy.get('[id="Submit"]').click();
    }
  }
);
