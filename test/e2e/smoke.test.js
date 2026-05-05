// =============================================================================
// P0 smoke suite — fast end-to-end happy-path coverage.
//
// Demonstrates patterns from _temp/E2E_TESTING_GUIDE.md:
//   §5.1  cy.apiLogin + cy.session
//   §6    intercept aliases instead of cy.wait(ms)
//   §11   one `it` per user-observable behaviour
//
// Run via: `npm run cy:run:smoke`
// =============================================================================

import loginDetails from './setup/fixtures/login.json';
import httpMonitorDetails from './setup/fixtures/monitors/http.json';

describe('Smoke — happy path', () => {
  const { email, password } = loginDetails.ownerUser;

  beforeEach(() => {
    cy.apiLogin(email, password);
  });

  it('owner can load the dashboard', () => {
    cy.interceptApi('GET', '/user', 'getUser');
    cy.visit('/home');
    cy.wait('@getUser').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/home');
  });

  it('owner can navigate to settings', () => {
    cy.visit('/home');
    cy.get('[id="nav-left-settings-button"]').click();
    cy.url().should('include', '/settings');
  });

  it('owner can open the create-monitor modal', () => {
    cy.visit('/home');
    cy.get('[id="home-add-monitor-button"]').click();
    cy.get('[id="monitor-configure-submit-button"]').should('be.visible');
  });

  it('owner can create and immediately delete a HTTP monitor', () => {
    cy.visit('/home');

    cy.createMonitor(httpMonitorDetails);

    cy.equals(
      '[id="monitor-view-menu-name"]',
      `Monitor - ${httpMonitorDetails.name.value}`
    );

    cy.get('[id="monitor-options-button"]').click();
    cy.get('[id="monitor-delete-button"]').click();

    cy.interceptApi('POST', '/monitor/delete', 'deleteMonitor');
    cy.get('[id="monitor-delete-confirm-button"]').click();
    cy.wait('@deleteMonitor').its('response.statusCode').should('eq', 200);

    cy.get('[id="monitor-view-menu-name"]').should('not.exist');
  });
});
