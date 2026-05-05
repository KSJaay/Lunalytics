const API = (path) => `${Cypress.env('apiBase') || '/api'}${path}`;

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});

Cypress.Commands.add('equals', (id, value) => {
  return cy.get(id).invoke('text').should('eq', value);
});

Cypress.Commands.add('typeText', (id, value) => {
  return cy.get(id).type(`${value}`);
});

Cypress.Commands.add('clearText', (id) => {
  return cy.get(id).clear();
});

Cypress.Commands.add('interceptApi', (method, path, alias) => {
  return cy.intercept(method, API(path)).as(alias);
});

Cypress.Commands.add('registerUser', (email, username, password) => {
  cy.interceptApi('POST', '/auth/register', 'registerUser');

  cy.visit('/login');

  cy.typeText('[id="email"]', email).clickOutside();

  cy.get('[id="auth-button"]').click();

  cy.typeText('[id="username"]', username).clickOutside();
  cy.typeText('[id="password"]', password).clickOutside();
  cy.typeText('[id="confirmPassword"]', password).clickOutside();

  cy.get('[id="auth-button"]').click();
  cy.wait('@registerUser');
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.interceptApi('POST', '/auth/login', 'loginUser');

  cy.visit('/login');

  cy.typeText('[id="email"]', email).clickOutside();

  cy.get('[id="auth-button"]').click();

  cy.equals('[id="auth-title"]', 'Enter password');

  cy.typeText('[id="password"]', password).clickOutside();

  cy.get('[id="auth-button"]').click();
  cy.wait('@loginUser');
});

Cypress.Commands.add('deleteUserAccount', (email, password) => {
  cy.loginUser(email, password);

  cy.visit('/settings');

  cy.get('[id="delete-account-button"]').click();

  cy.typeText(
    '[id="settings-delete-account-confirm"]',
    'delete account'
  ).clickOutside();

  cy.get('[id="delete-account-confirm-button"]').click();
});

Cypress.Commands.add('verifyUser', (email, password, verifyUsername) => {
  cy.loginUser(email, password);

  cy.visit('/settings');

  cy.get('[id="manage-team-tab"]').click();

  cy.get(`[id="accept-${verifyUsername}"]`).click();

  cy.get('[id="manage-approve-button"]').click();
});

Cypress.Commands.add('apiLogin', (email, password) => {
  cy.session(
    ['apiLogin', email],
    () => {
      cy.request({
        method: 'POST',
        url: API('/auth/login'),
        body: { email, password },
        failOnStatusCode: true,
      });
    },
    {
      validate: () => {
        cy.request({
          method: 'GET',
          url: API('/user'),
          failOnStatusCode: false,
        })
          .its('status')
          .should('eq', 200);
      },
      cacheAcrossSpecs: true,
    }
  );
});

Cypress.Commands.add('apiRegister', (email, username, password) => {
  return cy.request({
    method: 'POST',
    url: API('/auth/register'),
    body: { email, username, password, confirmPassword: password },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiLogout', () => {
  return cy.request({
    method: 'GET',
    url: API('/auth/logout'),
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('seedMonitor', (monitor) => {
  return cy
    .request({
      method: 'POST',
      url: API('/monitor/add'),
      body: monitor,
      failOnStatusCode: false,
    })
    .then(({ status, body }) => {
      if (status >= 400) {
        Cypress.log({
          name: 'seedMonitor',
          message: `failed (${status}): ${JSON.stringify(body)}`,
        });
      }
      return body;
    });
});

Cypress.Commands.add('seedNotification', (notification) => {
  return cy.request({
    method: 'POST',
    url: API('/notification/create'),
    body: notification,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('seedIncident', (incident) => {
  return cy.request({
    method: 'POST',
    url: API('/incident/create'),
    body: incident,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiDeleteMonitor', (monitorId) => {
  return cy.request({
    method: 'POST',
    url: API('/monitor/delete'),
    body: { monitorId },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiDeleteNotification', (notificationId) => {
  return cy.request({
    method: 'POST',
    url: API('/notification/delete'),
    body: { notificationId },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('createMonitor', (details = {}) => {
  cy.get('[id="home-add-monitor-button"]').click();

  Object.keys(details).forEach((key) => {
    const value = details[key];
    const { id, value: elementValue, error, type, invalidValue } = value;

    if (invalidValue) {
      if (type === 'text' || type === 'textarea') {
        cy.typeText(id, invalidValue);
      }

      cy.get('[id="monitor-configure-submit-button"]').click();
      cy.get(error.id).should('be.visible');
      cy.equals(error.id, error.value);
    }

    if (type === 'click' || type === 'textarea') {
      cy.get(id).click();
    }

    if (elementValue) {
      if (type === 'text' || type === 'textarea') {
        cy.clearText(id);
        cy.typeText(id, elementValue);
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(elementValue).click();
      }
    }
  });

  cy.interceptApi('POST', '/monitor/add', 'createMonitor');
  cy.get('[id="monitor-configure-submit-button"]').click();
  cy.wait('@createMonitor');
});

Cypress.Commands.add('createNotification', (details = {}) => {
  cy.get('[id="add-notification-button"]').click();

  Object.keys(details).forEach((key) => {
    const value = details[key];
    const { id, type, value: elementValue, error, invalidValue } = value;

    if (invalidValue) {
      if (type === 'text') {
        cy.typeText(id, invalidValue).clickOutside();
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(invalidValue).click();
      }

      cy.get('[id="notification-create-button"]').click();

      cy.get(error.id).scrollIntoView().should('be.visible');
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

  cy.interceptApi('POST', '/notification/create', 'createNotification');
  cy.get('[id="notification-create-button"]').click();
  cy.wait('@createNotification');
});

Cypress.Commands.add('editNotification', (details = {}) => {
  Object.keys(details).forEach((key) => {
    const value = details[key];
    const { id, type, value: elementValue, error, invalidValue } = value;

    if (invalidValue) {
      if (type === 'text') {
        cy.typeText(id, invalidValue).clickOutside();
      } else if (type === 'dropdown') {
        cy.get(id).click();
        cy.get(invalidValue).click();
      }

      cy.get('[class="status-action-bar-container"]').should('be.visible');

      cy.get('[id="notification-edit-save-button"]').click();

      cy.get(error.id).scrollIntoView().should('be.visible');
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

  cy.interceptApi('POST', '/notification/edit', 'editNotification');
  cy.get('[id="notification-edit-save-button"]').click();
  cy.wait('@editNotification');

  cy.get('[class="status-action-bar-container"]').should('not.be.visible');
});

Cypress.Commands.add('deleteNotification', () => {
  cy.interceptApi('POST', '/notification/delete', 'deleteNotification');
  cy.get(`[id="notification-header-delete-button"]`).click();
  cy.get('[id="notification-delete-confirm"]').click();
  cy.wait('@deleteNotification');
});
